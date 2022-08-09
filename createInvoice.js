const fs = require("fs");
const PDFDocument = require("pdfkit");

function createInvoice(invoice, path) {
  let doc = new PDFDocument({ size: "A4", margin: 50 });
  generateHeader(doc);
  generateCustomerInformation(doc, invoice);
  generateInvoiceTable(doc, invoice);
  generateFooter(doc);
  generateCustomerInformationUnderTable(doc);

  doc.end();
  doc.pipe(fs.createWriteStream(path));
}

function generateHeader(doc) {
  doc.image("img_header.png", 50, 45, { width: 550 }).moveDown();
}

function generateCustomerInformation(doc, invoice) {
  doc.fillColor("#000000").fontSize(11).text("{Fecha}", 50, 130);
  doc.fillColor("#000000").fontSize(11).text("{Nombre del cliente}", 50, 150);
  doc
    .fillColor("#000000")
    .fontSize(11)
    .text("{Dirección Postal del cliente}", 50, 170);
  doc.fillColor("#000000").fontSize(11).text("Estimado cliente,", 50, 190);
  doc
    .fillColor("#000000")
    .fontSize(11)
    .text(
      "Nuestro departamento de Finanzas le informa, que su cuenta se encuentra en un atraso de más de 30 días. Su balance pendiente es de $xxxx.xx de lo cual $xxxx.xx se encuentra en atraso.",
      50,
      205
    )
    .moveDown();
  doc
    .fillColor("#000000")
    .fontSize(11)
    .text(
      "En varias ocasiones hemos tratado de comunicarnos con usted, pero el esfuerzo ha sido infructuoso. Hoy en día no hemos recibido pagos o acuerdos de su parte.  Por tanto, se solicita que pueda hacer las gestiones de pago del balance en atraso antes mencionado, para en o antes del día {(fecha estipulada)}. De no recibir pago para esta fecha sus servicios permanecerán desconectados."
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

function generateInvoiceTable(doc, invoice) {
  let i;
  const invoiceTableTop = 330;

  doc.font("Helvetica-Bold");
  generateTableRow(
    doc,
    invoiceTableTop,
    "Item",
    "Description",
    "Unit Cost",
    "Quantity",
    "Line Total"
  );
  generateHr(doc, invoiceTableTop + 20);
  doc.font("Helvetica");

  for (i = 0; i < invoice.items.length; i++) {
    const item = invoice.items[i];
    const position = invoiceTableTop + (i + 1) * 30;
    generateTableRow(
      doc,
      position,
      item.item,
      item.description,
      formatCurrency(item.amount / item.quantity),
      item.quantity,
      formatCurrency(item.amount)
    );

    generateHr(doc, position + 20);
  }

  const subtotalPosition = invoiceTableTop + (i + 1) * 30;
  generateTableRow(
    doc,
    subtotalPosition,
    "",
    "",
    "Subtotal",
    "",
    formatCurrency(invoice.subtotal)
  );

  const paidToDatePosition = subtotalPosition + 20;
  generateTableRow(
    doc,
    paidToDatePosition,
    "",
    "",
    "Paid To Date",
    "",
    formatCurrency(invoice.paid)
  );

  const duePosition = paidToDatePosition + 25;
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
  quantity,
  lineTotal
) {
  doc
    .fontSize(10)
    .text(item, 50, y)
    .text(description, 150, y)
    .text(unitCost, 280, y, { width: 90, align: "right" })
    .text(quantity, 370, y, { width: 90, align: "right" })
    .text(lineTotal, 0, y, { align: "right" });
}

function generateHr(doc, y) {
  doc.strokeColor("#aaaaaa").lineWidth(1).moveTo(50, y).lineTo(550, y).stroke();
}

function formatCurrency(cents) {
  return "$" + (cents / 100).toFixed(2);
}

function formatDate(date) {
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();

  return year + "/" + month + "/" + day;
}
module.exports = { createInvoice };
