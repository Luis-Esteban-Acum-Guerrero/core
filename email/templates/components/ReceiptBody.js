const createItemRow = (item) => `
  <tr>
    <td style="padding: 15px 10px; border-bottom: 1px solid #eeeeee;">
      ${
        item.img
          ? `<img src="${item.img}" style="width: 30px; height: 30px; filter: grayscale(50%);">`
          : ""
      }
    </td>
    <td style="padding: 15px 0; border-bottom: 1px solid #eeeeee;">
      <p style="margin: 0; font-family: 'Inter', sans-serif; font-size: 16px; color: #333333;">
        ${item.name}
      </p>
      <span style="font-size: 14px; color: #777777;">${item.description}</span>
    </td>
    <td style="padding: 15px 0; border-bottom: 1px solid #eeeeee; text-align: right;">
      <p style="margin: 0; font-family: 'Inter', sans-serif; font-size: 16px; color: #333333;">
        $${item.price}
      </p>
    </td>
  </tr>
`;

const createReceiptBody = ({ items, totals, observation, header }) => {
  return `
    <tr>
      <td style="background-color: #ffffff; padding: 10px 30px;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
          <!-- Saludo -->
          <tr>
            <td style="padding: 20px 0;">
              <h1 style="margin: 0; font-family: 'Inter', sans-serif; font-size: 24px; color: #333333;">
                Hola <i>${
                  header.contacto
                }</i>,<br>Gracias por confiar en nosotros.
              </h1>
              <p style="margin: 10px 0 0 0; font-family: 'Inter', sans-serif; font-size: 16px; color: #555555;">
                Por orden de <b>${
                  header.from
                }</b>, Hemos emitido un documento a <b>${
                  header.razonSocial
                }</b>. Aquí están los detalles y el documento adjunto:
              </p>

              ${
                header
                  ? `<p style="margin: 20px 0 0 0; font-family: 'Inter', sans-serif; font-size: 14px; color: #555555;">
                      <b style=" font-size: 16px;">${header.tipoDocumento} #${header.numeroFactura}</b><br>
                      realizada el ${header.fechaFacturacion}<br>
                    </p>`
                  : ""
              }

              ${
                observation
                  ? `<p style="margin: 20px 0 0 0; font-family: 'Inter', sans-serif; font-size: 14px; color: #555555;"><i>${observation}</i></p>`
                  : ""
              }
            </td>
          </tr>

          <!-- Items -->
          <tr>
            <td>
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                <thead>
                  <tr>
                    <th></th>
                    <th style="text-align: left; font-family: 'Inter', sans-serif; font-size: 14px; color: #999999; text-transform: uppercase;">
                      Descripción
                    </th>
                    <th style="text-align: right; font-family: 'Inter', sans-serif; font-size: 14px; color: #999999; text-transform: uppercase;">
                      Valor
                    </th>
                  </tr>
                </thead>
                <tbody>
                  ${items.map(createItemRow).join("")}
                </tbody>
              </table>
            </td>
          </tr>

          <!-- Totales -->
          <tr>
            <td style="padding: 20px 0;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="right">
                    <table role="presentation" cellpadding="0" cellspacing="0" style="width: 250px;">
                      <tr>
                        <td style="padding: 5px 0; font-family: 'Inter', sans-serif; font-size: 16px; color: #555555;">Subtotal:</td>
                        <td style="padding: 5px 0; font-family: 'Inter', sans-serif; font-size: 16px; color: #333333; text-align: right;">$${
                          totals.subtotal
                        }</td>
                      </tr>
                      <tr>
                        <td style="padding: 5px 0; font-family: 'Inter', sans-serif; font-size: 16px; color: #555555;">Impuestos:</td>
                        <td style="padding: 5px 0; font-family: 'Inter', sans-serif; font-size: 16px; color: #333333; text-align: right;">$${
                          totals.tax
                        }</td>
                      </tr>
                      <tr>
                        <td style="padding: 10px 0; font-family: 'Inter', sans-serif; font-size: 18px; font-weight: bold; color: #333333; border-top: 1px solid #eeeeee;">Total:</td>
                        <td style="padding: 10px 0; font-family: 'Inter', sans-serif; font-size: 18px; font-weight: bold; color: #333333; text-align: right; border-top: 1px solid #eeeeee;">$${
                          totals.total
                        }</td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
          
          ${
            header.pago
              ? `
          <p style="font-family: 'Inter', sans-serif; font-size: 14px; color: #555555;">
              <b style="font-size: 16px;">Datos de ${header.pago.metodo}</b><br>
              <b>Cuenta:</b> ${header.pago.tipoCuenta}<br>
              <b>Número:</b> ${header.pago.cuenta}<br>
              <b>Banco:</b> ${header.pago.banco}<br>
              <b>Email:</b> ${header.pago.email}
          </p>
          `
              : ""
          }

          
      </td>
    </tr>
  `;
};

export { createReceiptBody };
