export const informacionFlow = async (sock, msg) => {

  await sock.sendMessage(msg.key.remoteJid, {
    text: `el bot es simple. Para iniciar una consulta solo tienes que escribir la palabra clave *CONSULTA* 
    y a partir de ese momento todos los mensajes que envíes se guardarán en un ticket para que el equipo de
     soporte pueda revisarlo más tarde.\n\nTambien puedes enviar imágenes o archivos que se guardarán junto
      con tus mensajes para complementar el contenido de tu consulta.  \n\nCuando quieras finalizar la
       consulta, solo escribe *FIN* y el ticket se cerrará automáticamente.`
    
  })
  sock.sendMessage(msg.key.remoteJid, {
    text: 'Una vez hallas terminado la consulta, el bot quedará en espera dandote el *numero del ticket* y te notificará automaticamente cuando un operador humano responda a tu consulta.'
  })
}