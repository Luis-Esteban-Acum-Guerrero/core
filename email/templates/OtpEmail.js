import { createBaseLayout } from "./BaseLayout.js";
import { createHeader } from "./components/Header.js";
import { createFooter } from "./components/Footer.js";
import { createOtpBody } from "./components/OtpBody.js";

const createOtpEmail = (props) => {
  const header = createHeader({
    logoSrc: props.header.logo,
    backgroundColor: props.header.backgroundColor,
  });
  const body = createOtpBody(props);
  const footer = createFooter();

  return createBaseLayout({
    title: "Tu Código de Verificación",
    body: header + body + footer,
  });
};

export { createOtpEmail };
