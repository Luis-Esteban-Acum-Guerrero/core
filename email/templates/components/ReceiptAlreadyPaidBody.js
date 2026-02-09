const createReceiptAlreadyPaidBody = ({
  userName,
  receiptNumber,
  paymentDate,
  amount,
  paymentMethod,
}) => {
  return `
    <tr>
      <td style="background-color: #ffffff; padding: 40px 30px;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
          <tr>
            <td>
              <h1 style="margin: 0 0 20px; font-family: 'Inter', sans-serif; font-size: 24px; color: #333333;">Confirmación de Pago</h1>
              <p style="margin: 0 0 20px; font-family: 'Inter', sans-serif; font-size: 16px; color: #555555;">Hola ${userName},</p>
              <p style="margin: 0 0 30px; font-family: 'Inter', sans-serif; font-size: 16px; color: #555555;">Hemos validado tu pago. Aquí tienes los detalles relacionados a tu transacción.</p>
              
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse: collapse;">
                <tr>
                  <th style="padding: 10px; border: 1px solid #dddddd; text-align: left; background-color: #f8f9fa; font-family: 'Inter', sans-serif; font-size: 14px;">Recibo N°</th>
                  <td style="padding: 10px; border: 1px solid #dddddd; text-align: left; font-family: 'Inter', sans-serif; font-size: 14px;">${receiptNumber}</td>
                </tr>
                <tr>
                  <th style="padding: 10px; border: 1px solid #dddddd; text-align: left; background-color: #f8f9fa; font-family: 'Inter', sans-serif; font-size: 14px;">Fecha de Pago</th>
                  <td style="padding: 10px; border: 1px solid #dddddd; text-align: left; font-family: 'Inter', sans-serif; font-size: 14px;">${paymentDate}</td>
                </tr>
                <tr>
                  <th style="padding: 10px; border: 1px solid #dddddd; text-align: left; background-color: #f8f9fa; font-family: 'Inter', sans-serif; font-size: 14px;">Monto</th>
                  <td style="padding: 10px; border: 1px solid #dddddd; text-align: left; font-family: 'Inter', sans-serif; font-size: 14px;">${amount}</td>
                </tr>
                <tr>
                  <th style="padding: 10px; border: 1px solid #dddddd; text-align: left; background-color: #f8f9fa; font-family: 'Inter', sans-serif; font-size: 14px;">Método de Pago</th>
                  <td style="padding: 10px; border: 1px solid #dddddd; text-align: left; font-family: 'Inter', sans-serif; font-size: 14px;">${paymentMethod}</td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  `;
};

export { createReceiptAlreadyPaidBody };
