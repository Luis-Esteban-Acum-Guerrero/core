-- Tabla de usuarios
CREATE TABLE usuarios (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  nombre VARCHAR(100),
  email VARCHAR(100) UNIQUE,
  activo BOOLEAN DEFAULT TRUE,
  fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  ultimo_acceso TIMESTAMP
);

-- Tabla de configuración de bancos
CREATE TABLE bancos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  codigo VARCHAR(20) NOT NULL UNIQUE,
  nombre VARCHAR(100) NOT NULL,
  url_base VARCHAR(255) NOT NULL,
  activo BOOLEAN DEFAULT TRUE,
  rut_prueba VARCHAR(20),
  pass_prueba VARCHAR(255),
  formato_config JSON,
  fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  ultima_modificacion TIMESTAMP
);

-- Tabla de estado de servicios bancarios
CREATE TABLE estados_servicio (
  id INT AUTO_INCREMENT PRIMARY KEY,
  banco_id INT NOT NULL,
  estado ENUM('ACTIVO', 'INACTIVO', 'DEGRADADO') NOT NULL,
  mensaje TEXT,
  fecha_verificacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (banco_id) REFERENCES bancos(id)
);

-- Tabla para almacenar cartolas procesadas
CREATE TABLE cartolas (
  id INT AUTO_INCREMENT PRIMARY KEY,
  batch_id VARCHAR(36) NOT NULL,
  rut VARCHAR(20) NOT NULL,
  banco VARCHAR(20) NOT NULL,
  datos JSON NOT NULL,
  fecha_procesamiento TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  estado ENUM('ACTIVO', 'INACTIVO') DEFAULT 'ACTIVO',
  INDEX idx_rut_banco (rut, banco),
  INDEX idx_batch (batch_id)
);

-- Tabla para solicitudes de procesamiento por lotes
CREATE TABLE solicitud_cartolas (
  id INT AUTO_INCREMENT PRIMARY KEY,
  batch_id VARCHAR(36) NOT NULL UNIQUE,
  usuario_id INT NOT NULL,
  estado ENUM('PENDIENTE', 'EN_PROCESO', 'COMPLETADO', 'ERROR') NOT NULL,
  cantidad_solicitudes INT NOT NULL,
  fecha_solicitud TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  fecha_finalizacion TIMESTAMP,
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
);

-- Tabla para seguimiento de procesamiento individual
CREATE TABLE cartola_procesamiento (
  id INT AUTO_INCREMENT PRIMARY KEY,
  batch_id VARCHAR(36) NOT NULL,
  rut VARCHAR(20) NOT NULL,
  banco VARCHAR(20) NOT NULL,
  estado ENUM('PENDIENTE', 'PROCESANDO', 'COMPLETADO', 'ERROR') NOT NULL,
  fecha_inicio TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  fecha_fin TIMESTAMP,
  INDEX idx_batch_rut_banco (batch_id, rut, banco)
);

-- Tabla para registro de errores
CREATE TABLE cartola_errores (
  id INT AUTO_INCREMENT PRIMARY KEY,
  batch_id VARCHAR(36) NOT NULL,
  rut VARCHAR(20) NOT NULL,
  banco VARCHAR(20) NOT NULL,
  mensaje_error TEXT NOT NULL,
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_batch (batch_id)
);

-- Tabla para formatos de salida configurados
CREATE TABLE formatos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  banco_id INT NOT NULL,
  nombre VARCHAR(50) NOT NULL,
  estructura JSON NOT NULL,
  campos_requeridos JSON NOT NULL,
  activo BOOLEAN DEFAULT TRUE,
  fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  ultima_modificacion TIMESTAMP,
  FOREIGN KEY (banco_id) REFERENCES bancos(id)
);

-- Tabla para registro de verificaciones automatizadas
CREATE TABLE verificaciones_automaticas (
  id INT AUTO_INCREMENT PRIMARY KEY,
  banco_id INT NOT NULL,
  resultado ENUM('EXITOSO', 'FALLIDO') NOT NULL,
  detalles TEXT,
  duracion_ms INT,
  fecha_verificacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (banco_id) REFERENCES bancos(id)
);
