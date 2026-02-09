const createNotificationBody = ({ title, message }) => {
  return `
    <tr>
      <td style="background-color: #ffffff; padding: 40px 30px;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
          <tr>
            <td style="text-align: center;">
              <h1 style="margin: 0 0 20px; font-family: 'Inter', sans-serif; font-size: 24px; color: #333333;">${title}</h1>
              <p style="margin: 0; font-family: 'Inter', sans-serif; font-size: 16px; line-height: 1.6; color: #555555;">${message}</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  `;
};

export { createNotificationBody };