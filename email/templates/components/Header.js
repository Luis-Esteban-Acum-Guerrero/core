const createHeader = ({ logoSrc, backgroundColor = "#f8f8f8" }) => {
  return `
    <tr style="background-color: ${backgroundColor};">
      <td style="background-color: #f8f8f8; padding: 0 50px 20px 50px; border-bottom: 10px solid ${backgroundColor};">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
          <tr>
            <td align="left">
              <table role="presentation" cellpadding="0" cellspacing="0" style="margin-right: auto;">
                <tr>
                  <td width="130" style="width: 130px;">
                    <div style="font-size: 0px;  padding:20px; ">
                      <img
                        style="display: block; border: 0; height: auto; width: 100%; margin: 0; max-width: 100%;"
                        width="90"
                        alt="Logo"
                        src="${logoSrc}"
                      />
                    </div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  `;
};

export { createHeader };
