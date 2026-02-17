import 'dotenv/config'
import pino from 'pino'
import baileys from 'baileys'
import qrcode from 'qrcode-terminal'
import { router } from './router.js'

const {
  default: makeWASocket,
  useMultiFileAuthState,
  DisconnectReason,
  fetchLatestBaileysVersion
} = baileys

console.log("Iniciando bot...")

const startBot = async () => {
  const { state, saveCreds } = await useMultiFileAuthState('./bot_sessions')
  const { version } = await fetchLatestBaileysVersion()

  const sock = makeWASocket({
    auth: state,
    version,
    logger: pino({ level: 'silent' }),
    browser: ['Ubuntu', 'Chrome', '22.04.4'],
    printQRInTerminal: true
  })

  sock.ev.on('creds.update', saveCreds)

  sock.ev.on('connection.update', ({ connection, qr, lastDisconnect }) => {
    if (qr) {
      console.log('\nEscanea este QR con WhatsApp → Dispositivos vinculados\n')
      qrcode.generate(qr, { small: true })
    }

    if (connection === 'close') {
      const reason = lastDisconnect?.error?.output?.statusCode

      if (reason === DisconnectReason.loggedOut) {
        console.log('Sesión cerrada. Borra bot_sessions y vuelve a vincular.')
        return
      }

      console.log('Reconectando...')
      startBot()
    }

    if (connection === 'open') {
      console.log('\nBOT CONECTADO A WHATSAPP\n')
    }
  })

  sock.ev.on('messages.upsert', async ({ messages, type }) => {
  try {
    if (type !== 'notify') return

    const msg = messages[0]
    if (!msg.message) return
    if (msg.key.remoteJid.endsWith('@g.us')) return
    if (!sock.user) return

    const text =
      msg.message.conversation ||
      msg.message.extendedTextMessage?.text ||
      ''

    //muestra los textos que llegan al router para verificar que se están recibiendo correctamente.
    console.log('Texto:', text)

    await router(sock, msg, text.toLowerCase())

  } catch (err) {
    console.error('Error manejado en messages.upsert:', err)
  }
})
}

console.log("Creando conexión Baileys...")
startBot()