export const saludoFlow = async (sock, msg) => {
  
  const name = msg.pushName || 'usuario'

  await sock.sendMessage(msg.key.remoteJid, {
    text: `¡Bienvenido ${name}! Este es el bot de soporte. de usuario. \n\nSi es tu primera
     vez aquí, escribe *info* para conocer las funcionalidades del bot.`
  })
}