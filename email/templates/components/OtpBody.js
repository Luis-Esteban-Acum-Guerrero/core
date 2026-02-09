const createOtpBody = ({ otpCode }) => {
  return `
    <tr>
      <td style="background-color: #ffffff; padding: 40px 30px;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
          <tr>
            <td style="text-align: center;">
              <h1 style="margin: 0 0 20px; font-family: 'Inter', sans-serif; font-size: 24px; color: #333333;">Tu Código de Verificación</h1>
              <p style="margin: 0 0 30px; font-family: 'Inter', sans-serif; font-size: 16px; color: #555555;">Has solicitado un codigo único. Usa el siguiente código para completar el proceso. Este código es válido por 5 minutos.</p>
              <div style="font-family: 'Inter', sans-serif; font-size: 36px; font-weight: bold; color: #333333; letter-spacing: 10px; margin: 20px 0; padding: 10px; border: 1px dashed #cccccc; display: inline-block;">
                ${otpCode}
              </div>
              <p style="margin: 30px 0 0; font-family: 'Inter', sans-serif; font-size: 14px; color: #777777;">Si no solicitaste este código, puedes ignorar este correo.</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  `;
};

export { createOtpBody };
