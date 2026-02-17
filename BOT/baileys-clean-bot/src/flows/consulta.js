import fs from 'fs'
import path from 'path'
import { downloadMediaMessage } from 'baileys'
import { consultasActivas } from '../state.js'
import { db } from '../database.js'

export const consultaFlow = async (sock, msg, text) => {
  const jid = msg.key.remoteJid
  const numero = jid.split('@')[0]
  const nombre = msg.pushName || 'Sin nombre'
  console.log(msg)

  //
  // ================= INICIAR CONSULTA =================
  //
  if (text === 'consulta') {
    const [result] = await db.query(
      'INSERT INTO consultas (numero, nombre) VALUES (?, ?)',
      [numero, nombre]
    )

    consultasActivas.set(jid, result.insertId)

    await sock.sendMessage(jid, {
      text:
        '*Consulta iniciada.*\n\n' +
        'Desde ahora los mensajes que envíes se guardarán en un ticket.\n' +
        'Escribe *FIN* para finalizar la consulta.\n\n' +
        'También puedes enviar imágenes o archivos.'
    })

    return true
  }

  //===============================================//
  //              FINALIZAR CONSULTA               //
  //===============================================//

  if (['fin', 'finalizar', 'terminar'].includes(text)) {
  const consultaId = consultasActivas.get(jid)

  // No hay consulta activa
  if (!consultaId) {
    await sock.sendMessage(jid, {
      text: 'No tienes una consulta activa.\n\nEscribe *consulta* para iniciar una.'
    })
    return true
  }

  // Cerrar consulta
  consultasActivas.delete(jid)

  await sock.sendMessage(jid, {
    text:
      'La consulta ha finalizado.\n\n' +
      'Un operador revisará tu caso pronto.\n\n' +
      `Tu número es *TICKET#${consultaId}*`
  })

  return true
}


  //===============================================//
  //       GUARDAR SOLO SI HAY CONSULTA            //
  //===============================================//

  const consultaId = consultasActivas.get(jid)
  if (!consultaId) return false  

  let fileName = null

  // ===== IMAGEN =====
  if (msg.message?.imageMessage) {
    const uploadDir = path.join(process.cwd(), 'src/uploads')

    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true })
    }

    const buffer = await downloadMediaMessage(
      msg,
      'buffer',
      {},
      { logger: console }
    )

    fileName = `img_${Date.now()}.jpg`
    const filePath = path.join(uploadDir, fileName)

    fs.writeFileSync(filePath, buffer)
  }

  //===============================================//
  //                GUARDAR EN DB                  //
  //===============================================//

  await db.query(
    'INSERT INTO ticket (consulta_id, mensaje, archivo) VALUES (?, ?, ?)',
    [consultaId, text?.trim() || '', fileName]
  )

  await sock.sendMessage(jid, {
    text: 'Mensaje recibido correctamente.'
  })

  return true
}
