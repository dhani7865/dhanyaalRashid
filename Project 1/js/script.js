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
  let weatherPopup = null
  let newsPopup = null
  let baseMaps = {}
  let overlayMaps = {}
  let layerControl = null

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
    layerControl = L.control
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
        showWeatherPopup()
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
        showNewsPopup()
      },
      "Latest News",
    ).addTo(map)
  }


  /**
   * Shows a weather popup on the map with current and forecast data.
   */
  function showWeatherPopup() {
    // Check if map is initialized
    if (!map) {
      console.error("Map is not initialized");
      return;
    }

    // Close existing popup if open
    if (weatherPopup) {
      map.closePopup(weatherPopup);
    }

    // Get center of current view
    const center = map.getCenter();

    // Create popup content
    const popupContent = `
    <div class="weather-card" role="dialog" aria-label="Weather Forecast">
      <div class="weather-header">
        <h3>Weather Forecast</h3>
      </div>
      <div class="weather-content">
        <div class="current-weather">
          <div class="location">
            <h2 id="popupWeatherCity">---</h2>
            <h2 id="popupWeatherCountry">---</h2>
          </div>
          <div class="temperature">
            <img id="popupWeatherIcon" src="https://placehold.co/60" class="temp-icon" alt="Weather icon">
            <div id="popupWeatherTemp" class="temp-value">--</div>
            <div class="temp-unit">°C</div>
          </div>
          <div class="weather-details">
            <p><strong>Humidity:</strong><br><span id="popupWeatherHumidity">--%</span></p>
            <p><strong>Wind:</strong><br><span id="popupWeatherWind">-- mph</span></p>
          </div>
        </div>
        <div id="popupWeatherDesc" class="temp-desc">Loading...</div>
        <div class="forecast">
          <div class="forecast-item">
            <h3>Morning</h3>
            <div class="forecast-content">
              <img id="popupForecastMorningIcon" src="https://placehold.co/45" alt="Morning weather">
              <div>
                <div id="popupForecastMorningTemp" class="forecast-temp">--°C</div>
                <div id="popupForecastMorningDesc" class="forecast-desc">----</div>
              </div>
            </div>
          </div>
          <div class="forecast-item">
            <h3>Afternoon</h3>
            <div class="forecast-content">
              <img id="popupForecastAfternoonIcon" src="https://placehold.co/45" alt="Afternoon weather">
              <div>
                <div id="popupForecastAfternoonTemp" class="forecast-temp">--°C</div>
                <div id="popupForecastAfternoonDesc" class="forecast-desc">----</div>
              </div>
            </div>
          </div>
          <div class="forecast-item">
            <h3>Evening</h3>
            <div class="forecast-content">
              <img id="popupForecastEveningIcon" src="https://placehold.co/45" alt="Evening weather">
              <div>
                <div id="popupForecastEveningTemp" class="forecast-temp">--°C</div>
                <div id="popupForecastEveningDesc" class="forecast-desc">----</div>
              </div>
            </div>
          </div>
        </div>
        <div class="daily-forecast">
          <div class="daily-item">
            <div class="daily-date">
              <div id="popupDailyWeekday1">Sun</div>
              <div id="popupDailySunrise1">--</div>
            </div>
            <div class="daily-icon">
              <img id="popupDailyIcon1" src="https://placehold.co/60" alt="Weather icon">
            </div>
            <div class="daily-temp">
              <div id="popupDailySunset1">--</div>
              <div id="popupDailyPrecip1">--</div>
            </div>
          </div>
          <div class="daily-item">
            <div class="daily-date">
              <div id="popupDailyWeekday2">Sun</div>
              <div id="popupDailySunrise2">--</div>
            </div>
            <div class="daily-icon">
              <img id="popupDailyIcon2" src="https://placehold.co/60" alt="Weather icon">
            </div>
            <div class="daily-temp">
              <div id="popupDailySunset2">--</div>
              <div id="popupDailyPrecip2">--</div>
            </div>
          </div>
          <div class="daily-item">
            <div class="daily-date">
              <div id="popupDailyWeekday3">Sun</div>
              <div id="popupDailySunrise3">--</div>
            </div>
            <div class="daily-icon">
              <img id="popupDailyIcon3" src="https://placehold.co/60" alt="Weather icon">
            </div>
            <div class="daily-temp">
              <div id="popupDailySunset3">--</div>
              <div id="popupDailyPrecip3">--</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;

    // Create popup
    weatherPopup = L.popup({
      maxWidth: 400,
      className: "custom-popup",
      closeButton: true,
    })
      .setLatLng(center)
      .setContent(popupContent);

    // Open popup and update data after DOM is ready
    weatherPopup.openOn(map);
    waitForPopupDom(() => {
      fetchAndUpdateWeatherData(currentCountryCode);
    });
  }

  /**
   * Closes the weather popup if it exists.
   */
  function closeWeatherPopup() {
    if (weatherPopup && map) {
      map.closePopup(weatherPopup);
      weatherPopup = null; // Reset to prevent stale references
    }
  }

  /**
   * Waits for the popup DOM to be ready before executing a callback.
   * @param {function} callback - Function to call when DOM is ready.
   * @param {number} retries - Number of retries remaining.
   */
  function waitForPopupDom(callback, retries = 10) {
    const popupContainer = weatherPopup.getElement();
    if (popupContainer && popupContainer.querySelector('#popupWeatherIcon')) {
      console.log("Popup DOM is ready");
      callback();
    } else {
      if (retries > 0) {
        console.warn("Popup DOM not ready, retrying...");
        setTimeout(() => waitForPopupDom(callback, retries - 1), 100);
      } else {
        console.error("Popup DOM not available after retries");
        const desc = document.getElementById("popupWeatherDesc");
        if (desc) desc.textContent = "Failed to load popup content";
      }
    }
  }

  /**
   * Fetches and updates weather data in the popup.
   * @param {string} countryCode - The country code for weather data.
   */
  function fetchAndUpdateWeatherData(countryCode) {
    if (!countryCode) {
      console.error("Country code is required");
      const desc = document.getElementById("popupWeatherDesc");
      if (desc) desc.textContent = "Country code not provided";
      return;
    }

    $.ajax({
      url: "./php/getWeatherData.php",
      type: "GET",
      dataType: "json",
      data: { countryCode },
      success: (result) => {
        if (result.status.name !== "ok" || !result.data) {
          console.error("Invalid weather data");
          const desc = document.getElementById("popupWeatherDesc");
          if (desc) desc.textContent = "Failed to load weather data";
          return;
        }

        const weather = result.data;
        console.log("Weather data:", weather);

        // Validate required fields
        if (!weather.city || !weather.forecast || !weather.daily_forecast) {
          console.error("Incomplete weather data");
          const desc = document.getElementById("popupWeatherDesc");
          if (desc) desc.textContent = "Incomplete weather data";
          return;
        }

        // Split city and country more robustly
        const cityParts = weather.city.split(",").map(part => part.trim());
        const city = cityParts[0]; // First part is city
        const country = cityParts[cityParts.length - 1]; // Last part is country

        // Unescape image URLs
        const unescapeUrl = (url) => url ? url.replace(/\\\//g, '/') : "https://placehold.co/60";

        // Manual DOM updates for current weather
        const cityEl = document.getElementById("popupWeatherCity");
        if (cityEl) cityEl.textContent = city || "---";
        else console.warn("Element with ID popupWeatherCity not found");

        const countryEl = document.getElementById("popupWeatherCountry");
        if (countryEl) countryEl.textContent = country || "---";
        else console.warn("Element with ID popupWeatherCountry not found");

        const tempEl = document.getElementById("popupWeatherTemp");
        if (tempEl) tempEl.textContent = Math.round(weather.temperature);
        else console.warn("Element with ID popupWeatherTemp not found");

        const descEl = document.getElementById("popupWeatherDesc");
        if (descEl) descEl.textContent = weather.description ? weather.description.charAt(0).toUpperCase() + weather.description.slice(1) : "--";
        else console.warn("Element with ID popupWeatherDesc not found");

        const iconEl = document.getElementById("popupWeatherIcon");
        if (iconEl) {
          const iconUrl = unescapeUrl(weather.icon);
          console.log("Setting popupWeatherIcon.src to:", iconUrl);
          iconEl.src = iconUrl;
          iconEl.onerror = () => {
            console.warn(`Failed to load image for popupWeatherIcon: ${iconUrl}`);
            iconEl.src = "https://placehold.co/60";
          };
        } else {
          console.warn("Element with ID popupWeatherIcon not found");
        }

        const humidityEl = document.getElementById("popupWeatherHumidity");
        if (humidityEl) humidityEl.textContent = `${weather.humidity}%`;
        else console.warn("Element with ID popupWeatherHumidity not found");

        const windEl = document.getElementById("popupWeatherWind");
        if (windEl) windEl.textContent = `${(weather.wind * 2.237).toFixed(1)} mph`;
        else console.warn("Element with ID popupWeatherWind not found");

        // Manual updates for today's forecast
        const updateForecast = (period, data) => {
          if (!data) {
            console.warn(`No forecast data for ${period}`);
            return;
          }
          const tempEl = document.getElementById(`popupForecast${period}Temp`);
          if (tempEl) tempEl.textContent = `${Math.round(data.temp)}°C`;
          else console.warn(`Element with ID popupForecast${period}Temp not found`);

          const iconEl = document.getElementById(`popupForecast${period}Icon`);
          if (iconEl) {
            const iconUrl = unescapeUrl(data.icon);
            console.log(`Setting popupForecast${period}Icon.src to:`, iconUrl);
            iconEl.src = iconUrl;
            iconEl.onerror = () => {
              console.warn(`Failed to load image for popupForecast${period}Icon: ${iconUrl}`);
              iconEl.src = "https://placehold.co/45";
            };
          } else {
            console.warn(`Element with ID popupForecast${period}Icon not found`);
          }

          const descEl = document.getElementById(`popupForecast${period}Desc`);
          if (descEl) descEl.textContent = data.description ? data.description.charAt(0).toUpperCase() + data.description.slice(1) : "--";
          else console.warn(`Element with ID popupForecast${period}Desc not found`);
        };

        updateForecast("Morning", weather.forecast.morning);
        updateForecast("Afternoon", weather.forecast.afternoon);
        updateForecast("Evening", weather.forecast.evening);

        // Manual updates for daily forecast
        for (let i = 0; i < Math.min(weather.daily_forecast.length, 3); i++) {
          const day = weather.daily_forecast[i];
          const index = i + 1;

          const weekdayEl = document.getElementById(`popupDailyWeekday${index}`);
          if (weekdayEl) weekdayEl.textContent = day.weekday || "--";
          else console.warn(`Element with ID popupDailyWeekday${index} not found`);

          const iconEl = document.getElementById(`popupDailyIcon${index}`);
          if (iconEl) {
            const iconUrl = unescapeUrl(day.icon);
            console.log(`Setting popupDailyIcon${index}.src to:`, iconUrl);
            iconEl.src = iconUrl;
            iconEl.onerror = () => {
              console.warn(`Failed to load image for popupDailyIcon${index}: ${iconUrl}`);
              iconEl.src = "https://placehold.co/60";
            };
          } else {
            console.warn(`Element with ID popupDailyIcon${index} not found`);
          }

          const sunriseEl = document.getElementById(`popupDailySunrise${index}`);
          if (sunriseEl) sunriseEl.textContent = day.sunrise || "--";
          else console.warn(`Element with ID popupDailySunrise${index} not found`);

          const sunsetEl = document.getElementById(`popupDailySunset${index}`);
          if (sunsetEl) sunsetEl.textContent = day.sunset || "--";
          else console.warn(`Element with ID popupDailySunset${index} not found`);

          const precipEl = document.getElementById(`popupDailyPrecip${index}`);
          if (precipEl) precipEl.textContent = `${day.precipitation || "0"}%`;
          else console.warn(`Element with ID popupDailyPrecip${index} not found`);
        }
      },
      error: (jqXHR, textStatus, errorThrown) => {
        console.error("Error loading weather data:", textStatus, errorThrown);
        const desc = document.getElementById("popupWeatherDesc");
        if (desc) desc.textContent = "Failed to load weather data";
      },
    });
  }
  /**
   * Shows a news popup on the map with today's headlines.
   */
  function showNewsPopup() {
    if (!map) {
      console.error("Map is not initialized");
      updateElement("popupNewsContent", "Map not initialized");
      return;
    }

    if (newsPopup) {
      map.closePopup(newsPopup);
    }

    const center = map.getCenter();

    const popupContent = `
    <div class="news-card" role="dialog" aria-label="News Headlines">
      <div class="news-header">
        <h3>Today's Headlines</h3> 
      </div>
      <div class="news-content" id="popupNewsContent">
        <div class="p-3 text-center">
          <div class="spinner-border text-primary" role="status">
            <span class="sr-only">Loading...</span>
          </div>
          <p>Loading news...</p>
        </div>
      </div>
    </div>
  `;

    newsPopup = L.popup({
      maxWidth: 400,
      className: "custom-popup",
      closeButton: true,
    })
      .setLatLng(center)
      .setContent(popupContent)
      .openOn(map);

    const closeButton = document.getElementById("closeNewsPopup");
    if (closeButton) {
      closeButton.addEventListener("click", closeNewsPopup, { once: true });
    } else {
      console.warn("Close button not found");
    }

    updateNewsPopupData();
  }

  /**
   * Closes the news popup if it exists.
   */
  function closeNewsPopup() {
    if (newsPopup && map) {
      map.closePopup(newsPopup);
      newsPopup = null;
    }
  }
  /**
   * Fetches and updates news data in the popup.
   */
  function updateNewsPopupData() {
    if (!currentCountryCode) {
      console.error("Country code is required");
      updateElement("popupNewsContent", "Please select a country");
      return;
    }

    console.log("Fetching news for country code:", currentCountryCode);

    $.ajax({
      url: "php/getNewsData.php",
      type: "GET",
      dataType: "json",
      data: { countryCode: currentCountryCode },
      // success: (result) => {
      //   console.log("News API response:", result);

      //   if (!result || !result.status) {
      //     console.error("Invalid news response:", result);
      //     updateElement("popupNewsContent", "Invalid news data");
      //     return;
      //   }

      //   if (result.status.name !== "ok") {
      //     console.warn("News API error:", result.status);
      //     const errorMessage = result.status.description || "Failed to load news";
      //     updateElement("popupNewsContent", errorMessage);
      //     return;
      //   }

      //   const newsData = result.data || [];
      //   let newsContentHTML = "";

      //   if (newsData.length === 0) {
      //     newsContentHTML = '<div class="p-3">No news articles available.</div>';
      //   } else {
      //     newsData.forEach((article) => {
      //       const date = new Date(article.publishedAt);
      //       const formattedDate = `${date.toLocaleDateString()} ${date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`;

      //       const newsItemHTML = `
      //                 <div class="news-item">
      //                     <div class="news-title">${article.title}</div>
      //                     <div class="news-date">${formattedDate}</div>
      //                     <a href="${article.url}" target="_blank" class="news-link">Read More...</a>
      //                 </div>
      //             `;
      //       newsContentHTML += newsItemHTML;
      //     });
      //   }

      //   $("#popupNewsContent").html(newsContentHTML);
      //   if (popupElement) {
      //     popupElement.innerHTML = newsContentHTML; // Use innerHTML to render the HTML
      //   } else {
      //     console.error("Popup element not found");
      //   }
      // },      success: (result) => {
      //   if (result.status.name === "ok") {
      //     const newsData = result.data;

      //     let newsContentHTML = "";

      //     if (newsData.length === 0) {
      //       newsContentHTML = '<div class="p-3">No news articles available.</div>';
      //     } else {
      //       newsData.forEach((article) => {
      //         const date = new Date(article.publishedAt);
      //         const formattedDate = `${date.toLocaleDateString()} ${date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`;

      //         newsContentHTML += `
      //                         <div class="news-item">
      //                             <div class="news-title">${article.title}</div>
      //                             <div class="news-date">${formattedDate}</div>
      //                             <a href="${article.url}" target="_blank" class="news-link">Read More...</a>
      //                         </div>
      //                     `;
      //       });
      //     }

      //     $("#popupNewsContent").html(newsContentHTML);
      //   } else {
      //     // Handle error case (e.g., 404 or other errors)
      //     $("#popupNewsContent").html(`<div class="p-3">${result.status.description}</div>`);
      //   }
      // },
      success: (result) => {
        if (result.status.name === "ok") {
          const newsData = result.data;
          let newsContentHTML = "";

          if (newsData.length === 0) {
            newsContentHTML = '<div class="p-3">No news articles available.</div>';
          } else {
            newsData.forEach((article) => {
              const date = new Date(article.publishedAt);
              const formattedDate = `${date.toLocaleDateString()} ${date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`;

              newsContentHTML += `
                <div class="news-item">
                  <div class="news-title">${article.title}</div>
                  <div class="news-date">${formattedDate}</div>
                  <a href="${article.url}" target="_blank" class="news-link">Read More...</a>
                </div>
              `;
            });
          }

          $("#popupNewsContent").html(newsContentHTML);
        } else {
          const errorMsg = result.status?.description || "Failed to load news.";
          $("#popupNewsContent").html(`<div class="p-3">${errorMsg}</div>`);
        }
      },


      error: (jqXHR, textStatus, errorThrown) => {
        console.error("Error loading news data:", textStatus, errorThrown, jqXHR.responseText);
        updateElement("popupNewsContent", "Failed to load news. Please try again later.");
      },
    });
  }

  /**
  * Helper function to update an element's content (fallback if needed).
  * @param {string} elementId - The ID of the element to update.
  * @param {string} content - The content to set.
  */
  function updateElement(elementId, content) {
    const element = document.getElementById(elementId);
    if (element) {
      element.innerHTML = content; // Ensure HTML rendering
    } else {
      console.error(`Element with ID ${elementId} not found`);
    }
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
  let isGettingLocation = false;

  function getUserLocation() {
    if (isGettingLocation) return;
    isGettingLocation = true;

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;

          $.ajax({
            url: "./php/getOpenCageData.php",
            type: "GET",
            dataType: "json",
            data: { lat, lng },
            success: (result) => {
              if (result.status.name === "ok" && result.data.countryCode) {
                const countryCode = result.data.countryCode;
                $("#countrySelect").val(countryCode);
                loadCountryData(countryCode);
              } else {
                $("#countrySelect").val("US");
                loadCountryData("US");
              }
            },
            error: (jqXHR, textStatus, errorThrown) => {
              console.error("Error getting location data:", textStatus, errorThrown);
              $("#countrySelect").val("US");
              loadCountryData("US");
            },
            complete: () => {
              isGettingLocation = false;
            },
          });
        },
        (error) => {
          console.error("Error getting user location:", error);
          let errorMessage = "Unable to get your location.";
          if (error.code === 1 && error.message.includes("secure origins")) {
            errorMessage = "Location access requires a secure connection (HTTPS). Please select a country manually.";
            alert(errorMessage);
          }
          $("#countrySelect").val("US");
          loadCountryData("US");
          isGettingLocation = false;
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
      alert("Geolocation is not supported. Please select a country manually.");
      $("#countrySelect").val("US");
      loadCountryData("US");
      isGettingLocation = false;
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
          fetchAndUpdateWeatherData(countryCode)
          loadCurrencyData(countryCode)
          loadWikipediaData(countryCode)
          loadNewsData(countryCode)
          loadPointsOfInterest(countryCode)
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

          // Populate currency dropdowns
          if (countryData.currencies) {
            const mainCurrency = Object.keys(countryData.currencies)[0]
            $("#toCurrency").val(mainCurrency)
          }
        }
      },
      error: (jqXHR, textStatus, errorThrown) => {
        console.error("Error loading country data:", textStatus, errorThrown)
      },
    })
  }

  // Load weather data


  // Load currency data
  function loadCurrencyData(countryCode) {
    $.ajax({
      url: "./php/getExchangeRates.php",
      type: "GET",
      dataType: "json",
      success: (result) => {
        if (result.status.name === "ok") {
          const exchangeRates = result.data.rates
          const baseCurrency = result.data.base
          const lastUpdated = new Date(result.data.timestamp * 1000).toLocaleDateString()

          // Populate currency dropdowns
          let options = ""

          for (const currency in exchangeRates) {
            options += `<option value="${currency}">${currency}</option>`
          }

          $("#fromCurrency").html(options)
          $("#toCurrency").html(options)

          // Set default values
          $("#fromCurrency").val(baseCurrency)
          $("#conversionDate").text(`Last updated: ${lastUpdated}`)

          // Set up conversion button
          $("#convertBtn")
            .off("click")
            .on("click", () => {
              const amount = Number.parseFloat($("#amountInput").val())
              const fromCurrency = $("#fromCurrency").val()
              const toCurrency = $("#toCurrency").val()

              if (isNaN(amount) || amount <= 0) {
                alert("Please enter a valid amount")
                return
              }

              // Calculate conversion
              const fromRate = exchangeRates[fromCurrency]
              const toRate = exchangeRates[toCurrency]

              // Convert to base currency first, then to target currency
              const baseAmount = amount / fromRate
              const convertedAmount = baseAmount * toRate

              // Display result
              $("#conversionResult").text(`${amount} ${fromCurrency} = ${convertedAmount.toFixed(2)} ${toCurrency}`)
            })
        }
      },
      error: (jqXHR, textStatus, errorThrown) => {
        console.error("Error loading currency data:", textStatus, errorThrown)
      },
    })
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

          wikiData.forEach((article) => {
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

  // Load news data
  function loadNewsData(countryCode) {
    $.ajax({
      url: "./php/getNewsData.php",
      type: "GET",
      dataType: "json",
      data: {
        countryCode: countryCode,
      },
      success: (result) => {
        if (result.status.name === "ok") {
          const newsData = result.data

          // Update news modal
          $("#newsCountry").text(currentCountryName)

          let articlesHTML = ""

          newsData.forEach((article) => {
            const date = new Date(article.publishedAt)
            const formattedDate = `${date.toLocaleDateString()} ${date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`

            articlesHTML += `
              <a href="${article.url}" target="_blank" class="list-group-item list-group-item-action">
                <div class="d-flex w-100 justify-content-between">
                  <h5 class="mb-1">${article.title}</h5>
                  <small>${formattedDate}</small>
                </div>
                <p class="mb-1">${article.description || "No description available"}</p>
                <small class="text-muted">${article.source.name}</small>
              </a>
            `
          })

          $("#newsArticles").html(articlesHTML)
        }
      },
      error: (jqXHR, textStatus, errorThrown) => {
        console.error("Error loading news data:", textStatus, errorThrown)
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
