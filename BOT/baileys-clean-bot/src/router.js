import { saludoFlow } from './flows/saludo.js'
import { informacionFlow } from './flows/informacion.js'
import { consultaFlow } from './flows/consulta.js'

export const router = async (sock, msg, text) => {

  // ===============================//
  //       COMANDOS BASICOS         //
  // ===============================//

  if (await consultaFlow(sock, msg, text)) return

  if (['hola', 'hi', 'hello','buenos dias', 'buenas tardes', 'alo', 'bot' ].includes(text)) {
    return  saludoFlow(sock, msg)
  }

  if (await ['info', 'informacion', 'information', 'uso'].includes(text)) {
    return informacionFlow(sock, msg)
  }

  await sock.sendMessage(msg.key.remoteJid, {
    text: 'Si no estas en una consulta, utiliza *SOLO* palabras clave como *hola*, *info* o *consulta*.'
  })
  
}