import express from 'express'
import { db } from './database.js'

const app = express()
const PORT = 3000

// Ruta para obtener consultas
app.get('/api/consultas', async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT id, nombre, numero, fecha_creacion
      FROM consultas
      ORDER BY id DESC
    `)

    res.json(rows)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Error al obtener consultas' })
  }
})

app.get('/api/ticket/:id', async (req, res) => { 
  try {
    const { id } = req.params

    console.log("📥 Ticket solicitado ID:", id)

    const [rows] = await db.query(`
      SELECT mensaje, archivo, fecha
      FROM ticket
      WHERE consulta_id = ?
      ORDER BY id ASC
    `, [id])

    console.log("📤 Filas encontradas:", rows.length)

    res.json(rows)
  } catch (error) {
  console.error("❌ ERROR SQL REAL:", error)
  res.status(500).json({ 
    error: 'Error al obtener ticket',
    detalle: error.message
  })
}
})

// Servir la web estática
app.use(express.static('sitios_web'))

app.use('/uploads', express.static('src/uploads'))

app.listen(PORT, () => {
  console.log(`Web disponible en http://localhost:${PORT}`)
})

app.delete('/api/consultas/:id', async (req, res) => {
  try {
    const { id } = req.params

    // 🧹 Borrar la consulta (los tickets se borran solos por ON DELETE CASCADE)
    await db.query('DELETE FROM consultas WHERE id = ?', [id])

    res.json({ success: true })
  } catch (error) {
    console.error('Error al eliminar consulta:', error)
    res.status(500).json({ error: 'Error al eliminar la consulta' })
  }
})
