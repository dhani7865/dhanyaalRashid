$(document).ready(() => {
  // Global variables
  let map
  let countryBorder
  let cityMarkers
  let airportMarkers
  let universityMarkers
  let stadiumMarkers
  let currentCountryCode = ""
  let currentCountryName = ""
  let exchangeRates = null
  let baseMaps
  let overlayMaps

  // Map tile layers
  const streetLayer = L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  })

  const satelliteLayer = L.tileLayer(
    "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
    {
      attribution:
        "Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community",
    },
  )

  // Initialize the map
  function initMap() {
    map = L.map("mapContainer", {
      center: [0, 0],
      zoom: 2,
      minZoom: 2,
      maxZoom: 18,
      layers: [streetLayer],
    })

    // Initialize marker cluster groups
    cityMarkers = L.markerClusterGroup({
      showCoverageOnHover: false,
      disableClusteringAtZoom: 10,
      spiderfyOnMaxZoom: true,
    })

    airportMarkers = L.markerClusterGroup({
      showCoverageOnHover: false,
      disableClusteringAtZoom: 10,
      spiderfyOnMaxZoom: true,
    })

    universityMarkers = L.markerClusterGroup({
      showCoverageOnHover: false,
      disableClusteringAtZoom: 10,
      spiderfyOnMaxZoom: true,
    })

    stadiumMarkers = L.markerClusterGroup({
      showCoverageOnHover: false,
      disableClusteringAtZoom: 10,
      spiderfyOnMaxZoom: true,
    })

    // Set up base maps and overlay maps
    baseMaps = {
      Streets: streetLayer,
      Satellite: satelliteLayer,
    }

    overlayMaps = {
      Cities: cityMarkers,
      Airports: airportMarkers,
      Universities: universityMarkers,
      Stadiums: stadiumMarkers,
    }

    // Add layer control
    L.control
      .layers(baseMaps, overlayMaps, {
        position: "topright",
        collapsed: true,
      })
      .addTo(map)

    // Add easy buttons for modals
    L.easyButton(
      "fa-info",
      () => {
        $("#infoModal").modal("show")
      },
      "Country Information",
    ).addTo(map)

    L.easyButton(
      "fa-cloud",
      () => {
        $("#weatherModal").modal("show")
        fetchAndUpdateWeatherData(currentCountryCode)
      },
      "Weather Information",
    ).addTo(map)

    L.easyButton(
      "fa-dollar-sign",
      () => {
        $("#currencyModal").modal("show")
      },
      "Currency Converter",
    ).addTo(map)

    L.easyButton(
      "fa-w",
      () => {
        $("#wikiModal").modal("show")
      },
      "Wikipedia Articles",
    ).addTo(map)

    L.easyButton(
      "fa-newspaper",
      () => {
        $("#newsModal").modal("show")
        updateNewsPopupData()
      },
      "Latest News",
    ).addTo(map)
  }

  /**
   * Fetches and updates weather data in the modal.
   * @param {string} countryCode - The country code for weather data.
   */
  function fetchAndUpdateWeatherData(countryCode) {
    if (!countryCode) {
      console.error("Country code is required for weather data")
      $("#popupWeatherDesc").text("Country code not provided")
      return
    }

    $.ajax({
      url: "./php/getWeatherData.php",
      type: "GET",
      dataType: "json",
      data: { countryCode },
      success: (result) => {
        if (result.status.name !== "ok" || !result.data) {
          console.error("Invalid weather data")
          $("#popupWeatherDesc").text("Failed to load weather data")
          return
        }

        const weather = result.data
        console.log("Weather data:", weather)

        // Validate required fields
        if (!weather.city || !weather.forecast || !weather.daily_forecast) {
          console.error("Incomplete weather data")
          $("#popupWeatherDesc").text("Incomplete weather data")
          return
        }

        // Split city and country more robustly
        const cityParts = weather.city.split(",").map((part) => part.trim())
        const city = cityParts[0] // First part is city
        const country = cityParts[cityParts.length - 1] // Last part is country

        // Unescape image URLs
        const unescapeUrl = (url) => (url ? url.replace(/\\\//g, "/") : "https://placehold.co/60")

        // Manual DOM updates for current weather
        $("#popupWeatherCity").text(city || "---")
        $("#popupWeatherCountry").text(country || "---")
        $("#popupWeatherTemp").text(Math.round(weather.temperature))
        $("#popupWeatherDesc").text(
          weather.description ? weather.description.charAt(0).toUpperCase() + weather.description.slice(1) : "--",
        )

        const weatherIconEl = $("#popupWeatherIcon")
        if (weatherIconEl.length) {
          const iconUrl = unescapeUrl(weather.icon)
          weatherIconEl.attr("src", iconUrl).on("error", function () {
            $(this).attr("src", "https://placehold.co/60")
          })
        }

        $("#popupWeatherHumidity").text(`${weather.humidity}%`)
        $("#popupWeatherWind").text(`${(weather.wind * 2.237).toFixed(1)} mph`)

        // Manual updates for today's forecast
        const updateForecast = (period, data) => {
          if (!data) {
            console.warn(`No forecast data for ${period}`)
            return
          }
          $(`#popupForecast${period}Temp`).text(`${Math.round(data.temp)}°C`)
          const forecastIconEl = $(`#popupForecast${period}Icon`)
          if (forecastIconEl.length) {
            const iconUrl = unescapeUrl(data.icon)
            forecastIconEl.attr("src", iconUrl).on("error", function () {
              $(this).attr("src", "https://placehold.co/45")
            })
          }
          $(`#popupForecast${period}Desc`).text(
            data.description ? data.description.charAt(0).toUpperCase() + data.description.slice(1) : "--",
          )
        }

        updateForecast("Morning", weather.forecast.morning)
        updateForecast("Afternoon", weather.forecast.afternoon)
        updateForecast("Evening", weather.forecast.evening)

        // Manual updates for daily forecast
        for (let i = 0; i < Math.min(weather.daily_forecast.length, 3); i++) {
          const day = weather.daily_forecast[i]
          const index = i + 1

          $(`#popupDailyWeekday${index}`).text(day.weekday || "--")
          const dailyIconEl = $(`#popupDailyIcon${index}`)
          if (dailyIconEl.length) {
            const iconUrl = unescapeUrl(day.icon)
            dailyIconEl.attr("src", iconUrl).on("error", function () {
              $(this).attr("src", "https://placehold.co/60")
            })
          }
          $(`#popupDailySunrise${index}`).text(day.sunrise || "--")
          $(`#popupDailySunset${index}`).text(day.sunset || "--")
          $(`#popupDailyPrecip${index}`).text(`${day.precipitation || "0"}%`)
        }
      },
      error: (jqXHR, textStatus, errorThrown) => {
        console.error("Error loading weather data:", textStatus, errorThrown)
        $("#popupWeatherDesc").text("Failed to load weather data")
      },
    })
  }

  /**
   * Fetches and updates news data in the modal.
   */
  function updateNewsPopupData() {
    if (!currentCountryCode) {
      console.error("Country code is required for news data")
      $("#popupNewsContent").html('<div class="p-3">Please select a country</div>')
      return
    }

    console.log("Fetching news for country code:", currentCountryCode)

    $.ajax({
      url: "php/getNewsData.php",
      type: "GET",
      dataType: "json",
      data: { countryCode: currentCountryCode },
      success: (result) => {
        if (result.status.name === "ok") {
          const newsData = result.data
          let newsContentHTML = ""

          if (newsData.length === 0) {
            newsContentHTML = '<div class="p-3">No news articles available.</div>'
          } else {
            newsData.forEach((article) => {
              const date = new Date(article.publishedAt)
              const formattedDate = `${date.toLocaleDateString()} ${date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`

              newsContentHTML += `
                <div class="news-item">
                  <div class="news-title">${article.title}</div>
                  <div class="news-date">${formattedDate}</div>
                  <a href="${article.url}" target="_blank" class="news-link">Read More...</a>
                </div>
              `
            })
          }

          $("#popupNewsContent").html(newsContentHTML)
        } else {
          const errorMsg = result.status?.description || "Failed to load news."
          $("#popupNewsContent").html(`<div class="p-3">${errorMsg}</div>`)
        }
      },
      error: (jqXHR, textStatus, errorThrown) => {
        console.error("Error loading news data:", textStatus, errorThrown, jqXHR.responseText)
        $("#popupNewsContent").html('<div class="p-3">Failed to load news. Please try again later.</div>')
      },
    })
  }

  // Load country list for dropdown
  function loadCountryList() {
    $.ajax({
      url: "./php/getCountryList.php",
      type: "GET",
      dataType: "json",
      success: (result) => {
        if (result.status.name === "ok") {
          const countries = result.data

          // Sort countries alphabetically
          countries.sort((a, b) => a.name.localeCompare(b.name))

          // Populate dropdown
          let options = '<option value="" selected>Select a country</option>'

          countries.forEach((country) => {
            options += `<option value="${country.iso2}">${country.name}</option>`
          })

          $("#countrySelect").html(options)
        }
      },
      error: (jqXHR, textStatus, errorThrown) => {
        console.error("Error loading country list:", textStatus, errorThrown)
      },
    })
  }

  // Get user's current location
  let isGettingLocation = false

  function getUserLocation() {
    if (isGettingLocation) return
    isGettingLocation = true

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude
          const lng = position.coords.longitude

          $.ajax({
            url: "./php/getOpenCageData.php",
            type: "GET",
            dataType: "json",
            data: { lat, lng },
            success: (result) => {
              if (result.status.name === "ok" && result.data.countryCode) {
                const countryCode = result.data.countryCode
                $("#countrySelect").val(countryCode)
                loadCountryData(countryCode)
              } else {
                $("#countrySelect").val("US")
                loadCountryData("US")
              }
            },
            error: (jqXHR, textStatus, errorThrown) => {
              console.error("Error getting location data:", textStatus, errorThrown)
              $("#countrySelect").val("US")
              loadCountryData("US")
            },
            complete: () => {
              isGettingLocation = false
            },
          })
        },
        (error) => {
          console.error("Error getting user location:", error)
          let errorMessage = "Unable to get your location."
          if (error.code === 1 && error.message.includes("secure origins")) {
            errorMessage = "Location access requires a secure connection (HTTPS). Please select a country manually."
            alert(errorMessage)
          }
          $("#countrySelect").val("US")
          loadCountryData("US")
          isGettingLocation = false
        },
      )
    } else {
      console.error("Geolocation is not supported by this browser.")
      alert("Geolocation is not supported. Please select a country manually.")
      $("#countrySelect").val("US")
      loadCountryData("US")
      isGettingLocation = false
    }
  }

  // Load country data
  function loadCountryData(countryCode) {
    // Clear previous data
    if (countryBorder) {
      map.removeLayer(countryBorder)
    }

    cityMarkers.clearLayers()
    airportMarkers.clearLayers()
    universityMarkers.clearLayers()
    stadiumMarkers.clearLayers()

    currentCountryCode = countryCode

    // Get country border
    $.ajax({
      url: "./php/getCountryBorders.php",
      type: "GET",
      dataType: "json",
      data: {
        countryCode: countryCode,
      },
      success: (result) => {
        if (result.status.name === "ok") {
          // Add country border to map with improved styling
          countryBorder = L.geoJSON(result.data, {
            style: {
              color: "#e74c3c",
              weight: 2,
              opacity: 0.8,
              fillColor: "#e74c3c",
              fillOpacity: 0.2,
            },
          }).addTo(map)

          // Fit map to country bounds
          map.fitBounds(countryBorder.getBounds())

          // Get country name from the GeoJSON properties
          currentCountryName = result.data.properties.name

          // Load other country data
          loadRestCountriesData(countryCode)
          // Data for modals will be fetched when they are opened
          loadCurrencyData(countryCode) // Pre-load currency rates
          loadWikipediaData(countryCode) // Pre-load wiki data for modal
          loadPointsOfInterest(countryCode) // Load POIs
          // News and Weather data will be fetched when their respective modals/popups are opened
        }
      },
      error: (jqXHR, textStatus, errorThrown) => {
        console.error("Error loading country border:", textStatus, errorThrown)
      },
    })
  }

  // Load Rest Countries data
  function loadRestCountriesData(countryCode) {
    $.ajax({
      url: "./php/getRestCountriesData.php",
      type: "GET",
      dataType: "json",
      data: {
        countryCode: countryCode,
      },
      success: (result) => {
        if (result.status.name === "ok") {
          const countryData = result.data

          // Update info modal
          $("#countryFlag").attr("src", countryData.flags.png)
          $("#countryName").text(countryData.name.common)
          $("#countryCapital").text(countryData.capital ? countryData.capital[0] : "N/A")
          $("#countryPopulation").text(countryData.population.toLocaleString())
          $("#countryRegion").text(`${countryData.subregion}, ${countryData.region}`)

          // Format languages
          const languages = countryData.languages ? Object.values(countryData.languages).join(", ") : "N/A"
          $("#countryLanguages").text(languages)

          $("#countryArea").text(countryData.area ? countryData.area.toLocaleString() : "N/A")
          $("#countryCallingCode").text(countryData.idd.root + countryData.idd.suffixes[0])
          $("#countryDrivingSide").text(countryData.car.side.charAt(0).toUpperCase() + countryData.car.side.slice(1))

          // Update currency modal
          const currencyCodes = countryData.currencies ? Object.keys(countryData.currencies).join(", ") : "N/A"
          const currencyNames = countryData.currencies
            ? Object.values(countryData.currencies)
              .map((c) => `${c.name} (${c.symbol})`)
              .join(", ")
            : "N/A"

          $("#currencyCountry").text(countryData.name.common)
          $("#currencyCodes").text(currencyNames)

          // Store the country's currency for later use
          if (countryData.currencies) {
            const mainCurrency = Object.keys(countryData.currencies)[0]
            // If we already have exchange rates, update the currency converter
            if (exchangeRates) {
              updateCurrencyConverter(mainCurrency)
            }
          }
        }
      },
      error: (jqXHR, textStatus, errorThrown) => {
        console.error("Error loading country data:", textStatus, errorThrown)
      },
    })
  }

  // Load currency data
  function loadCurrencyData(countryCode) {
    $.ajax({
      url: "./php/getExchangeRates.php",
      type: "GET",
      dataType: "json",
      success: (result) => {
        if (result.status.name === "ok") {
          exchangeRates = result.data
          const rates = exchangeRates.rates
          const baseCurrency = exchangeRates.base
          const lastUpdated = new Date(exchangeRates.timestamp * 1000).toLocaleDateString()

          // Populate currency dropdowns
          let options = ""
          for (const currency in rates) {
            options += `<option value="${currency}">${currency}</option>`
          }

          $("#fromCurrency").html(options)
          $("#toCurrency").html(options)

          // Set default values
          $("#fromCurrency").val("USD")
          $("#conversionDate").text(`Last updated: ${lastUpdated}`)

          // Get the country's currency from Rest Countries data
          $.ajax({
            url: "./php/getRestCountriesData.php",
            type: "GET",
            dataType: "json",
            data: { countryCode: countryCode },
            success: (countryResult) => {
              if (countryResult.status.name === "ok" && countryResult.data.currencies) {
                const countryCurrency = Object.keys(countryResult.data.currencies)[0]
                updateCurrencyConverter(countryCurrency)
              } else {
                updateCurrencyConverter("EUR")
              }
            },
            error: () => {
              updateCurrencyConverter("EUR")
            },
          })

          // Set up conversion button
          $("#convertBtn").off("click").on("click", performConversion)

          // Set up input change events
          $("#amountInput, #fromCurrency, #toCurrency").on("change", performConversion)
        }
      },
      error: (jqXHR, textStatus, errorThrown) => {
        console.error("Error loading currency data:", textStatus, errorThrown)
      },
    })
  }

  // Update currency converter with country currency
  function updateCurrencyConverter(countryCurrency) {
    if (!exchangeRates || !exchangeRates.rates) {
      console.warn("Exchange rates not loaded yet")
      return
    }

    // Check if the currency exists in our rates
    if (exchangeRates.rates[countryCurrency]) {
      $("#toCurrency").val(countryCurrency)
    } else {
      console.warn(`Currency ${countryCurrency} not found in exchange rates, using EUR`)
      $("#toCurrency").val("EUR")
    }

    // Perform initial conversion
    performConversion()
  }

  // Perform currency conversion
  function performConversion() {
    if (!exchangeRates || !exchangeRates.rates) {
      console.warn("Exchange rates not loaded yet")
      $("#conversionResult").text("Exchange rates not available")
      return
    }

    // Set default values if inputs are empty
    if (!$("#amountInput").val()) {
      $("#amountInput").val("1")
    }

    const amount = Number.parseFloat($("#amountInput").val())
    const fromCurrency = $("#fromCurrency").val()
    const toCurrency = $("#toCurrency").val()

    // Validate inputs
    if (isNaN(amount) || amount <= 0) {
      $("#conversionResult").text("Please enter a valid amount")
      return
    }

    // Calculate conversion (rates are relative to EUR base)
    const fromRate = exchangeRates.rates[fromCurrency] || 1
    const toRate = exchangeRates.rates[toCurrency] || 1

    if (fromCurrency === toCurrency) {
      $("#conversionResult").text(`${amount} ${fromCurrency} = ${amount} ${toCurrency}`)
      return
    }

    // Convert: amount in fromCurrency -> EUR -> toCurrency
    const eurAmount = amount / fromRate
    const convertedAmount = eurAmount * toRate

    // Display result
    $("#conversionResult").text(`${amount} ${fromCurrency} = ${convertedAmount.toFixed(2)} ${toCurrency}`)
  }

  // Load Wikipedia data
  function loadWikipediaData(countryCode) {
    $.ajax({
      url: "./php/getWikipediaData.php",
      type: "GET",
      dataType: "json",
      data: {
        countryCode: countryCode,
      },
      success: (result) => {
        if (result.status.name === "ok") {
          const wikiData = result.data

          // Update wiki modal
          $("#wikiCountry").text(currentCountryName)

          let articlesHTML = ""

          // Filter articles to be more relevant to the country
          const filteredArticles = wikiData.filter((article) => {
            const title = article.title.toLowerCase()
            const summary = article.summary.toLowerCase()
            const countryNameLower = currentCountryName.toLowerCase()

            // Include articles that mention the country name or are clearly related
            return (
              title.includes(countryNameLower) ||
              summary.includes(countryNameLower) ||
              title.includes("history") ||
              title.includes("geography") ||
              title.includes("culture") ||
              title.includes("economy")
            )
          })

          const articlesToShow = filteredArticles.length > 0 ? filteredArticles : wikiData.slice(0, 10)

          articlesToShow.forEach((article) => {
            articlesHTML += `
            <a href="https://${article.wikipediaUrl}" target="_blank" class="list-group-item list-group-item-action">
              <div class="d-flex w-100 justify-content-between">
                <h5 class="mb-1">${article.title}</h5>
              </div>
              <p class="mb-1">${article.summary}</p>
              <small class="text-muted">Click to read more</small>
            </a>
          `
          })

          $("#wikiArticles").html(articlesHTML)
        }
      },
      error: (jqXHR, textStatus, errorThrown) => {
        console.error("Error loading Wikipedia data:", textStatus, errorThrown)
      },
    })
  }

  // Load Points of Interest (cities, airports, universities, stadiums)
  function loadPointsOfInterest(countryCode) {
    // Load cities
    loadPOIByType(countryCode, "P", "PPLA,PPLC,PPL", cityMarkers, "blue", "fa-city", "square")

    // Load airports
    loadPOIByType(countryCode, "S", "AIRP", airportMarkers, "#3498db", "fa-plane", "penta")

    // Load universities
    loadPOIByType(countryCode, "S", "UNIV", universityMarkers, "#f39c12", "fa-university", "circle")

    // Load stadiums
    loadPOIByType(countryCode, "S", "STDM", stadiumMarkers, "#9b59b6", "fa-futbol", "star")
  }

  // Load POI by type
  function loadPOIByType(countryCode, featureClass, featureCode, markerGroup, color, icon, shape) {
    $.ajax({
      url: "./php/getGeonamesData.php",
      type: "GET",
      dataType: "json",
      data: {
        countryCode: countryCode,
        featureClass: featureClass,
        featureCode: featureCode,
      },
      success: (result) => {
        if (result.status.name === "ok") {
          const pois = result.data

          // Add POI markers
          pois.forEach((poi) => {
            const poiIcon = L.ExtraMarkers.icon({
              icon: icon,
              markerColor: color,
              shape: shape,
              prefix: "fas",
            })

            const marker = L.marker([poi.lat, poi.lng], {
              icon: poiIcon,
            })

            const popupContent = `
              <div class="popup-header">${poi.name}</div>
              <div class="popup-content">
                <p><strong>Type:</strong> ${poi.fcodeName}</p>
                ${poi.population ? `<p><strong>Population:</strong> ${poi.population.toLocaleString()}</p>` : ""}
                <p><strong>Country:</strong> ${currentCountryName}</p>
                ${poi.adminName1 ? `<p><strong>Region:</strong> ${poi.adminName1}</p>` : ""}
              </div>
            `

            marker.bindPopup(popupContent, { className: "custom-popup" })
            markerGroup.addLayer(marker)
          })

          // Add marker group to map
          map.addLayer(markerGroup)
        }
      },
      error: (jqXHR, textStatus, errorThrown) => {
        console.error(`Error loading ${featureCode} data:`, textStatus, errorThrown)
      },
    })
  }

  // Event listeners
  $("#countrySelect").on("change", function () {
    const countryCode = $(this).val()

    if (countryCode) {
      loadCountryData(countryCode)
    }
  })

  // Initialize the application
  function init() {
    // Initialize map
    initMap()

    // Load country list
    loadCountryList()

    // Get user location
    getUserLocation()

    // Hide preloader
    $("#preloader").fadeOut()
  }

  // Start the application
  init()
})
