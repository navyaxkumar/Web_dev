const apiKey = 'cb9b20f45fc5db36cbc48f495e29a9fd';
const searchBtn = document.getElementById("searchBtn");
const cityInput = document.getElementById("cityInput");
const weatherResult = document.getElementById("weatherResult");
const historyList = document.getElementById("historyList");
const logBox = document.getElementById("logBox");

function log(msg) {
  console.log(msg);
  logBox.textContent += msg + "\n";
}

window.onload = loadHistory;

searchBtn.onclick = () => {
  const city = cityInput.value.trim();
  if (!city) return alert("Enter a city");
  logBox.textContent = "";
  getWeather(city);
};

async function getWeather(city) {
  log("Start");
  weatherResult.innerHTML = "<p>⏳ Loading...</p>";

  try {
    log("Fetching...");
    const res = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`
    );

    if (!res.ok) throw new Error("City not found");

    const data = await res.json();
    log("Data received");

    displayWeather(data);
    saveHistory(city);

  } catch (err) {
    log("Error: " + err.message);
    weatherResult.innerHTML = `<p style="color:#f87171">${err.message}</p>`;
  }

  log("End");
}

function displayWeather(data) {
  weatherResult.innerHTML = `
    <div class="weather-grid">
      <div class="weather-item"><strong>City</strong><br>${data.name}</div>
      <div class="weather-item"><strong>Temp</strong><br>${data.main.temp}°C</div>
      <div class="weather-item"><strong>Weather</strong><br>${data.weather[0].main}</div>
      <div class="weather-item"><strong>Humidity</strong><br>${data.main.humidity}%</div>
      <div class="weather-item"><strong>Wind</strong><br>${data.wind.speed} m/s</div>
    </div>
  `;
}

function saveHistory(city) {
  let cities = JSON.parse(localStorage.getItem("cities")) || [];
  if (!cities.includes(city)) {
    cities.push(city);
    localStorage.setItem("cities", JSON.stringify(cities));
  }
  loadHistory();
}

function loadHistory() {
  let cities = JSON.parse(localStorage.getItem("cities")) || [];
  historyList.innerHTML = "";

  cities.forEach(city => {
    const el = document.createElement("span");
    el.textContent = city;
    el.onclick = () => {
      logBox.textContent = "";
      getWeather(city);
    };
    historyList.appendChild(el);
  });
}