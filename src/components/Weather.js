import React, { useState } from 'react';
import axios from 'axios';
import './Weather.css';

function Weather() {
  const [city, setCity] = useState('');
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const API_KEY = '8692d05e8ac74951fa46bb4279dadd19';

  const fetchWeather = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
      );
      setWeather(response.data);
      setError('');
      fetchForecast(city); // for fetching 5days weather data
    } catch (error) {
      setError('City not found');
      setWeather(null);
      setForecast(null);
    }
    setLoading(false);
  };

  const fetchForecast = async (city) => {
    try {
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=metric`
      );
      const dailyForecast = response.data.list.filter((reading) =>
        reading.dt_txt.includes("12:00:00")
      );
      // Map over the filtered data and format the date to show only day names
      const formattedForecast = dailyForecast.map((day) => {
        const date = new Date(day.dt_txt);
        const dayOfWeek = date.toLocaleDateString('en-US', { weekday: 'short' });
        return {
          ...day,
          dayOfWeek: dayOfWeek
        };
      });
      setForecast(formattedForecast);
    } catch (error) {
      console.error('Error fetching forecast data:', error);
      setForecast(null);
    }
  };

  return (
    <div className="main">
      <div className="weather-panel">
        <h1>Weather</h1>
        <form className="search-box" onSubmit={fetchWeather}>
          <input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="Enter City"
            className="city-input"
          />
          <button type="submit" className="fetch-button">Get Weather</button>
        </form>
        {loading && <p className="loading-message">Loading...</p>}
        {weather && (
          <div className="weather-details">
            <h2>{weather.name}</h2>
            <p className="temperature">
              <span>{weather.main.temp} °C</span>
            </p>
            <p>Weather: {weather.weather[0].description}</p>
            <p className="humidity">
              <span>{weather.main.humidity}%</span>
            </p>
          </div>
        )}
        {forecast && (
          <div className="forecast-details">
            <h2>5-Day Forecast</h2>
            <div className="forecast-grid">
              {forecast.map((day, index) => (
                <div key={index} className="forecast-day">
                  <p>{day.dayOfWeek}</p>
                  <p>{day.main.temp} °C</p>
                  <p>{day.weather[0].description}</p>
                </div>
              ))}
            </div>
          </div>
        )}
        {error && <p className="error-message">{error}</p>}
      </div>
    </div>
  );
}

export default Weather;
