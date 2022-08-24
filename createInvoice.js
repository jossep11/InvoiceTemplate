const fs = require("fs");
const { posix } = require("path");
const PDFDocument = require("pdfkit");
const { dataArray, ClientNamesR3T, newArray } = require("./usersDebts");

function createInvoice(invoice, path, type) {
  let doc = new PDFDocument({ size: "A4", margin: 50 });
  // Invoices menores a 9
  if (type === 0) {
    for (let index = 0; index < dataArray.length; index++) {
      let ArraySize = dataArray[index].length;
      if (ArraySize < 10) {
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

        generateCustomerInformationUnderTable(doc, ArraySize);
      }
    }
  }

  // Invoices mayor a mayor a 8
  if (type === 1) {
    let contador = 0;
    for (let index = 0; index < dataArray.length; index++) {
      let ArraySize = dataArray[index].length;
      if (ArraySize > 9) {
        contador++;
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
        generateFooter(doc);
        generateCustomerInformation(
          doc,
          invoice,
          ClientNamesR3T[index],
          dataArray[index],
          DeudaTotalxClient
        );
        generateInvoiceTable(doc, invoice, index, DeudaTotalxClient);

        generateCustomerInformationUnderTable(doc, dataArray[index].length);
        generateFooter(doc);
      }
    }
  }

  doc.end();
  doc.pipe(fs.createWriteStream(path));
}

// Header img
function generateHeader(doc) {
  doc.image("img_header.png", 50, 45, { width: 550 }).moveDown();
}

// General info
function generateCustomerInformation(
  doc,
  invoice,
  ClientData,
  dataArray,
  DeudaTotalxClient
) {
  let CustomerInfoPosition = 130;
  doc
    .fillColor("#000000")
    .fontSize(11)
    .text(formatDate(), 50, CustomerInfoPosition);

  doc
    .fillColor("#000000")
    .fontSize(11)
    .text(ClientData[0], 50, CustomerInfoPosition + 30);

  doc
    .fillColor("#000000")
    .fontSize(11)
    .text(`${ClientData[1]} `, 50, CustomerInfoPosition + 45);

  doc
    .fillColor("#000000")
    .fontSize(11)
    .text(
      `${ClientData[2]}, ${ClientData[3]} ${ClientData[4]}`,
      50,
      CustomerInfoPosition + 58
    )
    .moveDown();

  doc
    .fillColor("#000000")
    .fontSize(11)
    .text("Estimado cliente,", 50)
    .moveDown();

  doc
    .fillColor("#000000")
    .fontSize(11)
    .text(
      `     Nuestro departamento de Finanzas le informa, que su cuenta se encuentra en un atraso de más de 30 días. Su balance en atraso es de $${DeudaTotalxClient.toFixed(
        2
      )}`,
      50
    )
    .moveDown();
  doc
    .fillColor("#000000")
    .fontSize(11)
    .text(
      "En varias ocasiones hemos tratado de comunicarnos con usted, pero el esfuerzo ha sido infructuoso. Hoy en día no hemos recibido pagos o acuerdos de su parte.  Por tanto, se solicita que pueda hacer las gestiones de pago del balance en atraso antes mencionado, para en o antes del día 21 del presente mes."
    )
    .moveDown();

  doc
    .fillColor("#000000")
    .fontSize(11)
    .text(
      "De no recibir el pago para esta fecha sus servicios permanecerán desconectados."
    )
    .moveDown();

  const customerInformationTop = 200;
}

// General table
function generateInvoiceTable(doc, invoice, index1, DeudaTotalxClient) {
  let i = 0;
  let invoiceTableTop = 380;

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

    let position = invoiceTableTop + (i + 1) * 30;
    if (position === 740) {
      doc.addPage();
      // generateHeader(doc);
      i = 0;
      invoiceTableTop = 70;
      position = 100;
    }
    // console.log(position, " ", invoiceTableTop);
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
  doc.font("Helvetica").moveDown();
}

function generateCustomerInformationUnderTable(doc, ArraySize) {
  doc
    .fillColor("#000000")
    .fontSize(11)
    .text(
      "Si existe alguna razón por la cual no ha podido emitir el pago o desea efectuar el mismo, puede comunicarse al 787-655-1919, marcar la opción #3 (Facturación y Pagos), o enviar un email a Billing@osnetpr.com. O tambien puede escribir por Whatsapp al 787-655-1919.",
      50
    )
    .moveDown();
  doc
    .fillColor("#000000")
    .fontSize(11)
    .text(
      "Si ya envió el pago, le pedimos disculpas por la molestia y le agradecemos su patrocinio.",
      50
    );
  doc.fillColor("#000000").fontSize(11).text("OSNET Wireless Corporation", 50);
  // generateHr(doc, 185);
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
function generateFooter(doc) {
  doc.image("img_footer.png", 0, 702, { width: 600 });
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
