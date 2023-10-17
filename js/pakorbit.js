const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];
const weatherTypeEmojis = {
  clear: "🌤️",
  pcloudy: "🌥️",
  cloudy: "☁️",
  mcloudy: "🌥️",
  foggy: "🌫️",
  humid: "💧",
  lightrain: "🌦️",
  oshowers: "🌦️",
  ishower: "🌧️",
  lightsnow: "🌨️",
  rain: "🌧️",
  snow: "❄️",
  mixed: "🌦️🌨️",
  rainsnow: "🌧️❄️",
  tstorm: "⛈️",
  tsrain: "⛈️",
  windy: "🌬️",
};

document.getElementById("citySelected").addEventListener("change", function () {
  const selectedCity = JSON.parse(this.value);
  const { lat, lon } = selectedCity;
  const unitElem = document.getElementById("temperature-unit");
  const results = document.getElementById("results");

  const imgElem = document.createElement("img");
  imgElem.classList.add("small-animation");
  imgElem.src = "./images/stopwatch.gif";
  imgElem.alt = "stopwatch";
  results.innerHTML = "";
  results.appendChild(imgElem);

  fetch(
    `https://www.7timer.info/bin/api.pl?lat=${lat}&lon=${lon}&product=civillight&output=json`
  )
    .then((response) => response.json())
    .then((weatherData) => {
      let forecastHTML =
        '<div class="forecast-block row row-cols-sm-7 row-cols-md-7 row-cols-lg-7 g-4">';

      for (let forecast of weatherData.dataseries) {
        let date = yyyymmddToDate(forecast.date);
        let weatherIcon = weatherTypeEmojis[forecast.weather] || "❓";
        let weatherDesc = forecast.weather.toUpperCase();

        forecastHTML += `
                <div class="col bm-2">
                    <div class="card h-100">
                        <p class="weather-date">${dayNames[date.getUTCDay()]} ${
          months[date.getUTCMonth()]
        } ${date.getUTCDate()}</p>
                        <div class="weather-icon-div">${weatherIcon}</div>
                        <p class="weather-description">${weatherDesc}</p>
                        <p class="weather-temperatures">High: <span class="celcius">${
                          forecast.temp2m.max
                        } ºC</span><span class="fahrenheit" style="display: none;">TBD ºF</span></p>
                        <p class="weather-temperatures">Low: <span class="celcius">${
                          forecast.temp2m.min
                        } ºC</span><span class="fahrenheit" style="display: none;">TBD ºF</span></p>
                    </div>
                </div>`;
      }

      forecastHTML += "</div>";
      results.innerHTML = forecastHTML;
      if (unitElem.innerText === "Fahrenheit") {
        updateTemperatureDisplay();
      }
    })
    .catch((error) => {
      console.error("Error fetching weather data: ", error);
    });
});

function yyyymmddToDate(yyyymmdd) {
  let str = String(yyyymmdd);
  let year = parseInt(str.substring(0, 4), 10);
  let month = parseInt(str.substring(4, 6), 10) - 1;
  let day = parseInt(str.substring(6, 8), 10);
  return new Date(year, month, day);
}

function toggleTemperatureUnit() {
  const unitElem = document.getElementById("temperature-unit");
  const toggleElem = document.getElementById("temperature-toggle");

  if (unitElem.innerText === "Celcius") {
    unitElem.innerText = "Fahrenheit";
    toggleElem.innerText = "Switch to ºC";
  } else {
    unitElem.innerText = "Celcius";
    toggleElem.innerText = "Switch to ºF";
  }

  updateTemperatureDisplay();
}

function updateTemperatureDisplay() {
  const resultsElem = document.querySelector("#results");
  const unitElemValue = document
    .querySelector("#temperature-unit")
    .textContent.trim();

  if (resultsElem.querySelectorAll("div").length > 0) {
    if (unitElemValue === "Celcius") {
      document.querySelectorAll(".fahrenheit").forEach((elem) => {
        elem.style.display = "none";
      });

      document.querySelectorAll(".celcius").forEach((elem) => {
        elem.style.display = "";
      });
    } else if (unitElemValue === "Fahrenheit") {
      document.querySelectorAll(".celcius").forEach((elem) => {
        elem.style.display = "none";
      });

      document.querySelectorAll(".fahrenheit").forEach((elem) => {
        elem.style.display = "";

        let celsiusElem = elem.previousElementSibling;
        if (celsiusElem && celsiusElem.classList.contains("celcius")) {
          let celsiusValue = parseFloat(celsiusElem.textContent);
          if (!isNaN(celsiusValue)) {
            let fahrenheitValue = (celsiusValue * 9) / 5 + 32;
            elem.textContent = `${fahrenheitValue.toFixed(1)} ºF`;
          }
        }
      });
    }
  }
}
