async function loginSII(page, rut, clave) {
  try {
    // Verificar que rut y clave no sean undefined
    if (!rut || !clave) {
      throw new Error("RUT o clave no proporcionados para el login");
    }

    await page.goto("https://homer.sii.cl/");
    await page.getByRole("link", { name: "Ingresar a Mi Sii" }).click();
    await page.getByPlaceholder("Ej:").fill(rut);

    await page.getByPlaceholder("Ej:").press("Tab");
    await page.locator("#clave").fill(clave);

    await page.waitForTimeout(500); // Pequeña pausa, sin esta el login arroja error
    await page.getByRole("button", { name: "Ingresar", exact: true }).click();

    await page.waitForLoadState("networkidle");

    const titulo = page.locator("#titulo");
    if ((await titulo.count()) > 0) {
      console.log("[LOGIN] Error en el login SII:");
      return {
        status: "ERROR",
        message: "Login fallido. Verifique RUT y Clave.",
        sii: await titulo.textContent(),
      };
    }

    // Manejar posibles popups después del login
    const closeButton = page.getByRole("button", { name: "Cerrar" });
    if ((await closeButton.count()) > 0) {
      console.log("[LOGIN] Cerrando popup de información.");
      await closeButton.click();
    }

    // Modal para actualización de datos en SII
    const actualizarDespues = page.getByLabel("Actualizar después");
    if ((await actualizarDespues.count()) > 0) {
      console.log("[LOGIN] Cerrando modal de actualización.");
      await actualizarDespues.click();
    }

    const actualizarDespues2 = page.locator("#btnActualizarMasTarde");
    if ((await actualizarDespues2.count()) > 0) {
      console.log("[LOGIN] Cerrando modal de actualización.");
      await actualizarDespues2.click();
    }

    await page.waitForLoadState("networkidle");

    console.log(`[LOGIN] ${rut} SII: OK`);

    return {
      status: "OK",
      message: "Login exitoso",
    };
  } catch (error) {
    console.error("[LOGIN] Error en el login SII:", error.message);
    throw error; // Re-lanzar el error para que se maneje en el nivel superior
  }
}

export default loginSII;
