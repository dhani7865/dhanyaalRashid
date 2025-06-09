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
        // console.log("Weather data:", weather); // Uncomment for debugging

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
          $(`#popupDailyPrecip${index}`).text(`${day.temp || "0"}%`)
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

    // console.log("Fetching news for country code:", currentCountryCode); // Uncomment for debugging

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
                $("#countrySelect").val("US") // Fallback
                loadCountryData("US")
              }
            },
            error: (jqXHR, textStatus, errorThrown) => {
              console.error("Error getting location data:", textStatus, errorThrown)
              $("#countrySelect").val("US") // Fallback
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
          $("#countrySelect").val("US") // Fallback
          loadCountryData("US")
          isGettingLocation = false
        },
      )
    } else {
      console.error("Geolocation is not supported by this browser.")
      alert("Geolocation is not supported. Please select a country manually.")
      $("#countrySelect").val("US") // Fallback
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
        if (result.status.name === "ok" && result.data && result.data.properties) {
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
          loadCurrencyData(countryCode)
          loadWikipediaData(countryCode)
          loadPointsOfInterest(countryCode)
        } else {
          console.error("Error loading country border: Invalid data structure", result)
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
        if (result.status.name === "ok" && result.data) {
          const countryData = result.data
          // console.log("Country Data for Modal:", countryData); // Uncomment for debugging

          // --- Country Information Modal ("At a glance") ---
          $("#infoModalLabel").html(
            `<i class="fas fa-circle-info fa-lg mr-2"></i> ${countryData.name?.common || currentCountryName || "Country Details"}`,
          )

          $("#capitalCity").text(countryData.capital?.[0] || "N/A")
          $("#continent").text(countryData.region || "N/A")

          const languages = countryData.languages ? Object.values(countryData.languages).join(", ") : "N/A"
          $("#languages").text(languages)

          const currencyInfo = countryData.currencies
            ? Object.values(countryData.currencies)
              .map((c) => `${c.name || ""} (${c.symbol || ""})`) // Added checks for c.name and c.symbol
              .join(", ")
            : "N/A"
          $("#currency").text(currencyInfo)

          $("#isoAlpha2").text(countryData.cca2 || "N/A")
          $("#isoAlpha3").text(countryData.cca3 || "N/A")
          $("#population").text(
            typeof countryData.population === "number" ? countryData.population.toLocaleString() : "N/A",
          )
          $("#areaInSqKm").text(typeof countryData.area === "number" ? countryData.area.toLocaleString() : "N/A")

          // This line correctly handles the postalCode object to display the format string
          $("#postalCodeFormat").text(countryData.postalCode?.format || "N/A")

          // --- Currency Converter Modal (Separate Modal) ---
          const currencyNamesForConverter = countryData.currencies
            ? Object.values(countryData.currencies)
              .map((c) => `${c.name || ""} (${c.symbol || ""})`)
              .join(", ")
            : "N/A"

          $("#currencyCountry").text(countryData.name?.common || currentCountryName || "Selected Country")
          $("#currencyCodes").text(currencyNamesForConverter)

          if (countryData.currencies) {
            const mainCurrency = Object.keys(countryData.currencies)[0]
            if (exchangeRates && mainCurrency) {
              // Ensure mainCurrency is valid
              updateCurrencyConverter(mainCurrency)
            } else if (exchangeRates) {
              updateCurrencyConverter("EUR") // Fallback if country has no specific currency or mainCurrency is undefined
            }
          } else if (exchangeRates) {
            updateCurrencyConverter("EUR") // Fallback if no currencies object
          }
        } else {
          console.error("Failed to load or parse country data from getRestCountriesData.php:", result)
          // Display error in modal
          $("#infoModalLabel").html(`<i class="fas fa-circle-info fa-lg mr-2"></i>Error`)
          $("#capitalCity").text("Data Error")
          // ... (set other fields to "Data Error" or "N/A")
          $("#postalCodeFormat").text("Data Error")
        }
      },
      error: (jqXHR, textStatus, errorThrown) => {
        console.error("Error AJAX call to getRestCountriesData.php:", textStatus, errorThrown)
        // Display error in modal
        $("#infoModalLabel").html(`<i class="fas fa-circle-info fa-lg mr-2"></i>Error`)
        $("#capitalCity").text("AJAX Error")
        // ... (set other fields to "AJAX Error" or "N/A")
        $("#postalCodeFormat").text("AJAX Error")
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
        if (result.status.name === "ok" && result.data && result.data.rates) {
          exchangeRates = result.data
          const rates = exchangeRates.rates
          const lastUpdated = new Date(exchangeRates.timestamp * 1000).toLocaleDateString()

          let options = ""
          for (const currency in rates) {
            options += `<option value="${currency}">${currency}</option>`
          }

          $("#fromCurrency").html(options)
          $("#toCurrency").html(options)
          $("#fromCurrency").val("USD")
          $("#conversionDate").text(`Last updated: ${lastUpdated}`)

          // This nested AJAX call might be redundant if loadRestCountriesData already ran
          // and set the currency. Consider optimizing if currentCountryCode's data is already fetched.
          // For now, keeping it to ensure currency converter gets updated if this runs first.
          $.ajax({
            url: "./php/getRestCountriesData.php",
            type: "GET",
            dataType: "json",
            data: { countryCode: countryCode },
            success: (countryResult) => {
              if (countryResult.status.name === "ok" && countryResult.data && countryResult.data.currencies) {
                const countryCurrency = Object.keys(countryResult.data.currencies)[0]
                if (countryCurrency) {
                  updateCurrencyConverter(countryCurrency)
                } else {
                  updateCurrencyConverter("EUR") // Fallback
                }
              } else {
                updateCurrencyConverter("EUR") // Fallback
              }
            },
            error: () => {
              updateCurrencyConverter("EUR") // Fallback
            },
          })

          $("#convertBtn").off("click").on("click", performConversion)
          $("#amountInput, #fromCurrency, #toCurrency").on("change", performConversion)
        } else {
          console.error("Error loading currency data or rates missing:", result)
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
      console.warn("Exchange rates not loaded yet for currency converter.")
      return
    }

    if (exchangeRates.rates[countryCurrency]) {
      $("#toCurrency").val(countryCurrency)
    } else {
      console.warn(`Currency ${countryCurrency} not found in exchange rates, defaulting to EUR for converter.`)
      $("#toCurrency").val("EUR") // Default to EUR if country's currency not in rates
    }
    performConversion() // Perform initial conversion
  }

  // Perform currency conversion
  function performConversion() {
    if (!exchangeRates || !exchangeRates.rates) {
      // console.warn("Exchange rates not available for conversion."); // Uncomment for debugging
      $("#conversionResult").text("Exchange rates not available.")
      return
    }

    const amountStr = $("#amountInput").val()
    if (amountStr === "" || amountStr === null) {
      $("#amountInput").val("1") // Default if empty
    }

    const amount = Number.parseFloat($("#amountInput").val())
    const fromCurrency = $("#fromCurrency").val()
    const toCurrency = $("#toCurrency").val()

    if (isNaN(amount) || amount <= 0) {
      $("#conversionResult").text("Please enter a valid amount.")
      return
    }
    if (!fromCurrency || !toCurrency) {
      $("#conversionResult").text("Please select currencies.")
      return
    }

    const fromRate = exchangeRates.rates[fromCurrency]
    const toRate = exchangeRates.rates[toCurrency]

    if (typeof fromRate === "undefined" || typeof toRate === "undefined") {
      $("#conversionResult").text("Rate not available for selected currency.")
      return
    }

    if (fromCurrency === toCurrency) {
      $("#conversionResult").text(`${amount.toFixed(2)} ${fromCurrency} = ${amount.toFixed(2)} ${toCurrency}`)
      return
    }

    // Base currency of OpenExchangeRates is USD if not specified, but their free plan is EUR based.
    // Assuming the API returns rates relative to a common base (e.g., EUR or USD as per your API plan)
    // If your API's base is EUR (as often with free OpenExchangeRates):
    const amountInBase = amount / fromRate // Convert 'fromCurrency' amount to base currency (EUR)
    const convertedAmount = amountInBase * toRate // Convert from base currency (EUR) to 'toCurrency'

    $("#conversionResult").text(`${amount.toFixed(2)} ${fromCurrency} = ${convertedAmount.toFixed(2)} ${toCurrency}`)
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
        if (result.status.name === "ok" && result.data) {
          const wikiData = result.data

          $("#wikiCountry").text(currentCountryName || "Selected Country") // Use currentCountryName

          let articlesHTML = ""
          if (wikiData.length === 0) {
            articlesHTML = "<p>No Wikipedia articles found.</p>"
          } else {
            // Filter articles to be more relevant to the country
            const filteredArticles = wikiData.filter((article) => {
              const title = article.title?.toLowerCase() || ""
              const summary = article.summary?.toLowerCase() || ""
              const countryNameLower = currentCountryName?.toLowerCase() || ""

              if (!countryNameLower) return true // If country name isn't set, show all fetched

              return (
                title.includes(countryNameLower) ||
                summary.includes(countryNameLower) ||
                title.includes("history") ||
                title.includes("geography") ||
                title.includes("culture") ||
                title.includes("economy")
              )
            })

            const articlesToShow = filteredArticles.length > 0 ? filteredArticles.slice(0, 10) : wikiData.slice(0, 10) // Show max 10

            articlesToShow.forEach((article) => {
              articlesHTML += `
                <a href="https://${article.wikipediaUrl}" target="_blank" class="list-group-item list-group-item-action">
                <div class="d-flex w-100 justify-content-between">
                    <h5 class="mb-1">${article.title || "Untitled Article"}</h5>
                </div>
                <p class="mb-1">${article.summary || "No summary available."}</p>
                <small class="text-muted">Click to read more</small>
                </a>
            `
            })
          }
          $("#wikiArticles").html(articlesHTML)
        } else {
          console.error("Error loading Wikipedia data or data is invalid:", result)
          $("#wikiArticles").html("<p>Could not load Wikipedia articles.</p>")
        }
      },
      error: (jqXHR, textStatus, errorThrown) => {
        console.error("Error loading Wikipedia data:", textStatus, errorThrown)
        $("#wikiArticles").html("<p>Error fetching Wikipedia articles.</p>")
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
        if (result.status.name === "ok" && result.data) {
          const pois = result.data

          pois.forEach((poi) => {
            if (typeof poi.lat === "undefined" || typeof poi.lng === "undefined") {
              console.warn("POI missing lat/lng:", poi)
              return // Skip this POI
            }
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
              <div class="popup-header">${poi.name || "Unknown POI"}</div>
              <div class="popup-content">
                <p><strong>Type:</strong> ${poi.fcodeName || "N/A"}</p>
                ${poi.population ? `<p><strong>Population:</strong> ${poi.population.toLocaleString()}</p>` : ""}
                <p><strong>Country:</strong> ${currentCountryName || "N/A"}</p>
                ${poi.adminName1 ? `<p><strong>Region:</strong> ${poi.adminName1}</p>` : ""}
              </div>
            `

            marker.bindPopup(popupContent, { className: "custom-popup" })
            markerGroup.addLayer(marker)
          })

          map.addLayer(markerGroup) // Add group to map even if it's empty, to allow toggling
        } else {
          console.error(`Error loading ${featureCode} data or data is invalid:`, result)
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
    initMap()
    loadCountryList()
    getUserLocation() // This will call loadCountryData on success or fallback
    $("#preloader").fadeOut()
  }

  // Start the application
  init()
})
