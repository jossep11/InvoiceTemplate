const fs = require("fs");
const { posix } = require("path");
const PDFDocument = require("pdfkit");
// const { DataRR3T, ClientNamesR3T, AllData } = require("./usersDebts");
// const { DataCR3T } = require("./usersDebts");
// console.log(DataRR3T);
function createInvoice(path, type, DataRR3T, ClientNamesR3T, AllData) {
  let doc = new PDFDocument({ size: [612, 792], margin: 50 });
  // Invoices menores a 8
  if (type === 0) {
    for (let index = 0; index < DataRR3T.length; index++) {
      let ArraySize = DataRR3T[index].length;
      if (ArraySize < 8) {
        let Clients = AllData.filter((el) => el.clientid === DataRR3T[index][0].clientid);
        let DeudaTotalxClient = Clients.reduce((a, b) => parseFloat(a) + parseFloat(b.amount_unpaid), 0);
        if (index !== 0) {
          doc.addPage();
        }
        generateHeader(doc);
        generateCustomerInformation(
          doc,

          ClientNamesR3T[index],
          DataRR3T[index],
          DeudaTotalxClient
        );
        generateInvoiceTable(doc, index, DeudaTotalxClient, DataRR3T);
        generateFooter(doc);

        generateCustomerInformationUnderTable(doc, ArraySize);
      }
    }
  }

  // Invoices mayor a mayor a 7
  if (type === 1) {
    let contador = 0;
    for (let index = 0; index < DataRR3T.length; index++) {
      let ArraySize = DataRR3T[index].length;
      if (ArraySize > 7) {
        contador++;
        let Clients = AllData.filter((el) => el.clientid === DataRR3T[index][0].clientid);
        let DeudaTotalxClient = Clients.reduce((a, b) => parseFloat(a) + parseFloat(b.amount_unpaid), 0);

        if (contador !== 1) {
          doc.addPage();
        }
        generateHeader(doc);
        generateFooter(doc);
        generateCustomerInformation(
          doc,

          ClientNamesR3T[index],
          DataRR3T[index],
          DeudaTotalxClient
        );
        generateInvoiceTable(doc, index, DeudaTotalxClient, DataRR3T);

        generateCustomerInformationUnderTable(doc, DataRR3T[index].length);
        generateFooter(doc);
      }
    }
  }

  doc.end();
  doc.pipe(fs.createWriteStream(path));
}

// Header img
function generateHeader(doc) {
  doc.image("img_header.png", 50, 45, { width: 565 }).moveDown();
}

// General info
function generateCustomerInformation(doc, ClientData, dataArray, DeudaTotalxClient) {
  let CustomerInfoPosition = 130;
  doc.fillColor("#000000").fontSize(11).text(formatDate(), 50, CustomerInfoPosition);

  doc
    .fillColor("#000000")
    .fontSize(11)
    .text(ClientData[0] + ": " + ClientData[5], 50, CustomerInfoPosition + 30);

  doc
    .fillColor("#000000")
    .fontSize(11)
    .text(`${ClientData[1]} `, 50, CustomerInfoPosition + 45);

  doc
    .fillColor("#000000")
    .fontSize(11)
    .text(`${ClientData[2]}, ${ClientData[3]} ${ClientData[4]}`, 50, CustomerInfoPosition + 58)
    .moveDown();

  doc.fillColor("#000000").fontSize(11).text("Estimado cliente,", 50).moveDown();

  doc
    .fillColor("#000000")
    .fontSize(11)
    .text(`     Nuestro departamento de Finanzas le informa, que su cuenta se encuentra en un atraso de más de 30 días. Su balance en atraso es de $${DeudaTotalxClient.toFixed(2)}`, 50)
    .moveDown();
  doc
    .fillColor("#000000")
    .fontSize(11)
    .text(
      "En varias ocasiones hemos tratado de comunicarnos con usted, pero el esfuerzo ha sido infructuoso. Hoy en día no hemos recibido pagos o acuerdos de su parte.  Por tanto, se solicita que pueda hacer las gestiones de pago del balance en atraso antes mencionado, para en o antes del día 21 del presente mes."
    )
    .moveDown();

  doc.fillColor("#000000").fontSize(11).text("De no recibir el pago para esta fecha sus servicios permanecerán desconectados.").moveDown();

  const customerInformationTop = 200;
}

// General table
function generateInvoiceTable(doc, index1, DeudaTotalxClient, DataRR3T) {
  let i = 0;
  let invoiceTableTop = 380;

  doc.font("Helvetica-Bold");
  generateTableRow(doc, invoiceTableTop, "Invoice Number", "Date Sent", "Amount", "Amount Outstanding");
  generateHr(doc, invoiceTableTop + 20);
  doc.font("Helvetica");

  DataRR3T[index1].forEach((element) => {
    const { Invoice, dateSent, amount_unpaid } = element;

    let position = invoiceTableTop + (i + 1) * 30;
    if (position === 680) {
      doc.addPage();
      i = 0;
      invoiceTableTop = 70;
      position = 100;
    }
    generateTableRow(doc, position, Invoice, dateSent, amount_unpaid, amount_unpaid);
    generateHr(doc, position + 20);

    i++;
  });

  const duePosition = invoiceTableTop + (i + 1) * 30;
  doc.font("Helvetica-Bold");

  generateTableRow(doc, duePosition, "", "", "Balance Due", formatCurrency(DeudaTotalxClient));
  doc.font("Helvetica").moveDown();
}

// Info
function generateCustomerInformationUnderTable(doc, ArraySize) {
  doc
    .fillColor("#000000")
    .fontSize(11)
    .text(
      "Si existe alguna razón por la cual no ha podido emitir el pago o desea efectuar el mismo, puede comunicarse al 787-655-1919, marcar la opción #3 (Facturación y Pagos), o enviar un email a Billing@osnetpr.com. O tambien puede escribir por Whatsapp al 787-655-1919.",
      50
    )
    .moveDown();
  doc.fillColor("#000000").fontSize(11).text("Si ya envió el pago, le pedimos disculpas por la molestia y le agradecemos su patrocinio.", 50).moveDown();
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

// Salto de linea subrayado
function generateHr(doc, y) {
  doc.strokeColor("#aaaaaa").lineWidth(1).moveTo(50, y).lineTo(565, y).stroke();
}

// Footer
function generateFooter(doc) {
  // doc.image("img_footer.png", 0, 702, { width: 600 });
  doc.image("img_footer.png", 0, 652, { width: 612 });
}

// Formato de moneda
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
