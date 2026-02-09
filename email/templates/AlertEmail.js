import { createBaseLayout } from "./BaseLayout.js";
import { createHeader } from "./components/Header.js";
import { createFooter } from "./components/Footer.js";

const createAlertBody = ({ title, message }) => {
  return `
    <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #ffffff; color:#555555">
      <tr>
        <td style="padding: 20px 30px;">
          <h1 style="font-size: 24px; font-weight: bold; margin: 0 0 20px; color: #333333;">${title}</h1>
          <p style="margin: 0;">${message}</p>
        </td>
      </tr>
    </table>
  `;
};

const createAlertEmail = (props) => {
  const header = createHeader({
    logoSrc: props.header.logo,
    backgroundColor: "#ffc107", // Amarillo para alerta
  });
  const body = createAlertBody(props);
  const footer = createFooter();

  return createBaseLayout({
    title: props.title,
    body: header + body + footer,
  });
};

export { createAlertEmail };
