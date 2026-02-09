import { createBaseLayout } from "./BaseLayout.js";
import { createHeader } from "./components/Header.js";
import { createFooter } from "./components/Footer.js";
import { createReceiptBody } from "./components/ReceiptBody.js";

const createReceiptEmail = (props) => {
  const header = createHeader({
    logoSrc: props.header.logo,
    backgroundColor: props.header.backgroundColor,
  });

  const body = createReceiptBody({
    items: props.items,
    totals: props.totals,
    observation: props.observation,
    header: props.header,
  });

  const footer = createFooter();

  const emailContent = `
    ${header}
    ${body}
    ${footer}
  `;

  return createBaseLayout({
    title: "Recibo de Compra",
    body: emailContent,
  });
};

export { createReceiptEmail };
