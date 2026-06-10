require('dotenv').config();
const express = require('express');
const cors = require('cors');
const weatherRoutes = require('./src/routes/weather.routes');

const app = express();
const PORT = process.env.PORT ?? 3000;

// ── Middlewares ──────────────────────────────────────────────
app.use(cors());
app.use(express.json());

// ── Rutas ────────────────────────────────────────────────────
app.use('/api/weather', weatherRoutes);

// Health check — útil para saber si el servidor está vivo en EC2
app.get('/health', (_req, res) => res.json({ status: 'ok' }));

// 404 para rutas no definidas
app.use((_req, res) => res.status(404).json({ error: 'Ruta no encontrada' }));

// ── Arranque ─────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`✅ Weather API corriendo en http://localhost:${PORT}`);
  console.log(`   GET /api/weather?city=Lima`);
  console.log(`   GET /api/weather/coords?lat=-12.04&lon=-77.03`);
});
