import loginSII from "./login.js";

function normalizeLabel(s) {
  return (s || "").replace(/\s+/g, " ").replace(/:$/, "").trim();
}

async function extractSection(page, selector, options = {}) {
  const result = await page.evaluate(
    ({ sel, opts }) => {
      const norm = (t) => (t || "").replace(/\s+/g, " ").trim();
      const labelize = (t) => norm(t).replace(/:$/, "");
      const root = document.querySelector(sel);
      if (!root) return { headers: [], rows: [], kv: {} };
      let tbody = null;

      if (root.tagName === "TBODY") {
        tbody = root;
      } else if (root.tagName === "TABLE") {
        tbody = root.querySelector("tbody") || root;
      } else {
        const table = root.querySelector("table");
        tbody =
          (table && table.querySelector("tbody")) ||
          root.querySelector("tbody") ||
          root;
      }

      let headers = Array.isArray(opts.customHeaders)
        ? opts.customHeaders.map(norm)
        : [];
      const thead =
        root.tagName === "TABLE"
          ? root.querySelector("thead")
          : root.querySelector("thead") || null;
      if (!headers.length && thead) {
        const ths = Array.from(thead.querySelectorAll("th"));
        headers = ths
          .map((th) => norm(th.textContent))
          .filter((t) => t.length > 0);
      }
      if (!headers.length) {
        const firstThs = Array.from((tbody || root).querySelectorAll("tr th"));
        if (firstThs.length) {
          headers = firstThs
            .map((th) => norm(th.textContent))
            .filter((t) => t.length > 0);
        }
      }

      const trs = Array.from((tbody || root).querySelectorAll("tr"));
      const filteredTrs = trs.filter(
        (tr) =>
          tr.querySelectorAll("td").length > 0 ||
          tr.querySelectorAll("th").length > 0
      );

      const isLabelValue = filteredTrs.every((tr) => {
        const ths = tr.querySelectorAll("th").length;
        const tds = tr.querySelectorAll("td").length;
        return (ths === 1 && tds === 1) || (!ths && tds === 2);
      });

      const registros = [];
      filteredTrs.forEach((tr) => {
        const ths = Array.from(tr.querySelectorAll("th"));
        const tds = Array.from(tr.querySelectorAll("td"));
        const values = tds.map((td) => norm(td.textContent));

        if (isLabelValue || opts.preferLabelValue) {
          if (
            (ths.length === 1 && tds.length === 1) ||
            (ths.length === 0 && tds.length === 2)
          ) {
            const label = ths.length
              ? labelize(ths[0].textContent)
              : labelize(tds[0].textContent);
            const value = ths.length
              ? norm(tds[0].textContent)
              : norm(tds[1].textContent);
            const hasContent =
              (label && label.length > 0) || (value && value.length > 0);
            if (hasContent && label) registros.push({ [label]: value });
            return;
          }
        }

        if (headers.length && headers.length === values.length) {
          const obj = {};
          headers.forEach((h, i) => {
            obj[h] = values[i];
          });
          const hasAny = Object.values(obj).some((v) => v && v.length > 0);
          if (hasAny) registros.push(obj);
        } else {
          const hasAny = values.some((v) => v && v.length > 0);
          if (hasAny) registros.push(values);
        }
      });

      if (registros.length === 0)
        return { registros: [["No registra información"]] };
      return { registros };
    },
    { sel: selector, opts: options }
  );
  return result;
}

async function getInfoTributaria(page, creds = {}, schema = {}) {
  if (creds?.rut && creds?.pass) {
    await loginSII(page, creds.rut, creds.pass);
  }

  await page
    .getByRole("link", { name: "Datos personales y tributarios" })
    .click();
  await page.waitForSelector("#box_right", { state: "attached" });

  const direcciones = await extractSection(
    page,
    "#direccionesVigentes",
    schema.direcciones || {}
  );
  const telefonosCorreos = await extractSection(page, "#tablaDatosTelefonos", {
    preferLabelValue: true,
    ...(schema.telefonosCorreos || {}),
  });
  const actividadesEconomicas = await extractSection(
    page,
    "#tablaDatosActividad",
    schema.actividadesEconomicas || {
      customHeaders: [
        "Fecha constitución",
        "Fecha inicio actividades",
        "Término de giro",
      ],
    }
  );
  const representantesVigentes = await extractSection(
    page,
    "#tablaRepresentantes",
    schema.representantesVigentes || {
      customHeaders: ["Nombre", "Rut", "A partire de"],
    }
  );
  const representantesNoVigentes = await extractSection(
    page,
    "#tablaNoVigentes",
    schema.representantesNoVigentes || {
      customHeaders: ["Nombre", "Rut", "Fecha inicio", "Fecha término"],
    }
  );
  const sociosVigentes = await extractSection(
    page,
    "#tablaSociosVigentes",
    schema.sociosVigentes || {}
  );
  const sociosNoVigentes = await extractSection(
    page,
    "#tablaSociosNoVigentes",
    schema.sociosNoVigentes || {}
  );
  const actividadesBody = await extractSection(
    page,
    "#tblIdGiros",
    schema.actividadesBody || {}
  );
  const sociedadesContribuyente = await extractSection(
    page,
    "#idTableMiSoc",
    schema.sociedadesContribuyente || {}
  );
  const caracteristicasContribuyente = await extractSection(
    page,
    "#tablaAtributos",
    { preferLabelValue: true, ...(schema.caracteristicasContribuyente || {}) }
  );
  const documentosAutorizados = await extractSection(
    page,
    "#tblUltimosDoc",
    schema.documentosAutorizados || {}
  );
  const bienesRaices = await extractSection(
    page,
    "#tablaAvaluaciones",
    schema.bienesRaices || {}
  );

  return {
    direcciones,
    telefonosCorreos,
    actividadesEconomicas,
    representantesVigentes,
    representantesNoVigentes,
    sociosVigentes,
    sociosNoVigentes,
    actividadesBody,
    sociedadesContribuyente,
    caracteristicasContribuyente,
    documentosAutorizados,
    bienesRaices,
  };
}

export default getInfoTributaria;
