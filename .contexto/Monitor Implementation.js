// monitor/checker.js
const cron = require('node-cron');
const bancoFactory = require('../bancos/bancoFactory');
const db = require('../database/connection');
const logger = require('../utils/logger');
const notifier = require('./notifier');

class BancoChecker {
  constructor() {
    this.running = false;
  }

  // Iniciar el cron job
  startMonitoring() {
    if (this.running) return;
    
    // Ejecutar todos los días a las 2 AM
    cron.schedule('0 2 * * *', async () => {
      await this.checkAllBanks();
    });
    
    logger.info('Sistema de monitoreo automático iniciado');
    this.running = true;
  }

  // Verificar todos los bancos
  async checkAllBanks() {
    logger.info('Iniciando verificación automática de bancos');
    
    try {
      // Obtener todos los bancos activos con sus credenciales de prueba
      const [bancos] = await db.query(`
        SELECT id, codigo, nombre, rut_prueba, pass_prueba 
        FROM bancos WHERE activo = 1
      `);
      
      logger.info(`Verificando ${bancos.length} bancos activos`);
      
      // Verificar cada banco
      for (const banco of bancos) {
        await this.checkBank(banco);
      }
      
      logger.info('Verificación automática de bancos completada');
      
    } catch (error) {
      logger.error('Error en verificación automática de bancos:', error);
      await notifier.sendAlert('Error crítico en verificación de bancos', error.message);
    }
  }

  // Verificar un banco específico
  async checkBank(banco) {
    const { id, codigo, nombre, rut_prueba, pass_prueba } = banco;
    
    logger.info(`Verificando banco: ${nombre} (${codigo})`);
    
    // Variables para registro
    let resultado = 'FALLIDO';
    let detalles = null;
    let tiempoInicio = Date.now();
    
    try {
      // Validar que existan credenciales de prueba
      if (!rut_prueba || !pass_prueba) {
        throw new Error('No hay credenciales de prueba configuradas');
      }
      
      // Crear instancia del banco
      const bancoInstance = bancoFactory.crearImplementacion(codigo);
      
      // Realizar login
      await bancoInstance.login(rut_prueba, pass_prueba);
      
      // Obtener cartola (últimos 10 días)
      const fechaFin = new Date();
      const fechaInicio = new Date();
      fechaInicio.setDate(fechaInicio.getDate() - 10);
      
      const cartola = await bancoInstance.getCartola(fechaInicio, fechaFin);
      
      // Validar que se obtuvo algún movimiento
      if (!cartola || !cartola.movimientos || cartola.movimientos.length === 0) {
        throw new Error('No se obtuvieron movimientos en la cartola');
      }
      
      // Todo correcto
      resultado = 'EXITOSO';
      detalles = `Obtenidos ${cartola.movimientos.length} movimientos`;
      
    } catch (error) {
      logger.error(`Error verificando banco ${codigo}:`, error);
      detalles = error.message;
      
      // Actualizar estado del servicio
      await db.query(`
        INSERT INTO estados_servicio (banco_id, estado, mensaje, fecha_verificacion)
        VALUES (?, 'INACTIVO', ?, NOW())
      `, [id, error.message]);
      
      // Enviar alerta
      await notifier.sendAlert(
        `Servicio de banco ${nombre} no disponible`,
        `Error detectado: ${error.message}`
      );
      
    } finally {
      // Calcular duración
      const duracion = Date.now() - tiempoInicio;
      
      // Registrar verificación
      await db.query(`
        INSERT INTO verificaciones_automaticas 
        (banco_id, resultado, detalles, duracion_ms, fecha_verificacion)
        VALUES (?, ?, ?, ?, NOW())
      `, [id, resultado, detalles, duracion]);
      
      // Si fue exitoso, actualizar estado del servicio
      if (resultado === 'EXITOSO') {
        await db.query(`
          INSERT INTO estados_servicio (banco_id, estado, mensaje, fecha_verificacion)
          VALUES (?, 'ACTIVO', NULL, NOW())
        `, [id]);
      }
      
      logger.info(`Verificación de ${codigo} completada: ${resultado} (${duracion}ms)`);
    }
  }

  // Verificar un banco específico manualmente
  async checkBankManually(bancoCodigo) {
    logger.info(`Iniciando verificación manual para banco: ${bancoCodigo}`);
    
    try {
      // Obtener información del banco
      const [bancos] = await db.query(`
        SELECT id, codigo, nombre, rut_prueba, pass_prueba 
        FROM bancos WHERE codigo = ?
      `, [bancoCodigo]);
      
      if (bancos.length === 0) {
        throw new Error(`Banco no encontrado: ${bancoCodigo}`);
      }
      
      // Realizar verificación
      await this.checkBank(bancos[0]);
      
      return { success: true, message: 'Verificación completada' };
      
    } catch (error) {
      logger.error(`Error en verificación manual de banco ${bancoCodigo}:`, error);
      throw error;
    }
  }
}

module.exports = new BancoChecker();
