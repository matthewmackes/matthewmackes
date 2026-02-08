const weatherEl = document.querySelector('[data-weather]');

const weatherCodeMap = {
  0: 'Clear sky',
  1: 'Mostly clear',
  2: 'Partly cloudy',
  3: 'Overcast',
  45: 'Fog',
  48: 'Rime fog',
  51: 'Light drizzle',
  53: 'Drizzle',
  55: 'Heavy drizzle',
  61: 'Light rain',
  63: 'Rain',
  65: 'Heavy rain',
  71: 'Light snow',
  73: 'Snow',
  75: 'Heavy snow',
  80: 'Rain showers',
  81: 'Rain showers',
  82: 'Heavy showers',
  95: 'Thunderstorm',
  96: 'Thunderstorm w/ hail',
  99: 'Thunderstorm w/ hail'
};

async function loadWeather() {
  if (!weatherEl) return;

  try {
    const response = await fetch(
      'https://api.open-meteo.com/v1/forecast?latitude=42.8864&longitude=-78.8784&current=temperature_2m,weather_code,wind_speed_10m&timezone=America%2FNew_York'
    );
    const data = await response.json();
    const current = data.current;

    const temperature = Math.round(current.temperature_2m);
    const weatherCode = current.weather_code;
    const wind = Math.round(current.wind_speed_10m);
    const description = weatherCodeMap[weatherCode] || 'Current conditions';
    const updated = new Date(current.time).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit'
    });

    weatherEl.innerHTML = `
      <div class="weather-main">
        <div>
          <div class="weather-temp">${temperature}°F</div>
          <div class="badge">Buffalo, NY</div>
        </div>
        <div>
          <div>${description}</div>
          <div class="weather-meta">Wind ${wind} mph</div>
          <div class="weather-meta">Updated ${updated}</div>
        </div>
      </div>
    `;
  } catch (error) {
    weatherEl.innerHTML = `<div class="weather-meta">Weather unavailable</div>`;
  }
}

loadWeather();
