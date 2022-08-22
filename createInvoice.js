const fs = require("fs");
const PDFDocument = require("pdfkit");
const { dataArray, ClientNamesR3T, newArray } = require("./usersDebts");

function createInvoice(invoice, path, type) {
  let doc = new PDFDocument({ size: "A4", margin: 50 });
  if (type === 0) {
    for (let index = 0; index < dataArray.length; index++) {
      if (dataArray[index].length < 11) {
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
        generateInvoiceTable(doc, invoice, index, DeudaTotalxClient);
        generateFooter(doc);

        generateCustomerInformationUnderTable(doc);
      }
    }
  }

  if (type === 1) {
    let contador = 0;
    for (let index = 0; index < dataArray.length; index++) {
      if (dataArray[index].length > 10) {
        contador++;
        console.log(contador);
        let Clients = newArray.filter(
          (el) => el.clientid === dataArray[index][0].clientid
        );
        let DeudaTotalxClient = Clients.reduce(
          (a, b) => parseFloat(a) + parseFloat(b.amount_unpaid),
          0
        );

        if (contador !== 1) {
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
        generateInvoiceTable(doc, invoice, index, DeudaTotalxClient);
        generateFooter(doc);

        generateCustomerInformationUnderTable(doc);
      }
    }
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
  doc.fillColor("#000000").fontSize(11).text(ClientData[0], 50, 145);
  doc
    .fillColor("#000000")
    .fontSize(11)
    .text(
      `Dirección Postal: ${ClientData[1]}, Ciudad:${ClientData[2]}, Estado:${ClientData[3]}, Zip: ${ClientData[4]}`,
      50,
      160
    );

  doc.fillColor("#000000").fontSize(11).text("Estimado cliente,", 50, 185);
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

  const customerInformationTop = 200;
}

function generateInvoiceTable(doc, invoice, index1, DeudaTotalxClient) {
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
    // console.log(dataArray[index1].length);
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

  const duePosition = invoiceTableTop + (i + 1) * 30;
  doc.font("Helvetica-Bold");
  generateTableRow(
    doc,
    duePosition,
    "",
    "",
    "Balance Due",
    formatCurrency(DeudaTotalxClient)
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
  generateFooter(doc);
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

function formatCurrency(value) {
  return "$" + value.toFixed(2);
}

function formatDate() {
  const day = new Date().getDate();
  const month = new Date().getMonth() + 1;
  const year = new Date().getFullYear();

  return day + "/" + month + "/" + year;
}
module.exports = { createInvoice };
