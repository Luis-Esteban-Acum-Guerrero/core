import { createBaseLayout } from "./BaseLayout.js";
import { createHeader } from "./components/Header.js";
import { createFooter } from "./components/Footer.js";
import { createNotificationBody } from "./components/NotificationBody.js";

const createNotificationEmail = (props) => {
  const typeStyles = {
    info: "#007bff",
    alerta: "#ffc107",
    error: "#dc3545",
  };
  const headerColor = typeStyles[props.notificationType] || typeStyles.info;

  const header = createHeader({
    logoSrc: props.header.logo,
    backgroundColor: headerColor,
  });
  const body = createNotificationBody(props);
  const footer = createFooter();

  return createBaseLayout({
    title: props.title,
    body: header + body + footer,
  });
};

export { createNotificationEmail };
