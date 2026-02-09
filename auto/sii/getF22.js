import loginSII from "./login.js";

async function selectYear(page, year) {
  const label = String(year);
  const combobox = page.getByRole("combobox");
  const options = await combobox.locator("option").all();
  let value = null;
  for (const opt of options) {
    const optLabel = await opt.getAttribute("label");
    if (optLabel === label) {
      value = await opt.getAttribute("value");
      break;
    }
  }
  if (value) {
    await combobox.selectOption(value);
  } else {
    await combobox.selectOption({ label });
  }
}

async function extractHistorial(page) {
  return await page.evaluate(() => {
    const tables = Array.from(
      document.querySelectorAll(
        "table.table.table-f22.table-striped.table-bordered.table-hover"
      )
    );
    const registros = [];
    for (const table of tables) {
      const headers = Array.from(table.querySelectorAll("thead th"))
        .map((th) => (th.textContent || "").replace(/\s+/g, " ").trim())
        .filter((t) => t.length > 0);
      const rows = Array.from(table.querySelectorAll("tbody tr"));
      for (const tr of rows) {
        const tds = Array.from(tr.querySelectorAll("td")).map((td) =>
          (td.textContent || "").replace(/\s+/g, " ").trim()
        );
        if (headers.length && headers.length === tds.length) {
          const obj = {};
          headers.forEach((h, i) => (obj[h] = tds[i]));
          if (Object.values(obj).some((v) => v && v.length > 0))
            registros.push(obj);
        } else if (tds.some((v) => v && v.length > 0)) {
          registros.push(tds);
        }
      }
    }
    if (!registros.length) return { registros: [["No registra información"]] };
    return { registros };
  });
}

async function extractFormulario(page) {
  return await page.evaluate(() => {
    const seen = new Set();
    const data = [];

    const excluded = new Set(["encabezado", "identificacion", "sistematrib"]);
    const bases = [
      document.getElementById("baseimponible"),
      document.getElementById("recuadrocalculosf2214"),
    ].filter(Boolean);

    const isExcluded = (el) => {
      let e = el;
      while (e) {
        if (e.id && excluded.has(e.id.toLowerCase())) return true;
        e = e.parentElement;
      }
      return false;
    };
    const isAfterBase = (el) => {
      if (!bases.length) return !isExcluded(el);
      for (const base of bases) {
        if (base.contains(el)) return true;
        const rel = base.compareDocumentPosition(el);
        if ((rel & Node.DOCUMENT_POSITION_FOLLOWING) !== 0) return true;
      }
      return false;
    };

    const addRow = (codigo, valor, signo = "") => {
      if (!Number.isFinite(codigo)) return;
      const key = `${codigo}`;
      if (seen.has(key)) return;
      seen.add(key);
      data.push({
        codigo,
        valor: (valor ?? "").toString().trim(),
        signo: (signo ?? "").toString().trim(),
      });
    };

    // Support for <f22code> directive
    const f22nodes = Array.from(document.querySelectorAll("f22code"));
    for (const node of f22nodes) {
      if (!isAfterBase(node)) continue;
      const input = node.querySelector(
        'input[name="input-f22"], input[id^="COD_"], input[ng-model*="cod"], input[data-ng-model*="cod"], input[id], input, textarea, div[ng-if*="tipoCod"][ng-if*="text"]'
      );
      const prependNumEl = node.querySelector(
        ".input-group-prepend .input-group-text, .input-group-addon.input-group-num"
      );
      const prependNum = (prependNumEl?.textContent || "")
        .replace(/\s+/g, " ")
        .trim();
      const id = (input?.id || "").trim();
      const dataValorAttr = node.getAttribute("data-valor") || "";
      const candidates = [prependNum, id, dataValorAttr];
      const digits = candidates
        .map((t) => (t || "").match(/\d+/))
        .find(Boolean);
      const codigo = digits ? Number(digits[0]) : NaN;
      let valor = "";
      if (input) {
        if (input.tagName === "DIV")
          valor = (input.textContent || "").replace(/\s+/g, " ").trim();
        else
          valor = ((input.value ?? input.getAttribute("value")) || "")
            .toString()
            .trim();
      }
      const dataSignoAttr = node.getAttribute("data-signo") || "";
      const signEl = node.querySelector(
        ".f22label-signo .ng-binding, .f22label-signo, .sign"
      );
      const signo = (dataSignoAttr || signEl?.textContent || "")
        .replace(/\s+/g, " ")
        .trim();
      addRow(codigo, valor, signo);
    }

    // General inputs/groups
    const groups = Array.from(
      document.querySelectorAll(".input-group.input-group-sm, .input-group")
    );
    for (const group of groups) {
      if (!isAfterBase(group)) continue;
      const input = group.querySelector(
        'input[name="input-f22"], input[id^="COD_"], input[ng-model*="cod"], input[data-ng-model*="cod"], input[id], input, textarea, div[ng-if*="tipoCod"][ng-if*="text"]'
      );
      const prependEl = group.querySelector(
        ".input-group-prepend .input-group-text, .input-group-addon.input-group-num"
      );
      const appendEl = group.querySelector(
        ".input-group-append .input-group-text, .f22label-signo .ng-binding"
      );
      const labelEl =
        input && input.id
          ? group.querySelector(`label[for="${input.id}"]`) ||
            document.querySelector(`label[for="${input.id}"]`)
          : null;
      const ngModel =
        input?.getAttribute("ng-model") ||
        input?.getAttribute("data-ng-model") ||
        "";
      const candidates = [
        (prependEl?.textContent || "").replace(/\s+/g, " ").trim(),
        input?.id || "",
        (labelEl?.textContent || "").replace(/\s+/g, " ").trim(),
        ngModel,
      ];
      const digits = candidates
        .map((t) => (t || "").match(/\d+/))
        .find(Boolean);
      const codigo = digits ? Number(digits[0]) : NaN;
      const valor =
        input && input.tagName === "DIV"
          ? (input.textContent || "").replace(/\s+/g, " ").trim()
          : ((input?.value ?? input?.getAttribute("value")) || "")
              .toString()
              .trim();
      let signo = "";
      if (appendEl?.textContent) {
        signo = appendEl.textContent.replace(/\s+/g, " ").trim();
      } else {
        const texts = Array.from(
          group.querySelectorAll(".input-group-text, .sign")
        ).map((el) => (el.textContent || "").replace(/\s+/g, " ").trim());
        const maybe = texts.find((t) => /^[+-]$|^-$|^\+$/.test(t));
        signo = maybe || "";
      }
      addRow(codigo, valor, signo);
    }

    // Fallback: scan any input with id/value indicating code (older layouts)
    if (data.length === 0) {
      const inputs = Array.from(
        document.querySelectorAll(
          'input[name="input-f22"], input[id^="COD_"], input[ng-model*="cod"], input[data-ng-model*="cod"], input[id*="cod"]'
        )
      );
      for (const input of inputs) {
        if (!isAfterBase(input)) continue;
        const ngModel =
          input.getAttribute("ng-model") ||
          input.getAttribute("data-ng-model") ||
          "";
        const candidates = [input.id || "", ngModel];
        const digits = candidates
          .map((t) => (t || "").match(/\d+/))
          .find(Boolean);
        const codigo = digits ? Number(digits[0]) : NaN;
        const valor = ((input.value ?? input.getAttribute("value")) || "")
          .toString()
          .trim();
        let signo = "";
        const group =
          input.closest(".input-group") ||
          input.closest(".form-group") ||
          input.parentElement;
        const appendEl = group?.querySelector(
          ".input-group-append .input-group-text, .f22label-signo .ng-binding"
        );
        if (appendEl?.textContent) {
          signo = appendEl.textContent.replace(/\s+/g, " ").trim();
        }
        addRow(codigo, valor, signo);
      }
    }

    return { data };
  });
}

async function getF22(page, { rut, pass, periodo }) {
  if (rut && pass) {
    await loginSII(page, rut, pass);
  }

  const years = Array.isArray(periodo) ? periodo : [];
  const result = {};

  for (const y of years) {
    await page.goto("https://www4.sii.cl/consultaestadof22ui/#!/default");

    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(500);

    await selectYear(page, y);
    await page.getByRole("button", { name: /Consultar/i }).click();

    await page.locator("#SituacionActual").waitFor({ state: "visible" });
    const detalle = await page.locator("#SituacionActual").innerText();

    const tabHist = page.locator(
      '.nav-tabs a[href="#Historial"], .nav-tabs a:has-text("Historial")'
    );
    if (await tabHist.count()) await tabHist.first().click();
    const histTables = page.locator(
      "table.table.table-f22.table-striped.table-bordered.table-hover"
    );
    await histTables
      .first()
      .waitFor({ state: "attached", timeout: 8000 })
      .catch(() => {});
    const historial = await extractHistorial(page);

    await page.getByText("Formulario 22", { exact: true }).click();

    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(500);

    await page
      .waitForSelector('#form22, #f22Data, form[name*="f22"], .f22-container', {
        timeout: 15000,
      })
      .catch(() => {});
    await page
      .waitForFunction(
        () => {
          const sel =
            'f22code, input[name="input-f22"], input[id^="COD_"], input[ng-model*="cod"], input[data-ng-model*="cod"], .input-group .input-group-prepend .input-group-text';
          return document.querySelectorAll(sel).length > 0;
        },
        { timeout: 20000 }
      )
      .catch(() => {});
    const formulario = await extractFormulario(page);

    console.log(`[GET F22] ${rut} procesado el año ${y}`);
    result[String(y)] = { detalle, historial, formulario };
  }

  return result;
}

export default getF22;
