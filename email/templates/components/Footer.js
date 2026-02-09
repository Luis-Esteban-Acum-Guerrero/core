const createFooter = () => {
  const currentYear = new Date().getFullYear();
  return `
  <tr>
  <td class="tofooter"></td>
  </tr>
    <tr>
    
      <td style="padding: 40px 50px; background-color: #f8f8f8 ;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
          <tr>
            <td align="center" style="text-align: center;">
              <img src="https://jelp.cl/logos/core-logo.png" alt="Logo" style="width: 100px; height: auto; margin-bottom: 20px;">
              <p style="margin: 0; font-family: 'Inter', sans-serif; font-size: 12px; color: #999999;">
                &copy; ${currentYear} c0re, un sistema de creceideas.
              </p>  
              <p style="margin: 10px 0 0 0; font-family: 'Inter', sans-serif; font-size: 11px; color: #999999;">
                <a href="#" style="color: #999999; text-decoration: underline;">Cancelar suscripción</a>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  `;
};

export { createFooter };
