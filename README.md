# Core Platform

Plataforma multi-aplicación que incluye API REST con Express.js, aplicación web moderna con Astro, y bot de WhatsApp con IA para automatización de procesos empresariales, scraping del SII y extracción de datos bancarios.

## 🏗️ Arquitectura Multi-Tier

El proyecto consiste en tres aplicaciones independientes que trabajan juntas:

### **🔧 Core API** (Directorio raíz)
- **API REST** con Express.js y middleware de seguridad
- **Automatización web** con Playwright para scraping del SII
- **Sistema de colas** con BullMQ y Redis para procesamiento asíncrono
- **Integración bancaria** para extracción de datos y cartolas
- **Gestión de sesiones** con tokens JWT

### **🤖 WhatsApp Bot** (Directorio `BOT/`)
- **Bot independiente** con BuilderBot y proveedor Baileys
- **IA integrada** con Google Gemini para respuestas inteligentes
- **Flujos de conversación** personalizados
- **Validación de clientes** y creación de tickets

### **🌐 Frontend Web** (Directorio `FRONTEND/`)
- **Aplicación moderna** con Astro y React
- **UI components** con Tailwind CSS y Preline
- **Sistema de emails** con plantillas personalizadas
- **Generación de informes** y reportes PDF
- **Desarrollo HTTPS** con certificados SSL

## 📁 Estructura del Proyecto

```
core/
├── BOT/                   # Bot de WhatsApp independiente
│   ├── index.js           # Servidor principal del bot
│   ├── package.json       # Dependencias del bot
│   └── ...                # Configuraciones del bot
├── FRONTEND/              # Aplicación web moderna
│   ├── src/               # Código fuente Astro/React
│   ├── email/             # Plantillas de email
│   ├── informes/          # Sistema de reportes
│   ├── public/            # Assets estáticos
│   └── package.json       # Dependencias del frontend
├── _auto/                 # Scripts de automatización web
├── _email/                # Funcionalidades de email (core)
├── _informes/             # Generación de informes (core)
├── __endpoints_c0re/      # Colecciones de API para Bruno
├── .contexto/             # Contexto de desarrollo
├── .ideas/                # Registro de ideas
├── assets/                # Archivos estáticos
├── middleware/            # Middleware de autenticación
├── routes/                # Rutas de la API
├── utils/                 # Utilidades y helpers
├── scripts/               # Scripts de mantenimiento
├── server.js              # Servidor principal de la API
├── package.json           # Dependencias y scripts
└── ecosystem.config.js    # Configuración de PM2
```

## 🛠️ Stack Tecnológico

### **Core API**
- **Node.js** - Runtime de JavaScript
- **Express.js** - Framework web
- **Playwright** - Automatización de navegadores
- **BullMQ** - Sistema de colas
- **Redis** - Base de datos en memoria
- **MySQL2** - Conector de base de datos MySQL
- **JWT** - Tokens de autenticación

### **WhatsApp Bot**
- **BuilderBot** - Plataforma de bots de WhatsApp
- **Baileys Provider** - Conexión con WhatsApp
- **Google Gemini AI** - Procesamiento de lenguaje natural

### **Frontend Web**
- **Astro** - Framework web moderno
- **React** - Biblioteca de UI components
- **Tailwind CSS** - Framework de CSS
- **Preline** - Componentes UI
- **Resend** - Servicio de email
- **TypeScript** - Tipado estático

### **DevOps & Testing**
- **Playwright** - Testing E2E
- **Bruno** - Testing de APIs
- **PM2** - Gestión de procesos
- **Helmet** - Middleware de seguridad

## 📋 Prerrequisitos

- **Node.js 18+** - Runtime principal
- **Redis server** - Sistema de colas y caché
- **MySQL database** - Base de datos principal
- **Cuenta de WhatsApp Business** - Para el bot
- **Cuenta de Google Cloud** - Para Gemini AI
- **Cuenta de Resend** - Para envío de emails

## 🚀 Instalación y Configuración

### **1. Clonar el repositorio**
```bash
git clone <repository-url>
cd core
```

### **2. Instalar dependencias principales**
```bash
# API Core
npm install

# Bot de WhatsApp
cd BOT
npm install
cd ..

# Frontend
cd FRONTEND
npm install
cd ..
```

### **3. Configurar variables de entorno**
```bash
# Archivo .env principal (raíz)
cp .env.example .env

# Archivo .env del bot
cd BOT
cp .env.example .env
cd ..

# Archivo .env del frontend
cd FRONTEND
cp .env.example .env
cd ..
```

### **4. Iniciar servicios**
```bash
# Iniciar Redis
redis-server

# Iniciar API Core
npm start

# Iniciar Bot de WhatsApp (en terminal separado)
cd BOT
node index.js

# Iniciar Frontend (en terminal separado)
cd FRONTEND
npm run dev
```

### **5. O con PM2 (producción)**
```bash
# Iniciar todos los servicios
pm2 start ecosystem.config.js

# Ver estado de los procesos
pm2 list
```

## 🔧 Variables de Entorno

### **API Core (.env)**
```env
PORT=3000
BACKEND_URL=http://localhost:3000
MYSQL_HOST=localhost
MYSQL_USER=root
MYSQL_PASSWORD=password
MYSQL_DATABASE=core_db
REDIS_HOST=localhost
REDIS_PORT=6379
JWT_SECRET=tu_jwt_secret
```

### **Bot de WhatsApp (BOT/.env)**
```env
BOT_PORT=3003
BACKEND_URL=http://localhost:3000
GEMINI_API_KEY=tu_gemini_api_key
OPENAI_API_KEY=tu_openai_api_key
WHATSAPP_PHONE_NUMBER=+569XXXXXXXX
```

### **Frontend (FRONTEND/.env)**
```env
PUBLIC_API_URL=http://localhost:3000
RESEND_API_KEY=tu_resend_api_key
EMAIL_FROM=tu_email@dominio.com
SITE_URL=https://localhost:4321
```

## 📡 Endpoints de la API

### **Autenticación**
- `POST /APIsession` - Crear sesión de API

### **Bot de WhatsApp**
- `POST /bot/ticket/` - Crear ticket desde bot
- `POST /bot/cliente/:phone` - Validar cliente

### **SII (Servicio de Impuestos Internos)**
- `POST /sii/getRCV` - Obtener Registro de Compras y Ventas
- `POST /sii/getInfoTributaria` - Obtener información tributaria
- `POST /sii/getF22` - Obtener Formulario 22
- `POST /sii/getF29` - Obtener Formulario 29

### **Banca y Finanzas**
- `POST /banco/cartola` - Extraer datos de cartola bancaria
- `POST /banco/movimientos` - Obtener movimientos bancarios
- `POST /banco/saldo` - Consultar saldo de cuenta

### **Email y Notificaciones**
- `POST /email/send` - Enviar email personalizado
- `POST /email/template` - Enviar email con plantilla
- `POST /notification/send` - Enviar notificación

### **Informes y Reportes**
- `POST /informes/generate` - Generar informe personalizado
- `GET /informes/list` - Listar informes disponibles
- `GET /informes/download/:id` - Descargar informe

### **Utilitarios**
- `GET /ping` - Health check

## 🤖 Bot de WhatsApp

### **Características**
- **IA integrada** con Google Gemini para conversaciones naturales
- **Flujos personalizados** para diferentes tipos de consultas
- **Validación automática** de clientes en base de datos
- **Creación de tickets** con seguimiento
- **Modo espera** y blacklist para control de spam
- **Respuestas proactivas** basadas en contexto

### **Comandos disponibles**
- `Hola` - Iniciar conversación
- `Estado` - Consultar estado de tickets
- `Ayuda` - Mostrar opciones disponibles
- `Contacto` - Hablar con agente humano

## 🔄 Sistema de Colas

Procesamiento asíncrono de:
- **Scraping del SII** - Extracción de datos tributarios
- **Envío de emails** - Notificaciones y comunicaciones
- **Generación de informes** - Reportes personalizados
- **Extracción bancaria** - Cartolas y movimientos
- **Tareas programadas** - Procesos automatizados

## 🌐 Frontend Web

### **Características**
- **Interface moderna** con Astro y React
- **Desarrollo HTTPS** con certificados SSL locales
- **Componentes reutilizables** con Tailwind CSS
- **Sistema de emails** con plantillas personalizadas
- **Generación de PDFs** y reportes
- **Dashboard interactivo** con gráficos ApexCharts

### **Desarrollo**
```bash
cd FRONTEND
npm run dev        # Servidor HTTPS en puerto 4321
npm run build      # Build para producción
npm run preview    # Previsualizar build
npm run astro      # CLI de Astro
```

## 🧪 Testing

### **Tests E2E con Playwright**
```bash
# Todos los tests
npm run test:e2e

# Con interfaz gráfica
npm run test:e2e:ui

# Test específico
npx playwright test test/example.spec.js

# Modo headed (mostrar navegador)
npx playwright test --headed

# Debug
npx playwright test --debug
```

### **Testing de APIs con Bruno**
- **Colecciones organizadas** en `__endpoints_c0re/`
- **Configuraciones de entorno** para desarrollo y producción
- **Documentación automática** de endpoints

## 📝 Scripts Disponibles

### **API Core**
```bash
npm start              # Iniciar servidor principal
npm run test:e2e       # Tests E2E
npm run test:e2e:ui    # Tests con interfaz
```

### **Frontend**
```bash
cd FRONTEND
npm run dev            # Servidor de desarrollo
npm run build          # Build de producción
npm run preview        # Previsualizar
npm run astro          # CLI de Astro
```

### **Bot**
```bash
cd BOT
node index.js          # Iniciar bot
npm test              # Tests del bot (si existen)
```

## 📧 Sistema de Emails

### **Plantillas Disponibles**
- **AlertEmail** - Notificaciones de alerta
- **NotificationEmail** - Notificaciones generales
- **OtpEmail** - Códigos de un solo uso
- **ReceiptEmail** - Comprobantes y recibos
- **ReceiptAlreadyPaidEmail** - Confirmación de pagos

### **Componentes**
- **Header/Footer** - Estructura base
- **NotificationBody** - Cuerpo de notificaciones
- **OtpBody** - Cuerpo para OTPs
- **ReceiptBody** - Cuerpo para recibos

## 📊 Generación de Informes

### **Capacidades**
- **Informes PDF** con diseño personalizado
- **Componentes reutilizables** (Cover, Table, Footer, etc.)
- **Efectos visuales** (TextScramble, animaciones)
- **Datos dinámicos** desde JSON y APIs
- **Exportación múltiple** formatos

### **Componentes de Informes**
- `Cover.js` - Portada del informe
- `Table.js` - Tablas de datos
- `Pagos.js` - Sección de pagos
- `Menu.js` - Navegación del informe
- `PdfButton.js` - Botón de exportación

## 🔒 Seguridad

- **Rate limiting** (50 requests por 10 minutos)
- **Helmet** para headers de seguridad
- **Tokens JWT** con expiración automática
- **Limpieza automática** de sesiones
- **Validación de inputs** en todos los endpoints
- **HTTPS obligatorio** en producción

## 📈 Monitoreo y Logs

- **Logs estructurados** para debugging
- **PM2** para gestión de procesos
- **Health checks** automáticos
- **Métricas de rendimiento** en tiempo real
- **Alertas automáticas** para errores críticos

## 🤝 Contribución

1. **Fork** del proyecto
2. **Crear feature branch** (`git checkout -b feature/amazing-feature`)
3. **Commit** de cambios (`git commit -m 'Add amazing feature'`)
4. **Push** a la branch (`git push origin feature/amazing-feature`)
5. **Pull request** con descripción detallada

### **Guías de Estilo**
- Seguir convenciones del `AGENTS.md`
- Usar ESLint y Prettier para formato
- Escribir tests para nuevas funcionalidades
- Documentar cambios en el README

## 📄 Licencia

MIT License - ver archivo LICENSE para detalles

## 🐛 Issues y Soporte

- **Reportar issues** en el GitHub repository
- **Documentar errores** con pasos para reproducir
- **Incluir logs** relevantes en el reporte
- **Etiquetar issues** con tipo (bug, feature, enhancement)

## 🚀 Despliegue

### **Producción**
```bash
# Configurar variables de entorno de producción
export NODE_ENV=production

# Iniciar con PM2
pm2 start ecosystem.config.js --env production

# Verificar estado
pm2 status
pm2 logs
```

### **Docker (Opcional)**
```bash
# Build de imagen
docker build -t core-platform .

# Run contenedor
docker run -p 3000:3000 core-platform
```

---

**Nota**: Esta plataforma está diseñada para entornos de producción empresariales y requiere configuración adecuada de seguridad, variables de entorno y certificados SSL para el frontend HTTPS.