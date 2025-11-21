import { chromium } from "playwright";

async function setupBrowser() {
  const browser = await chromium.launch({
    headless: false,
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-dev-shm-usage",
      "--disable-accelerated-2d-canvas",
      "--disable-gpu",
      "--start-maximized",
    ],
  });

  const context = await browser.newContext({
    viewport: null,
    userAgent:
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36",
    locale: "es-CL",
    timezoneId: "America/Santiago",
    geolocation: { latitude: -33.4489, longitude: -70.6693 },
    permissions: ["geolocation"],
    colorScheme: "light",
  });

  // 🧠 INYECTA el script justo aquí
  await context.addInitScript(() => {
    // Evita detección de WebDriver
    Object.defineProperty(navigator, "webdriver", {
      get: () => false,
    });

    // Simula idioma normal
    Object.defineProperty(navigator, "languages", {
      get: () => ["es-CL", "es"],
    });

    // Simula plugins reales
    Object.defineProperty(navigator, "plugins", {
      get: () => [1, 2, 3],
    });

    // Simula disponibilidad de propiedades típicas
    Object.defineProperty(navigator, "hardwareConcurrency", {
      get: () => 4,
    });

    // Canvas fingerprint spoof básico (opcional)
    const toDataURL = HTMLCanvasElement.prototype.toDataURL;
    HTMLCanvasElement.prototype.toDataURL = function () {
      return toDataURL.apply(this, arguments).replace("A", "B");
    };
  });

  const page = await context.newPage();

  // Aumentar los timeouts globales
  page.setDefaultTimeout(30000); // 30 segundos
  page.setDefaultNavigationTimeout(30000);

  return { browser, context, page };
}

export default setupBrowser;
