const fs = require("fs");
const PDFDocument = require("pdfkit");
const { dataArray, ClientNamesR3T, newArray } = require("./usersDebts");

function createInvoice(invoice, path) {
  let doc = new PDFDocument({ size: "A4", margin: 50 });
  // dataArray.length
  for (let index = 0; index < 2; index++) {
    let Clients = newArray.filter(
      (el) => el.clientid === dataArray[index][0].clientid
    );
    let DeudaTotalxClient = Clients.reduce(
      (a, b) => parseFloat(a) + parseFloat(b.amount_unpaid),
      0
    );

    if (index !== 0) {
      doc.addPage();
    }
    generateHeader(doc);
    generateCustomerInformation(
      doc,
      invoice,
      ClientNamesR3T[index],
      dataArray[index],
      DeudaTotalxClient
    );
    generateInvoiceTable(doc, invoice, index);
    generateFooter(doc);

    generateCustomerInformationUnderTable(doc);
  }

  doc.end();
  doc.pipe(fs.createWriteStream(path));
}

function generateHeader(doc) {
  doc.image("img_header.png", 50, 45, { width: 550 }).moveDown();
}

function generateCustomerInformation(
  doc,
  invoice,
  ClientData,
  dataArray,
  DeudaTotalxClient
) {
  doc.fillColor("#000000").fontSize(11).text(formatDate(), 50, 130);
  doc.fillColor("#000000").fontSize(11).text(ClientData[0], 50, 150);
  doc
    .fillColor("#000000")
    .fontSize(11)
    .text(
      `Dirección Postal: ${ClientData[1]}, Ciudad:${ClientData[2]}, Estado:${ClientData[3]}, Zip: ${ClientData[4]}`,
      50,
      170
    );
  doc.fillColor("#000000").fontSize(11).text("Estimado cliente,", 50, 190);
  doc
    .fillColor("#000000")
    .fontSize(11)
    .text(
      `Nuestro departamento de Finanzas le informa, que su cuenta se encuentra en un atraso de más de 30 días. Su balance atrasado es de $${DeudaTotalxClient.toFixed(
        2
      )}`,
      50,
      205
    )
    .moveDown();
  doc
    .fillColor("#000000")
    .fontSize(11)
    .text(
      "En varias ocasiones hemos tratado de comunicarnos con usted, pero el esfuerzo ha sido infructuoso. Hoy en día no hemos recibido pagos o acuerdos de su parte.  Por tanto, se solicita que pueda hacer las gestiones de pago del balance en atraso antes mencionado, para en o antes del día 21 del presente mes. De no recibir el pago para esta fecha sus servicios permanecerán desconectados."
    );

  // generateHr(doc, 185);

  const customerInformationTop = 200;
  // doc
  //   .fontSize(10)
  //   .text("Invoice Number:", 50, customerInformationTop)
  //   .font("Helvetica-Bold")
  //   .text(invoice.invoice_nr, 150, customerInformationTop)
  //   .font("Helvetica")
  //   .text("Invoice Date:", 50, customerInformationTop + 15)
  //   .text(formatDate(new Date()), 150, customerInformationTop + 15)
  //   .text("Balance Due:", 50, customerInformationTop + 30)
  //   .text(
  //     formatCurrency(invoice.subtotal - invoice.paid),
  //     150,
  //     customerInformationTop + 30
  //   )

  //   .font("Helvetica-Bold")
  //   .text(invoice.shipping.name, 300, customerInformationTop)
  //   .font("Helvetica")
  //   .text(invoice.shipping.address, 300, customerInformationTop + 15)
  //   .text(
  //     invoice.shipping.city +
  //       ", " +
  //       invoice.shipping.state +
  //       ", " +
  //       invoice.shipping.country,
  //     300,
  //     customerInformationTop + 30
  //   )
  // .moveDown();

  // generateHr(doc, 252);
}

function generateInvoiceTable(doc, invoice, index1) {
  let i = 0;
  const invoiceTableTop = 330;

  doc.font("Helvetica-Bold");
  generateTableRow(
    doc,
    invoiceTableTop,
    "Invoice Number",
    "Date Sent",
    "Amount",
    "Amount Outstanding"
  );
  generateHr(doc, invoiceTableTop + 20);
  doc.font("Helvetica");

  dataArray[index1].forEach((element, index2) => {
    const { Invoice, dateSent, amount_unpaid } = element;
    const position = invoiceTableTop + (i + 1) * 30;
    generateTableRow(
      doc,
      position,
      Invoice,
      dateSent,
      amount_unpaid,
      amount_unpaid
    );
    generateHr(doc, position + 20);
    i++;
  });

  console.log(i);
  // for (i = 0; i < invoice.items.length; i++) {
  //   const item = invoice.items[i];
  //   const position = invoiceTableTop + (i + 1) * 30;
  //   generateTableRow(
  //     doc,
  //     position,
  //     item.item,
  //     item.description,
  //     formatCurrency(item.amount / item.quantity),
  //     item.quantity,
  //     formatCurrency(item.amount)
  //   );

  // generateHr(doc, position + 20);
  // }

  // const subtotalPosition = invoiceTableTop + (i + 1) * 30;

  // const paidToDatePosition = subtotalPosition + 20;

  const duePosition = invoiceTableTop + (i + 1) * 30;
  doc.font("Helvetica-Bold");
  generateTableRow(
    doc,
    duePosition,
    "",
    "",
    "Balance Due",
    "",
    formatCurrency(invoice.subtotal - invoice.paid)
  );
  doc.font("Helvetica").moveDown().moveDown();
}

function generateCustomerInformationUnderTable(doc, invoice) {
  doc
    .fillColor("#000000")
    .fontSize(11)
    .text(
      "Si existe alguna razón por la cual no ha podido emitir el pago o desea efectuar el mismo, puede comunicarse al 787-655-1919, marcar la opción #3 (Facturación y Pagos), o enviar un email a Billing@osnetpr.com.",
      50
    )
    .moveDown();
  doc
    .fillColor("#000000")
    .fontSize(11)
    .text(
      "Si ya envió el pago, le pedimos disculpas por la molestia y le agradecemos su patrocinio.",
      50
    )
    .moveDown();
  doc
    .fillColor("#000000")
    .fontSize(11)
    .text("OSNET Wireless Corporation", 50)
    .moveDown();

  // generateHr(doc, 185);
}

function generateFooter(doc) {
  doc.image("img_footer.png", 0, 702, { width: 600 });
}

function generateTableRow(
  doc,
  y,
  item,
  description,
  unitCost,
  // quantity,
  lineTotal
) {
  doc
    .fontSize(10)
    .text(item, 50, y)
    .text(description, 150, y)
    .text(unitCost, 280, y, { width: 90, align: "right" })
    // .text(quantity, 370, y, { width: 90, align: "right" })
    .text(lineTotal, 0, y, { with: 10, align: "right" });
}

function generateHr(doc, y) {
  doc.strokeColor("#aaaaaa").lineWidth(1).moveTo(50, y).lineTo(550, y).stroke();
}

function formatCurrency(cents) {
  return "$" + (cents / 100).toFixed(2);
}

function formatDate() {
  const day = new Date().getDate();
  const month = new Date().getMonth() + 1;
  const year = new Date().getFullYear();

  return day + "/" + month + "/" + year;
}
module.exports = { createInvoice };
