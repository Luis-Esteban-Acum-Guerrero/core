import pool from "./db.js";

export async function createTables() {
  const sql = `CREATE TABLE IF NOT EXISTS rcv (
    id INT AUTO_INCREMENT PRIMARY KEY,
    tipoMov INT NOT NULL,
    tipoDoc INT NOT NULL,
    rut VARCHAR(20) NOT NULL,
    razonSocial VARCHAR(255) NULL,
    folio BIGINT NOT NULL,
    fechaDoc DATETIME NULL,
    fechaRecepcion DATETIME NULL,
    fechaAcuse DATETIME NULL,
    fechaReclamo DATETIME NULL,
    montoExento BIGINT NULL,
    montoNeto BIGINT NULL,
    montoIVA BIGINT NULL,
    montoTotal BIGINT NULL,
    otroImpuestoCod INT NULL,
    otroImpuestoValor BIGINT NULL,
    otroImpuestoTasa INT NULL,
    idEmpresa VARCHAR(64) NULL,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY uniq_rcv (tipoMov, tipoDoc, folio, rut)
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`;
  await pool.query(sql);
}
