const usersDebts = require("./usersDebts");
const PDFDocument = require("pdfkit");
const fs = require("fs");
const doc = new PDFDocument();
const { createInvoice } = require("./createInvoice.js");
let today = new Date();
// fecha estipulada el dia o antes del 21 de cada mes
// codigo postal address":"HC 5 Box 5508","city":"Yabucoa","state":"PR","zip":00767
// data sent
//  Invoice number
// Amount
// Amount outstanding
const invoice = {
  shipping: {
    name: "John Doe",
    address: "1234 Main Street",
    city: "San Francisco",
    state: "CA",
    country: "US",
    postal_code: 94111,
  },
  items: [
    {
      item: "TC 100",
      description: "Toner Cartridge",
      quantity: 2,
      amount: 6000,
    },
    {
      item: "USB_EXT",
      description: "USB Cable Extender",
      quantity: 1,
      amount: 2000,
    },
  ],
  subtotal: 8000,
  paid: 0,
  invoice_nr: 1234,
};
// console.log(test);
createInvoice(invoice, "invoice.pdf", 0);

createInvoice(invoice, "SecondInvoice.pdf", 1);
