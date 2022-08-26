const usersDebts = require("./usersDebts");
const PDFDocument = require("pdfkit");
const fs = require("fs");
const doc = new PDFDocument();
const { createInvoice } = require("./createInvoice.js");

createInvoice("invoice.pdf", 0);

createInvoice("SecondInvoice.pdf", 1);
