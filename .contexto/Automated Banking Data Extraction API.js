const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const { errorHandler } = require('./middleware/errorHandler');
const authMiddleware = require('./middleware/auth');
const cartolaRoutes = require('./routes/cartolaRoutes');
const formatoRoutes = require('./routes/formatoRoutes');
const authRoutes = require('./routes/authRoutes');
const logger = require('./config/logger');

// Inicializar app
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware de seguridad y configuración
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rate limiting
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // límite de 100 solicitudes por ventana
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Demasiadas solicitudes, intente más tarde' }
});

// Aplicar rate limiting a todas las rutas de la API
app.use('/api', apiLimiter);

// Rutas públicas (sin autenticación)
app.use('/api/auth', authRoutes);

// Middleware de autenticación para rutas protegidas
app.use('/api', authMiddleware);

// Rutas protegidas
app.use('/api', cartolaRoutes);
app.use('/api/formato', formatoRoutes);

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Middleware de manejo de errores
app.use(errorHandler);

// Iniciar servidor
app.listen(PORT, () => {
  logger.info(`Servidor iniciado en puerto ${PORT}`);
});

// Manejo de excepciones no capturadas
process.on('uncaughtException', (error) => {
  logger.error('Excepción no capturada:', error);
  // Realizar limpieza y cerrar gracefully
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  logger.error('Promesa rechazada no manejada:', reason);
});

module.exports = app;
