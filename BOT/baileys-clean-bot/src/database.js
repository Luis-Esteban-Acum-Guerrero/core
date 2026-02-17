import mysql from 'mysql2/promise'

export const db = await mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'Gafas1989',      
  database: 'ia_whatsapp',
  waitForConnections: true,
  connectionLimit: 10
})