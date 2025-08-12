// Weather Terminal - Developer Coding Theme
const apiKey = "dd01e81a92eb8ff72605c3ff4e045518";
const apiUrl = "https://api.openweathermap.org/data/2.5/weather?units=metric&q=";

// DOM Elements
const searchBox = document.querySelector(".search-input");
const searchBtn = document.querySelector(".search-btn");
const errorMsg = document.querySelector(".error-message");
const weatherOutput = document.querySelector(".weather-output");

// Weather condition mappings
const weatherConditions = {
  "Clouds": { symbol: "☁️", desc: "Cloudy" },
  "Clear": { symbol: "☀️", desc: "Clear" },
  "Rain": { symbol: "🌧️", desc: "Rainy" },
  "Drizzle": { symbol: "🌦️", desc: "Drizzle" },
  "Mist": { symbol: "🌫️", desc: "Misty" },
  "Snow": { symbol: "❄️", desc: "Snowy" },
  "Thunderstorm": { symbol: "⛈️", desc: "Thunderstorm" },
  "Fog": { symbol: "🌁", desc: "Foggy" },
  "Haze": { symbol: "🌫️", desc: "Hazy" }
};

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  checkWeather("London");
});

// Event Listeners
searchBtn.addEventListener("click", () => {
  const city = searchBox.value.trim();
  if (city) {
    checkWeather(city);
  }
});

searchBox.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    const city = searchBox.value.trim();
    if (city) {
      checkWeather(city);
    }
  }
});

// Main weather check function
async function checkWeather(city) {
  try {
    // Show loading state
    showLoading();
    
    const response = await fetch(apiUrl + city + `&appid=${apiKey}`);
    
    if (response.status === 404) {
      showError("Error: City not found");
      return;
    }
    
    if (!response.ok) {
      showError("Error: Unable to fetch weather data");
      return;
    }
    
    const data = await response.json();
    displayWeather(data);
    
  } catch (error) {
    console.error("Weather fetch error:", error);
    showError("Error: Connection failed");
  }
}

// Display weather data
function displayWeather(data) {
  hideError();
  
  // Update city name
  document.querySelector(".city-name").textContent = data.name;
  
  // Update temperature
  document.querySelector(".temp-value").textContent = Math.round(data.main?.temp);
  
  // Update humidity
  document.querySelector(".humidity").textContent = data.main?.humidity + "%";
  
  // Update wind speed
  document.querySelector(".wind").textContent = data.wind?.speed + " km/h";
  
  // Update weather condition
  const weatherMain = data.weather[0].main;
  const condition = weatherConditions[weatherMain] || { symbol: "🌡️", desc: weatherMain };
  
  document.querySelector(".condition").textContent = condition.desc;
  
  // Add terminal-style timestamp
  const now = new Date();
  const timestamp = now.toLocaleTimeString('en-US', { 
    hour12: false, 
    hour: '2-digit', 
    minute: '2-digit' 
  });
  
  console.log(`[${timestamp}] Weather updated for ${data.name}: ${condition.desc}, ${Math.round(data.main?.temp)}°C`);
}

// Show loading state
function showLoading() {
  document.querySelector(".city-name").textContent = "Loading...";
  document.querySelector(".temp-value").textContent = "--";
  document.querySelector(".humidity").textContent = "--";
  document.querySelector(".wind").textContent = "--";
  document.querySelector(".condition").textContent = "Loading...";
}

// Show error message
function showError(message) {
  const errorText = document.querySelector(".error-text");
  errorText.textContent = message;
  errorMsg.style.display = "block";
  weatherOutput.style.display = "none";
}

// Hide error message
function hideError() {
  errorMsg.style.display = "none";
  weatherOutput.style.display = "block";
}

// Terminal-style console logging
function logToConsole(message, type = "info") {
  const colors = {
    info: "\x1b[36m",    // Cyan
    success: "\x1b[32m", // Green
    warning: "\x1b[33m", // Yellow
    error: "\x1b[31m"    // Red
  };
  
  const reset = "\x1b[0m";
  console.log(`${colors[type] || colors.info}[WEATHER]${reset} ${message}`);
}

// Add some terminal-style animations
function typeWriter(element, text, speed = 50) {
  let i = 0;
  element.textContent = "";
  
  function type() {
    if (i < text.length) {
      element.textContent += text.charAt(i);
      i++;
      setTimeout(type, speed);
    }
  }
  
  type();
}

// Initialize with terminal-style welcome
logToConsole("Weather Terminal initialized successfully", "success");
logToConsole("Ready to fetch weather data", "info");
