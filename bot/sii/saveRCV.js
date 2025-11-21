import pool from "../../utils/db.js";
import { createTables } from "../../utils/schema.js";

function toDateTime(v) {
  if (!v) return null;
  const m =
    /^([0-9]{2})\/([0-9]{2})\/([0-9]{4})(?:\s+([0-9]{2}):([0-9]{2}):([0-9]{2}))?$/.exec(
      v
    );
  if (!m) return null;
  const dd = m[1],
    mm = m[2],
    yyyy = m[3];
  const hh = m[4] || "00",
    mi = m[5] || "00",
    ss = m[6] || "00";
  return `${yyyy}-${mm}-${dd} ${hh}:${mi}:${ss}`;
}

async function saveRCV(data, idEmpresa) {
  await createTables();

  const items = Array.isArray(data)
    ? data
    : Array.isArray(data?.items)
    ? data.items
    : [data];

  const sql = `INSERT INTO rcv (
    tipoMov, tipoDoc, rut, razonSocial, folio, fechaDoc, fechaRecepcion, fechaAcuse, fechaReclamo,
    montoExento, montoNeto, montoIVA, montoTotal, otroImpuestoCod, otroImpuestoValor, otroImpuestoTasa,
    idEmpresa, createdAt, updatedAt
  ) VALUES (
    ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
  ) ON DUPLICATE KEY UPDATE
    razonSocial=VALUES(razonSocial),
    fechaDoc=VALUES(fechaDoc),
    fechaRecepcion=VALUES(fechaRecepcion),
    fechaAcuse=VALUES(fechaAcuse),
    fechaReclamo=VALUES(fechaReclamo),
    montoExento=VALUES(montoExento),
    montoNeto=VALUES(montoNeto),
    montoIVA=VALUES(montoIVA),
    montoTotal=VALUES(montoTotal),
    otroImpuestoCod=VALUES(otroImpuestoCod),
    otroImpuestoValor=VALUES(otroImpuestoValor),
    otroImpuestoTasa=VALUES(otroImpuestoTasa),
    idEmpresa=VALUES(idEmpresa),
    updatedAt=CURRENT_TIMESTAMP`;

  let inserted = 0;
  let updated = 0;

  for (const r of items) {
    const params = [
      r.tipoMov ?? null,
      r.tipoDoc ?? null,
      r.rut ?? null,
      r.razonSocial ?? null,
      r.folio ?? null,
      toDateTime(r.fechaDoc),
      toDateTime(r.fechaRecepcion),
      toDateTime(r.fechaAcuse),
      toDateTime(r.fechaReclamo),
      r.montoExento ?? 0,
      r.montoNeto ?? 0,
      r.montoIVA ?? 0,
      r.montoTotal ?? 0,
      r.otroImpuestoCod ?? null,
      r.otroImpuestoValor ?? null,
      r.otroImpuestoTasa ?? null,
      idEmpresa ?? null,
    ];
    const [res] = await pool.execute(sql, params);
    if (res.affectedRows === 1) inserted += 1;
    else if (res.affectedRows === 2) updated += 1;
  }
  console.log(
    `[DB] ${idEmpresa} > ${items.length} registros. C:${inserted} U:${updated}`
  );

  return { inserted, updated, processed: items.length };
}

export default saveRCV;
