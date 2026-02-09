import { createBaseLayout } from "./BaseLayout.js";
import { createHeader } from "./components/Header.js";
import { createFooter } from "./components/Footer.js";
import { createReceiptAlreadyPaidBody } from "./components/ReceiptAlreadyPaidBody.js";

const createReceiptAlreadyPaidEmail = (props) => {
  const header = createHeader({
    logoSrc: props.header.logo,
    backgroundColor: "#28a745",
  });
  const body = createReceiptAlreadyPaidBody(props);
  const footer = createFooter();

  return createBaseLayout({
    title: "Confirmación de Pago",
    body: header + body + footer,
  });
};

export { createReceiptAlreadyPaidEmail };
