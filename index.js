const express = require("express");
// const router = require("./routes");
const PDFDocument = require("pdfkit");
const fs = require("fs");
const doc = new PDFDocument();
const { createInvoice } = require("./createInvoice.js");
let today = new Date();

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

createInvoice(invoice, "invoice.pdf");
