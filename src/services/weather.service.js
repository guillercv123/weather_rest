const axios = require('axios');

const BASE_URL = 'https://api.openweathermap.org/data/2.5';


function formatWeather(data) {
  return {
    city: data.name,
    country: data.sys.country,
    temperature: {
      current: Math.round(data.main.temp),
      feelsLike: Math.round(data.main.feels_like),
      min: Math.round(data.main.temp_min),
      max: Math.round(data.main.temp_max),
      unit: 'Celsius',
    },
    humidity: data.main.humidity,
    wind: {
      speed: data.wind.speed,
      unit: 'm/s',
    },
    condition: {
      main: data.weather[0].main,
      description: data.weather[0].description,
      icon: `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`,
    },
    visibility: data.visibility,
    timestamp: new Date(data.dt * 1000).toISOString(),
  };
}

async function getWeatherByCity(city) {
  const { data } = await axios.get(`${BASE_URL}/weather`, {
    params: {
      q: city,
      appid: process.env.OPENWEATHER_API_KEY,
      units: 'metric',
      lang: 'es',
    },
  });
  return formatWeather(data);
}

async function getWeatherByCoords(lat, lon) {
  const { data } = await axios.get(`${BASE_URL}/weather`, {
    params: {
      lat,
      lon,
      appid: process.env.OPENWEATHER_API_KEY,
      units: 'metric',
      lang: 'es',
    },
  });
  return formatWeather(data);
}

module.exports = { getWeatherByCity, getWeatherByCoords };
