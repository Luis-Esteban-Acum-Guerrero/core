// En tu controlador principal - cartolaController.js
const Queue = require('bull');
const { v4: uuidv4 } = require('uuid');
const db = require('../config/database');

// Configurar la cola con Redis
const scrapingQueue = new Queue('bank-scraping', {
  redis: {
    host: process.env.REDIS_HOST || 'localhost',
    port: process.env.REDIS_PORT || 6379
  }
});

class CartolaController {
  // Método para solicitar cartolas (procesamiento asíncrono)
  async solicitarCartolas(req, res) {
    try {
      const usuariosData = req.body;
      
      if (!Array.isArray(usuariosData) || usuariosData.length === 0) {
        return res.status(400).json({ error: 'Formato de solicitud inválido' });
      }
      
      // Generar ID único para este lote de solicitudes
      const batchId = uuidv4();
      
      // Registrar la solicitud en la base de datos
      await db.query(
        'INSERT INTO solicitud_cartolas (batch_id, usuario_id, estado, cantidad_solicitudes) VALUES (?, ?, ?, ?)',
        [batchId, req.user.id, 'PENDIENTE', usuariosData.length]
      );
      
      // Agregar cada solicitud a la cola
      for (const userData of usuariosData) {
        await scrapingQueue.add(
          'extraerCartola',
          {
            batchId,
            usuarioId: req.user.id,
            datos: userData
          },
          {
            attempts: 3,
            backoff: {
              type: 'exponential',
              delay: 5000
            }
          }
        );
      }
      
      res.status(202).json({
        mensaje: 'Solicitud de cartolas en proceso',
        batchId,
        estadoUrl: `/api/cartola/estado/${batchId}`
      });
      
    } catch (error) {
      console.error('Error al encolar solicitudes:', error);
      res.status(500).json({ error: 'Error interno al procesar la solicitud' });
    }
  }
  
  // Método para consultar estado de solicitud
  async consultarEstadoSolicitud(req, res) {
    try {
      const { batchId } = req.params;
      
      // Verificar que el batch pertenezca al usuario
      const [solicitud] = await db.query(
        'SELECT * FROM solicitud_cartolas WHERE batch_id = ? AND usuario_id = ?',
        [batchId, req.user.id]
      );
      
      if (!solicitud.length) {
        return res.status(404).json({ error: 'Solicitud no encontrada' });
      }
      
      // Obtener estado de procesamiento
      const [resultados] = await db.query(
        'SELECT COUNT(*) as total, SUM(CASE WHEN estado = "COMPLETADO" THEN 1 ELSE 0 END) as completados, ' +
        'SUM(CASE WHEN estado = "ERROR" THEN 1 ELSE 0 END) as errores ' +
        'FROM cartola_procesamiento WHERE batch_id = ?',
        [batchId]
      );
      
      // Verificar si está completo para devolver resultados
      if (resultados[0].total === resultados[0].completados + resultados[0].errores) {
        // Obtener resultados completos
        const [cartolas] = await db.query(
          'SELECT * FROM cartolas WHERE batch_id = ?',
          [batchId]
        );
        
        const [erroresDetalle] = await db.query(
          'SELECT * FROM cartola_errores WHERE batch_id = ?',
          [batchId]
        );
        
        return res.status(200).json({
          estado: 'COMPLETADO',
          estadisticas: resultados[0],
          resultados: cartolas,
          errores: erroresDetalle
        });
      }
      
      // Si no está completo, devolver estado actual
      return res.status(200).json({
        estado: 'EN_PROCESO',
        estadisticas: resultados[0],
        progreso: `${resultados[0].completados + resultados[0].errores}/${resultados[0].total}`,
        porcentaje: ((resultados[0].completados + resultados[0].errores) / resultados[0].total) * 100
      });
      
    } catch (error) {
      console.error('Error al consultar estado:', error);
      res.status(500).json({ error: 'Error interno al consultar estado' });
    }
  }
}

// En un archivo separado - worker.js
// Este worker se ejecuta en procesos separados
const { Worker } = require('bull');
const PlaywrightManager = require('../utils/playwrightManager');

const bancoFactory = require('../bancos/bancoFactory');

// Crear worker para procesar la cola
const worker = new Worker('bank-scraping', async (job) => {
  const { batchId, usuarioId, datos } = job.data;
  const { rut, pass, banco } = datos;
  
  console.log(`Procesando solicitud para RUT: ${rut}, Banco: ${banco}`);
  
  try {
    // Actualizar estado en BD
    await db.query(
      'INSERT INTO cartola_procesamiento (batch_id, rut, banco, estado) VALUES (?, ?, ?, ?)',
      [batchId, rut, banco, 'PROCESANDO']
    );
    
    // Obtener implementación específica para el banco
    const bancoImplementacion = bancoFactory.crearImplementacion(banco);
    
    // Realizar login y obtener cartola
    await bancoImplementacion.login(rut, pass);
    const cartola = await bancoImplementacion.getCartola();
    
    // Transformar a formato estándar
    const cartolaTransformada = await bancoImplementacion.transformarDatos(cartola);
    
    // Guardar resultado en BD
    await db.query(
      'INSERT INTO cartolas (batch_id, rut, banco, datos, fecha_procesamiento) VALUES (?, ?, ?, ?, NOW())',
      [batchId, rut, banco, JSON.stringify(cartolaTransformada)]
    );
    
    // Actualizar estado
    await db.query(
      'UPDATE cartola_procesamiento SET estado = ? WHERE batch_id = ? AND rut = ? AND banco = ?',
      ['COMPLETADO', batchId, rut, banco]
    );
    
    return { success: true, rut, banco };
    
  } catch (error) {
    console.error(`Error procesando RUT ${rut}, Banco ${banco}:`, error);
    
    // Registrar error
    await db.query(
      'INSERT INTO cartola_errores (batch_id, rut, banco, mensaje_error) VALUES (?, ?, ?, ?)',
      [batchId, rut, banco, error.message]
    );
    
    // Actualizar estado
    await db.query(
      'UPDATE cartola_procesamiento SET estado = ? WHERE batch_id = ? AND rut = ? AND banco = ?',
      ['ERROR', batchId, rut, banco]
    );
    
    throw error;
  }
});

console.log('Worker de procesamiento de cartolas iniciado');
