// bancos/banco1/login.js
const BancoBase = require('../banco-base');
const { formatearRut } = require('../../utils/rutFormatter');
const logger = require('../../utils/logger');

class Banco1Login extends BancoBase {
  constructor() {
    super('banco1');
    this.baseUrl = 'https://www.banco1.cl';
    this.loginUrl = `${this.baseUrl}/personas/login`;
  }

  async realizarLogin(rut, password) {
    logger.debug(`Iniciando login en ${this.banco} para RUT: ${rut}`);
    
    try {
      // Navegar a la página de login
      await this.page.goto(this.loginUrl, { waitUntil: 'networkidle' });
      
      // Esperar que cargue el formulario
      await this.page.waitForSelector('#rutInput', { timeout: this.timeout });
      
      // Formatear RUT si es necesario
      const rutFormateado = formatearRut(rut);
      
      // Completar formulario
      await this.page.fill('#rutInput', rutFormateado);
      await this.page.fill('#passwordInput', password);
      
      // Hacer click en botón de login
      await Promise.all([
        this.page.waitForNavigation({ timeout: this.timeout }),
        this.page.click('#loginButton')
      ]);
      
      // Verificar si el login fue exitoso
      if (await this.page.url().includes('/error')) {
        throw new Error('Credenciales inválidas o error de autenticación');
      }
      
      // Verificar elemento que confirme login exitoso
      await this.page.waitForSelector('.welcome-message', { timeout: this.timeout });
      
      logger.info(`Login exitoso en ${this.banco} para RUT: ${rut}`);
      return true;
      
    } catch (error) {
      logger.error(`Error en login de ${this.banco}:`, error);
      throw new Error(`Error en login de ${this.banco}: ${error.message}`);
    }
  }
}

module.exports = Banco1Login;

// bancos/banco1/cartola.js
const { format } = require('date-fns');
const logger = require('../../utils/logger');

class Banco1Cartola {
  constructor(page) {
    this.page = page;
    this.banco = 'banco1';
  }

  async obtenerCartola(fechaInicio, fechaFin) {
    logger.debug(`Iniciando extracción de cartola en ${this.banco}`);
    
    try {
      // Navegar a sección de cartolas
      await this.page.goto('https://www.banco1.cl/personas/cuentas/movimientos', 
        { waitUntil: 'networkidle' });
      
      // Formatear fechas para el formulario
      const fechaInicioStr = format(new Date(fechaInicio), 'dd/MM/yyyy');
      const fechaFinStr = format(new Date(fechaFin), 'dd/MM/yyyy');
      
      // Completar formulario de fechas
      await this.page.fill('#fechaDesde', fechaInicioStr);
      await this.page.fill('#fechaHasta', fechaFinStr);
      
      // Consultar movimientos
      await Promise.all([
        this.page.waitForResponse(
          response => response.url().includes('/api/movimientos') && response.status() === 200,
          { timeout: 30000 }
        ),
        this.page.click('#consultarButton')
      ]);
      
      // Esperar a que se carguen los datos en la tabla
      await this.page.waitForSelector('table.movimientos-table tr', { timeout: 30000 });
      
      // Extraer datos de la tabla
      const movimientos = await this.page.$$eval('table.movimientos-table tbody tr', rows => {
        return rows.map(row => {
          const cells = row.querySelectorAll('td');
          return {
            fecha: cells[0].textContent.trim(),
            descripcion: cells[1].textContent.trim(),
            monto: cells[2].textContent.trim().replace(/\./g, '').replace(',', '.'),
            tipo: cells[2].textContent.trim().startsWith('-') ? 'CARGO' : 'ABONO'
          };
        });
      });
      
      logger.info(`Extracción exitosa de ${movimientos.length} movimientos en ${this.banco}`);
      
      return {
        banco: this.banco,
        fecha_consulta: new Date().toISOString(),
        movimientos
      };
      
    } catch (error) {
      logger.error(`Error en extracción de cartola de ${this.banco}:`, error);
      throw new Error(`Error en extracción de cartola de ${this.banco}: ${error.message}`);
    }
  }
}

module.exports = Banco1Cartola;
