require('dotenv').config();
const express = require('express');
const cors = require('cors');
const weatherRoutes = require('./src/routes/weather.routes');

const app = express();
const PORT = process.env.PORT ?? 3000;

app.use(cors());
app.use(express.json());

app.use('/api/weather', weatherRoutes);

app.get('/health', (_req, res) => res.json({ status: 'ok' }));

app.use((_req, res) => res.status(404).json({ error: 'Ruta no encontrada' }));

app.listen(PORT, () => {
  console.log(` Weather API corriendo en ${PORT}`);
});
