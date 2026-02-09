const { chromium } = require('playwright');
const logger = require('../../config/logger');
const { ApiError } = require('../../utils/apiError');
const config = require('../../config/env');

/**
 * Implementación genérica del proceso de login bancario
 * Esta clase se extenderá para cada banco específico
 */
class BancoLoginBase {
  constructor(banco) {
    this.banco = banco;
    this.browser = null;
    this.context = null;
    this.page = null;
    this.timeout = config.PLAYWRIGHT_TIMEOUT || 30000;
    this.maxRetries = config.MAX_RETRIES || 3;
  }

  /**
   * Inicializa el navegador y crea un nuevo contexto
   */
  async iniciarNavegador() {
    this.browser = await chromium.launch({
      headless: config.NODE_ENV === 'production',
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    this.context = await this.browser.newContext({
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.110 Safari/537.36',
      viewport: { width: 1280, height: 720 },
      ignoreHTTPSErrors: true
    });
    
    this.page = await this.context.newPage();
    this.page.setDefaultTimeout(this.timeout);
    
    // Interceptar solicitudes de imágenes para acelerar
    if (config.BLOCK_RESOURCES) {
      await this.page.route('**/*.{png,jpg,jpeg,gif,webp}', route => route.abort());
    }
    
    logger.debug(`Navegador iniciado para banco: ${this.banco}`);
  }

  /**
   * Realiza el proceso de login con reintentos
   */
  async login(rut, password) {
    let intentos = 0;
    let error = null;
    
    while (intentos < this.maxRetries) {
      try {
        await this.iniciarNavegador();
        await this.realizarLogin(rut, password);
        logger.info(`Login exitoso para RUT: ${rut} en banco: ${this.banco}`);
        return true;
      } catch (err) {
        error = err;
        logger.warn(`Fallo en intento ${intentos + 1}/${this.maxRetries} de login para RUT: ${rut} en banco: ${this.banco}: ${err.message}`);
        await this.cerrarNavegador();
        intentos++;
      }
    }
    
    logger.error(`Todos los intentos de login fallaron para RUT: ${rut} en banco: ${this.banco}`);
    throw new ApiError(`Error en login después de ${this.maxRetries} intentos: ${error.message}`, 401);
  }

  /**
   * Método a implementar por cada banco específico
   */
  async realizarLogin(rut, password) {
    throw new Error('El método realizarLogin debe ser implementado por cada banco');
  }

  /**
   * Cierra el navegador y libera recursos
   */
  async cerrarNavegador() {
    if (this.browser) {
      await this.browser.close();
      this.browser = null;
      this.context = null;
      this.page = null;
      logger.debug(`Navegador cerrado para banco: ${this.banco}`);
    }
  }
}

module.exports = BancoLoginBase;
