const createBaseLayout = ({ title, body }) => {
  return `
    <!DOCTYPE html>
  <html lang="es">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;700&display=swap" rel="stylesheet">
    <style>
      body { margin: 0; padding: 0; background-color: #f4f4f4; }
      table { border-collapse: collapse; }
      p, h1 { font-family: 'Inter', sans-serif; }
      
      .tofooter {
        width: 100%;
        height: 30px;
        background-color: #f8f8f8;
        background-image: 
          linear-gradient(135deg, #ffffff 12px, transparent 12px),
          linear-gradient(225deg, #ffffff 12px, transparent 12px);
        background-size: 30px 30px;
        background-position: left top;
        background-repeat: repeat-x;
        display: block;
      }

    </style>
  </head>
  <body>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #f8f8f8;">
      <tr>
        <td align="center" style="padding: 20px 0;">
          <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="background-color: #f8f8f8; margin: 0 auto;">
            
            <!--[if mso | IE]>
            <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="600" align="center" style="width:600px;">
              <tr>
                <td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;">
            <![endif]-->

            <div style="margin:0px auto;max-width:600px;background:#f8f8f8;">
              <table role="presentation" cellpadding="0" cellspacing="0" style="font-size:0px;width:100%;background:#f8f8f8;" align="center" border="0">
                <tbody>
                  ${body}
                </tbody>
              </table>
            </div>
            
            <!--[if mso | IE]>
                </td>
              </tr>
            </table>
            <![endif]-->
            
          </td>
        </tr>
      </table>
    </div>
  </body>
</html>
  `;
};

export { createBaseLayout };
