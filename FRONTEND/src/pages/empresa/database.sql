-- =====================================================
-- BASE DE DATOS PARA GESTIÓN EMPRESARIAL
-- =====================================================

-- -----------------------------------------------------
-- TABLA DE EMPRESAS
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS empresas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    rut VARCHAR(12) UNIQUE NOT NULL,
    razon_social VARCHAR(255) NOT NULL,
    nombre_fantasia VARCHAR(255),
    giro_comercial VARCHAR(255),
    direccion VARCHAR(255),
    ciudad VARCHAR(100),
    region VARCHAR(100),
    pais VARCHAR(100) DEFAULT 'Chile',
    telefono VARCHAR(20),
    email VARCHAR(100),
    sitio_web VARCHAR(255),
    estado ENUM('activa', 'inactiva', 'suspendida') DEFAULT 'activa',
    fecha_creacion DATETIME DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion DATETIME ON UPDATE CURRENT_TIMESTAMP,
    creado_por INT,
    
    INDEX idx_rut (rut),
    INDEX idx_razon_social (razon_social),
    INDEX idx_estado (estado)
);

-- -----------------------------------------------------
-- TABLA DE PRODUCTOS Y SERVICIOS
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS productos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    empresa_id INT NOT NULL,
    codigo VARCHAR(50) UNIQUE,
    nombre VARCHAR(255) NOT NULL,
    descripcion TEXT,
    tipo ENUM('producto', 'servicio') NOT NULL,
    categoria VARCHAR(100),
    unidad_medida VARCHAR(20) DEFAULT 'UN',
    precio_venta DECIMAL(12, 2),
    costo_unitario DECIMAL(12, 2),
    margen_utilidad DECIMAL(5, 2),
    stock_actual DECIMAL(12, 2) DEFAULT 0,
    stock_minimo DECIMAL(12, 2) DEFAULT 0,
    stock_maximo DECIMAL(12, 2),
    activo BOOLEAN DEFAULT TRUE,
    fecha_creacion DATETIME DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion DATETIME ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (empresa_id) REFERENCES empresas(id) ON DELETE CASCADE,
    INDEX idx_empresa_tipo (empresa_id, tipo),
    INDEX idx_codigo (codigo),
    INDEX idx_nombre (nombre)
);

-- -----------------------------------------------------
-- TABLA DE PLANES RECURRENTES (CONTRATOS)
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS planes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    empresa_id INT NOT NULL,
    nombre_plan VARCHAR(255) NOT NULL,
    descripcion TEXT,
    tipo_plan ENUM('mensual', 'trimestral', 'semestral', 'anual', 'personalizado') NOT NULL,
    precio_base DECIMAL(12, 2) NOT NULL,
    moneda ENUM('CLP', 'USD', 'EUR') DEFAULT 'CLP',
    frecuencia_cobro ENUM('mensual', 'trimestral', 'semestral', 'anual', 'único'),
    dia_cobro INT, -- Día del mes para cobro (1-31)
    servicios_incluidos JSON, -- Array de servicios incluidos
    limites_uso JSON, -- Límites por servicio (ej: {"facturas": 100, "usuarios": 5})
    periodo_prueba_dias INT DEFAULT 0,
    estado ENUM('borrador', 'activo', 'suspendido', 'terminado') DEFAULT 'borrador',
    fecha_inicio DATE,
    fecha_termino DATE,
    fecha_proximo_cobro DATE,
    fecha_creacion DATETIME DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion DATETIME ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (empresa_id) REFERENCES empresas(id) ON DELETE CASCADE,
    INDEX idx_empresa_estado (empresa_id, estado),
    INDEX idx_fecha_proximo_cobro (fecha_proximo_cobro)
);

-- -----------------------------------------------------
-- TABLA DE CONTRATOS (PLANES ACTIVOS)
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS contratos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    plan_id INT NOT NULL,
    empresa_id INT NOT NULL,
    cliente_rut VARCHAR(12) NOT NULL,
    cliente_nombre VARCHAR(255) NOT NULL,
    cliente_email VARCHAR(100),
    cliente_telefono VARCHAR(20),
    fecha_contrato DATE NOT NULL,
    fecha_inicio DATE NOT NULL,
    fecha_termino DATE,
    monto_mensual DECIMAL(12, 2) NOT NULL,
    moneda ENUM('CLP', 'USD', 'EUR') DEFAULT 'CLP',
    forma_pago ENUM('transferencia', 'tarjeta', 'debito_automatico', 'otro') DEFAULT 'transferencia',
    dia_pago INT, -- Día del mes para pago
    estado ENUM('pendiente', 'activo', 'suspendido', 'terminado', 'cancelado') DEFAULT 'pendiente',
    notas TEXT,
    documentos JSON, -- Array de documentos asociados
    fecha_creacion DATETIME DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion DATETIME ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (plan_id) REFERENCES planes(id) ON DELETE CASCADE,
    FOREIGN KEY (empresa_id) REFERENCES empresas(id) ON DELETE CASCADE,
    INDEX idx_cliente_rut (cliente_rut),
    INDEX idx_empresa_estado (empresa_id, estado),
    INDEX idx_fecha_inicio (fecha_inicio),
    INDEX idx_fecha_termino (fecha_termino)
);

-- -----------------------------------------------------
-- TABLA DE INVITACIONES
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS invitaciones (
    id INT AUTO_INCREMENT PRIMARY KEY,
    empresa_id INT NOT NULL,
    email_invitado VARCHAR(100) NOT NULL,
    nombre_invitado VARCHAR(255),
    tipo_acceso ENUM('admin', 'editor', 'visualizador', 'invitado') NOT NULL,
    permisos JSON, -- Array de permisos específicos
    token_invitacion VARCHAR(255) UNIQUE NOT NULL,
    fecha_expiracion DATETIME NOT NULL,
    estado ENUM('pendiente', 'aceptada', 'rechazada', 'expirada') DEFAULT 'pendiente',
    fecha_envio DATETIME DEFAULT CURRENT_TIMESTAMP,
    fecha_respuesta DATETIME,
    invitado_por INT NOT NULL,
    notas TEXT,
    
    FOREIGN KEY (empresa_id) REFERENCES empresas(id) ON DELETE CASCADE,
    INDEX idx_email_invitado (email_invitado),
    INDEX idx_token (token_invitacion),
    INDEX idx_estado (estado),
    INDEX idx_fecha_expiracion (fecha_expiracion)
);

-- -----------------------------------------------------
-- TABLA DE PERMISOS DE USUARIO POR EMPRESA
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS usuarios_empresas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT NOT NULL,
    empresa_id INT NOT NULL,
    rol ENUM('admin', 'editor', 'visualizador', 'invitado') NOT NULL,
    permisos_especificos JSON, -- Permisos granulares
    fecha_asignacion DATETIME DEFAULT CURRENT_TIMESTAMP,
    fecha_ultimo_acceso DATETIME,
    estado ENUM('activo', 'inactivo') DEFAULT 'activo',
    
    FOREIGN KEY (empresa_id) REFERENCES empresas(id) ON DELETE CASCADE,
    UNIQUE KEY unique_usuario_empresa (usuario_id, empresa_id),
    INDEX idx_usuario_estado (usuario_id, estado),
    INDEX idx_empresa_rol (empresa_id, rol)
);

-- -----------------------------------------------------
-- TABLA DE INTEGRACIONES
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS integraciones (
    id INT AUTO_INCREMENT PRIMARY KEY,
    empresa_id INT NOT NULL,
    tipo_servicio ENUM('boletas_sii', 'sii_empresas', 'bci', 'santander', 'chile', 'itau', 'scotiabank', 'bice', 'otro') NOT NULL,
    nombre_cuenta VARCHAR(255) NOT NULL,
    credenciales JSON NOT NULL, -- Credenciales encriptadas
    estado ENUM('activa', 'inactiva', 'error', 'pendiente') DEFAULT 'inactiva',
    fecha_ultima_sincronizacion DATETIME,
    fecha_proxima_sincronizacion DATETIME,
    error_message TEXT,
    configuracion_adicional JSON, -- Configuración específica del servicio
    fecha_creacion DATETIME DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion DATETIME ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (empresa_id) REFERENCES empresas(id) ON DELETE CASCADE,
    INDEX idx_empresa_tipo (empresa_id, tipo_servicio),
    INDEX idx_estado (estado)
);

-- -----------------------------------------------------
-- TABLA DE LOGS DE INTEGRACIONES
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS integracion_logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    integracion_id INT NOT NULL,
    tipo_operacion ENUM('conexion', 'sincronizacion', 'error', 'prueba') NOT NULL,
    estado ENUM('exitoso', 'error', 'parcial') NOT NULL,
    mensaje TEXT,
    datos_procesados JSON,
    fecha_operacion DATETIME DEFAULT CURRENT_TIMESTAMP,
    duracion_ms INT,
    
    FOREIGN KEY (integracion_id) REFERENCES integraciones(id) ON DELETE CASCADE,
    INDEX idx_integracion_fecha (integracion_id, fecha_operacion),
    INDEX idx_estado (estado)
);

-- -----------------------------------------------------
-- TABLA DE DOCUMENTOS EMPRESARIALES
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS documentos_empresa (
    id INT AUTO_INCREMENT PRIMARY KEY,
    empresa_id INT NOT NULL,
    tipo_documento ENUM('contrato', 'factura', 'boleta', 'acta', 'informe', 'otro') NOT NULL,
    nombre_archivo VARCHAR(255) NOT NULL,
    ruta_archivo VARCHAR(500) NOT NULL,
    tamaño_bytes BIGINT,
    mime_type VARCHAR(100),
    descripcion TEXT,
    tags JSON, -- Array de tags
    fecha_creacion DATETIME DEFAULT CURRENT_TIMESTAMP,
    creado_por INT,
    
    FOREIGN KEY (empresa_id) REFERENCES empresas(id) ON DELETE CASCADE,
    INDEX idx_empresa_tipo (empresa_id, tipo_documento),
    INDEX idx_fecha_creacion (fecha_creacion)
);

-- -----------------------------------------------------
-- INSERCIONES DE DATOS DE EJEMPLO
-- -----------------------------------------------------

-- Empresa ejemplo
INSERT INTO empresas (rut, razon_social, nombre_fantasia, giro_comercial, direccion, ciudad, region, email, telefono) VALUES
('76.123.456-9', 'Tecnología y Servicios SpA', 'TechServe', 'Consultoría Tecnológica', 'Av. Providencia 1234', 'Santiago', 'Región Metropolitana', 'contacto@techserve.cl', '+56223456789'),
('11.222.333-4', 'Comercial del Sur Ltda.', 'SurComercial', 'Comercio Minorista', 'Calle Sur 567', 'Concepción', 'Bío Bío', 'info@surcomercial.cl', '+56412345678'),
('88.999.000-7', 'Servicios Financieros SA', 'FinServ', 'Servicios Financieros', 'Las Condes 890', 'Santiago', 'Región Metropolitana', 'servicios@finserv.cl', '+56234567890');

-- Productos ejemplo
INSERT INTO productos (empresa_id, codigo, nombre, descripcion, tipo, categoria, precio_venta, costo_unitario, stock_actual) VALUES
(1, 'PROD-001', 'Licencia Software ERP', 'Licencia anual de sistema ERP completo', 'servicio', 'Software', 150000.00, 45000.00, 0),
(1, 'PROD-002', 'Capacitación Equipo', 'Capacitación personalizada para 10 usuarios', 'servicio', 'Capacitación', 85000.00, 25000.00, 0),
(1, 'PROD-003', 'Soporte Técnico Mensual', 'Soporte técnico prioritario 24/7', 'servicio', 'Soporte', 120000.00, 60000.00, 0),
(2, 'PROD-004', 'Laptop Notebook', 'Notebook i5 8GB RAM 256GB SSD', 'producto', 'Hardware', 450000.00, 350000.00, 25),
(2, 'PROD-005', 'Monitor 24"', 'Monitor LED 24 pulgadas Full HD', 'producto', 'Hardware', 95000.00, 65000.00, 50);

-- Planes ejemplo
INSERT INTO planes (empresa_id, nombre_plan, descripcion, tipo_plan, precio_base, moneda, frecuencia_cobro, dia_cobro, servicios_incluidos, estado, fecha_inicio, fecha_proximo_cobro) VALUES
(1, 'Plan Emprendedor', 'Plan básico para pequeñas empresas', 'mensual', 50000.00, 'CLP', 'mensual', 5, '{"facturacion": true, "reportes": 5, "usuarios": 2}', 'activo', '2024-01-01', '2024-02-05'),
(1, 'Plan Profesional', 'Plan completo con todas las funcionalidades', 'mensual', 150000.00, 'CLP', 'mensual', 5, '{"facturacion": true, "reportes": "ilimitado", "usuarios": 10, "api": true}', 'activo', '2024-01-01', '2024-02-05'),
(2, 'Plan Básico Retail', 'Plan adaptado para comercio minorista', 'mensual', 35000.00, 'CLP', 'mensual', 10, '{"inventario": true, "ventas": true, "reportes": 10}', 'activo', '2024-01-15', '2024-02-10');

-- Contratos ejemplo
INSERT INTO contratos (plan_id, empresa_id, cliente_rut, cliente_nombre, cliente_email, cliente_telefono, fecha_contrato, fecha_inicio, monto_mensual, forma_pago, dia_pago, estado) VALUES
(1, 1, '12.345.678-9', 'Juan Pérez González', 'juan.perez@email.com', '+56912345678', '2024-01-15', '2024-02-01', 50000.00, 'transferencia', 5, 'activo'),
(2, 1, '98.765.432-1', 'María López Soto', 'maria.lopez@empresa.cl', '+56987654321', '2024-01-20', '2024-02-01', 150000.00, 'debito_automatico', 5, 'activo'),
(3, 2, '55.666.777-2', 'Carlos Silva Muñoz', 'carlos.silva@retail.cl', '+56955555555', '2024-01-25', '2024-02-01', 35000.00, 'transferencia', 10, 'activo');

-- Invitaciones ejemplo
INSERT INTO invitaciones (empresa_id, email_invitado, nombre_invitado, tipo_acceso, permisos, token_invitacion, fecha_expiracion, estado, invitado_por) VALUES
(1, 'nuevo.admin@empresa.com', 'Administrador Nuevo', 'admin', '{"empresas": ["ver", "crear", "editar", "eliminar"], "usuarios": ["ver", "crear", "editar", "eliminar"]}', 'token_admin_12345', '2024-02-15 23:59:59', 'pendiente', 1),
(1, 'editor@empresa.com', 'Editor Usuario', 'editor', '{"empresas": ["ver", "editar"], "productos": ["ver", "crear", "editar"]}', 'token_editor_67890', '2024-02-10 23:59:59', 'pendiente', 1),
(2, 'visor@retail.com', 'Visor Retail', 'visualizador', '{"empresas": ["ver"], "reportes": ["ver"]}', 'token_visor_11111', '2024-02-20 23:59:59', 'pendiente', 2);

-- Integraciones ejemplo
INSERT INTO integraciones (empresa_id, tipo_servicio, nombre_cuenta, credenciales, estado, configuracion_adicional) VALUES
(1, 'sii_empresas', 'SII Principal', '{"rut": "76.123.456-9", "password": "encrypted_password", "clave_llave": "encrypted_key"}', 'activa', '{"auto_sync": true, "sync_frequency": "daily"}'),
(1, 'bci', 'Cuenta Corriente BCI', '{"rut": "12.345.678-9", "password": "encrypted_password"}', 'activa', '{"account_type": "corriente", "sync_days": 30}'),
(2, 'boletas_sii', 'Emisor Boletas SII', '{"rut": "11.222.333-4", "password": "encrypted_password"}', 'pendiente', '{"certificate_path": "/certs/boleta.p12"}'),
(3, 'santander', 'Cuenta Santander', '{"rut": "88.999.000-7", "password": "encrypted_password"}', 'inactiva', '{"account_type": "vista", "auto_sync": false}');