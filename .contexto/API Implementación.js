// api/app.js
const express = require('express');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./docs/swagger.json');
const errorHandler = require('./middleware/errorHandler');
const authRoutes = require('./routes/authRoutes');
const cartolaRoutes = require('./routes/cartolaRoutes');
const monitorRoutes = require('./routes/monitorRoutes');
const formatoRoutes = require('./routes/formatoRoutes');
const logger = require('./utils/logger');

const app = express();

// Configuración de seguridad
app.use(helmet());
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',') : '*'
}));

// Rate limiting
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: process.env.NODE_ENV === 'production' ? 100 : 1000,
  standardHeaders: true,
  message: { error: 'Demasiadas solicitudes, intente más tarde' }
});
app.use('/api/', apiLimiter);

// Documentación API
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Rutas
app.use('/api/auth', authRoutes);
app.use('/api/cartola', cartolaRoutes);
app.use('/api/monitor', monitorRoutes);
app.use('/api/formato', formatoRoutes);

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Middleware de errores
app.use(errorHandler);

// Manejo de excepciones no capturadas
process.on('uncaughtException', (error) => {
  logger.error('Excepción no capturada:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason) => {
  logger.error('Promesa rechazada no manejada:', reason);
});

module.exports = app;
