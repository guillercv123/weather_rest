const { Router } = require('express');
const { getWeatherByCity, getWeatherByCoords } = require('../services/weather.service');

const router = Router();

/**
 * GET /api/weather?city=Lima
 * Clima por nombre de ciudad.
 */
router.get('/', async (req, res) => {
  const { city } = req.query;

  if (!city) {
    return res.status(400).json({
      error: 'El parámetro "city" es requerido. Ej: /api/weather?city=Lima',
    });
  }

  try {
    const weather = await getWeatherByCity(city);
    res.json(weather);
  } catch (err) {
    handleWeatherError(err, res);
  }
});

/**
 * GET /api/weather/coords?lat=-12.04&lon=-77.03
 * Clima por coordenadas GPS (útil si tienes la ubicación del usuario).
 */
router.get('/coords', async (req, res) => {
  const { lat, lon } = req.query;

  if (!lat || !lon) {
    return res.status(400).json({
      error: 'Los parámetros "lat" y "lon" son requeridos. Ej: /api/weather/coords?lat=-12.04&lon=-77.03',
    });
  }

  if (isNaN(lat) || isNaN(lon)) {
    return res.status(400).json({ error: '"lat" y "lon" deben ser números válidos.' });
  }

  try {
    const weather = await getWeatherByCoords(parseFloat(lat), parseFloat(lon));
    res.json(weather);
  } catch (err) {
    handleWeatherError(err, res);
  }
});

/**
 * Maneja los errores de OpenWeatherMap de forma centralizada.
 */
function handleWeatherError(err, res) {
  if (err.response) {
    const status = err.response.status;
    const messages = {
      401: 'API key inválida. Verifica tu OPENWEATHER_API_KEY en el archivo .env',
      404: 'Ciudad no encontrada. Verifica el nombre (ej: "Lima", "Madrid", "Buenos Aires")',
      429: 'Límite de peticiones alcanzado. La capa gratuita permite 60 llamadas/minuto',
    };
    return res.status(status).json({
      error: messages[status] ?? `Error del proveedor de clima (${status})`,
    });
  }
  console.error('[WeatherRoute] Error inesperado:', err.message);
  res.status(500).json({ error: 'Error interno del servidor' });
}

module.exports = router;
