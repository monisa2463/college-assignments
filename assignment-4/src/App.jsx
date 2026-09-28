import React, { useState, useEffect } from 'react';
import './App.css';

// Replace with your actual OpenWeatherMap API key
const API_KEY = '9fa1377aec1be2c56e2ce84e6372d196';

function App() {
  const [cityInput, setCityInput] = useState('');
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchWeather = async (city) => {
    if (!city.trim()) {
      setError('Please enter a city name.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(
          city.trim()
        )}&units=metric&appid=${API_KEY}`
      );

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('City not found. Please verify the spelling.');
        } else if (response.status === 401) {
          throw new Error('Invalid API Key. Please supply a valid OpenWeatherMap key.');
        } else {
          throw new Error('Unable to retrieve weather details. Please try again later.');
        }
      }

      const data = await response.json();
      setWeatherData(data);
    } catch (err) {
      setWeatherData(null);
      setError(err.message || 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchWeather(cityInput);
  };

  const formatUnixTime = (timestamp, timezoneOffset) => {
    // Converts UTC timestamp + location offset to local standard time string
    const date = new Date((timestamp + timezoneOffset) * 1000);
    return date.toUTCString().slice(17, 22); // Returns "HH:MM"
  };

  useEffect(() => {
    // Initial fetch for a default city on mount
    fetchWeather('London');
  }, []);

  return (
    <div className="weather-app">
      <div className="weather-card">
        <header className="app-header">
          <h1>Weather Dashboard</h1>
          <p>Real-time meteorological indicators</p>
        </header>

        <form onSubmit={handleSearch} className="search-form">
          <input
            type="text"
            className="search-input"
            placeholder="Enter city name (e.g., Tokyo, Paris)..."
            value={cityInput}
            onChange={(e) => setCityInput(e.target.value)}
          />
          <button type="submit" className="search-btn" disabled={loading}>
            Search
          </button>
        </form>

        {loading && (
          <div className="loader-container">
            <div className="spinner"></div>
            <p>Fetching weather report...</p>
          </div>
        )}

        {error && !loading && (
          <div className="error-banner">
            <span className="error-icon">⚠️</span>
            <p>{error}</p>
          </div>
        )}

        {weatherData && !loading && !error && (
          <div className="weather-content">
            <div className="overview-section">
              <div className="location-info">
                <h2>
                  {weatherData.name}, <span>{weatherData.sys.country}</span>
                </h2>
                <p className="weather-desc">
                  {weatherData.weather[0].description}
                </p>
              </div>

              <div className="temp-display">
                <img
                  src={`https://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`}
                  alt={weatherData.weather[0].description}
                  className="weather-icon"
                />
                <span className="temperature">
                  {Math.round(weatherData.main.temp)}°C
                </span>
              </div>
            </div>

            <div className="metrics-grid">
              <div className="metric-box">
                <span className="metric-label">Humidity</span>
                <span className="metric-value">{weatherData.main.humidity}%</span>
              </div>

              <div className="metric-box">
                <span className="metric-label">Wind Speed</span>
                <span className="metric-value">
                  {weatherData.wind.speed} m/s
                </span>
              </div>

              <div className="metric-box">
                <span className="metric-label">Sunrise</span>
                <span className="metric-value">
                  {formatUnixTime(
                    weatherData.sys.sunrise,
                    weatherData.timezone
                  )}{' '}
                  AM
                </span>
              </div>

              <div className="metric-box">
                <span className="metric-label">Sunset</span>
                <span className="metric-value">
                  {formatUnixTime(
                    weatherData.sys.sunset,
                    weatherData.timezone
                  )}{' '}
                  PM
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;