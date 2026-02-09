const { CartolaService } = require('../services/cartolaService');
const { ValidationService } = require('../services/validationService');
const logger = require('../config/logger');
const { ApiError } = require('../utils/apiError');

/**
 * Controlador para gestionar la obtención y validación de cartolas bancarias
 */
class CartolaController {
  /**
   * Obtiene los movimientos bancarios para uno o más usuarios
   */
  async getMovimientos(req, res, next) {
    try {
      const usuariosData = req.body;
      
      // Validación de formato de entrada
      if (!Array.isArray(usuariosData) || usuariosData.length === 0) {
        throw new ApiError('Formato de solicitud inválido', 400);
      }
      
      const resultados = [];
      const errores = [];
      
      // Procesar cada solicitud de usuario
      for (const userData of usuariosData) {
        const { rut, pass, banco } = userData;
        
        try {
          // Validar datos de entrada
          if (!rut || !pass || !banco) {
            throw new ApiError('Datos incompletos para la solicitud', 400);
          }
          
          // Verificar estado del servicio del banco
          const estadoServicio = await ValidationService.verificarEstadoBanco(banco);
          if (!estadoServicio.activo) {
            throw new ApiError(`Servicio no disponible para banco ${banco}: ${estadoServicio.mensaje}`, 503);
          }
          
          // Desencriptar contraseña
          const passDesencriptada = await ValidationService.desencriptarPassword(pass);
          
          // Obtener cartola
          const cartola = await CartolaService.obtenerCartola(rut, passDesencriptada, banco);
          
          // Verificar duplicidad
          const esDuplicada = await ValidationService.verificarDuplicidad(rut, banco, cartola);
          if (esDuplicada) {
            throw new ApiError('Se detectaron movimientos duplicados', 409);
          }
          
          // Validar formato
          const datosFormateados = await ValidationService.validarFormato(banco, cartola);
          
          // Agregar al resultado
          resultados.push({
            rut,
            banco,
            success: true,
            data: datosFormateados
          });
          
        } catch (error) {
          logger.error(`Error procesando solicitud para RUT ${rut}, banco ${banco}:`, error);
          errores.push({
            rut,
            banco,
            success: false,
            error: error.message,
            code: error.statusCode || 500
          });
        }
      }
      
      // Responder con resultados y errores
      res.status(200).json({
        resultados,
        errores,
        timestamp: new Date().toISOString()
      });
      
    } catch (error) {
      next(error);
    }
  }

  /**
   * Verifica movimientos existentes para un usuario y banco
   */
  async verificarMovimientosExistentes(req, res, next) {
    try {
      const { rut, banco } = req.body;
      
      if (!rut || !banco) {
        throw new ApiError('Se requiere RUT y banco para la consulta', 400);
      }
      
      const movimientos = await CartolaService.obtenerMovimientosExistentes(rut, banco);
      
      res.status(200).json({
        rut,
        banco,
        movimientos
      });
      
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new CartolaController();
