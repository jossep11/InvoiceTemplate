const { createInvoice } = require("./createInvoice.js");
const fs = require("fs");
const { SymbologyType, createStream, createFile } = require("symbology");

const {
  DataRR3T,
  ClientNamesR3T,
  DataNoneR3T,
  ClientNamesNone_R3T,
  DataBR3T,
  ClientNamesB_R3T,
  DataBVR3T,
  ClientNamesBV_R3T,
  DataEnterpriseR3T,
  ClientNamesE_R3T,
  DataWS3T,
  ClientNamesW_R3T,
  DataResellerR3T,
  ClientNamesReseller_R3T,
  AllData,
} = require("./usersDebts");
const xl = require("excel4node");
const { createExcel } = require("./createExcel.js");

const folderNames = ["Residenciales", "NONE", "Business", "Business VIP", "Enterprise", "Wholesale", "Reseller"];

try {
  var wb = new xl.Workbook();

  folderNames.forEach((element) => {
    if (!fs.existsSync(`./${element}`)) {
      fs.mkdirSync(element);
      if (!fs.existsSync(`./${element}/barcodes`)) {
        fs.mkdirSync(`${element}/barcodes`);
      }
      if (element === "Residenciales") {
        createInvoice("./Residenciales/invoice.pdf", 0, DataRR3T, ClientNamesR3T, AllData);
        createInvoice("./Residenciales/SecondInvoice.pdf", 1, DataRR3T, ClientNamesR3T, AllData);
        createExcel(wb, element, DataRR3T, ClientNamesR3T, AllData);
      }
      if (element === "NONE") {
        createInvoice("./NONE/invoice.pdf", 0, DataNoneR3T, ClientNamesNone_R3T, AllData);
        createInvoice("./NONE/SecondInvoice.pdf", 1, DataNoneR3T, ClientNamesNone_R3T, AllData);
        createExcel(wb, element, DataNoneR3T, ClientNamesNone_R3T, AllData);
      }
      if (element === "Business") {
        createInvoice("./Business/invoice.pdf", 0, DataBR3T, ClientNamesB_R3T, AllData);
        createInvoice("./Business/SecondInvoice.pdf", 1, DataBR3T, ClientNamesB_R3T, AllData);
        createExcel(wb, element, DataBR3T, ClientNamesB_R3T, AllData);
      }

      if (element === "Business VIP") {
        createInvoice("./Business VIP/invoice.pdf", 0, DataBVR3T, ClientNamesBV_R3T, AllData);
        createInvoice("./Business VIP/SecondInvoice.pdf", 1, DataBVR3T, ClientNamesBV_R3T, AllData);
        createExcel(wb, element, DataBVR3T, ClientNamesBV_R3T, AllData);
      }
      if (element === "Enterprise") {
        createInvoice("./Enterprise/invoice.pdf", 0, DataEnterpriseR3T, ClientNamesE_R3T, AllData);
        createInvoice("./Enterprise/SecondInvoice.pdf", 1, DataEnterpriseR3T, ClientNamesE_R3T, AllData);
        createExcel(wb, element, DataEnterpriseR3T, ClientNamesE_R3T, AllData);
      }
      if (element === "Wholesale") {
        createInvoice("./Wholesale/invoice.pdf", 0, DataWS3T, ClientNamesW_R3T, AllData);
        createInvoice("./Wholesale/SecondInvoice.pdf", 1, DataWS3T, ClientNamesW_R3T, AllData);
        createExcel(wb, element, DataWS3T, ClientNamesW_R3T, AllData);
      }
      if (element === "Reseller") {
        createInvoice("./Reseller/invoice.pdf", 0, DataResellerR3T, ClientNamesReseller_R3T, AllData);
        createInvoice("./Reseller/SecondInvoice.pdf", 1, DataResellerR3T, ClientNamesReseller_R3T, AllData);
        createExcel(wb, element, DataResellerR3T, ClientNamesReseller_R3T, AllData);
      }
    } else {
      if (!fs.existsSync(`./${element}/barcodes`)) {
        fs.mkdirSync(`${element}/barcodes`);
      }
      if (element === "Residenciales") {
        createInvoice("./Residenciales/invoice.pdf", 0, DataRR3T, ClientNamesR3T, AllData, element);
        createInvoice("./Residenciales/SecondInvoice.pdf", 1, DataRR3T, ClientNamesR3T, AllData, element);
        createExcel(wb, element, DataRR3T, ClientNamesR3T, AllData);
      }
      if (element === "NONE") {
        createInvoice("./NONE/invoice.pdf", 0, DataNoneR3T, ClientNamesNone_R3T, AllData, element);
        createInvoice("./NONE/SecondInvoice.pdf", 1, DataNoneR3T, ClientNamesNone_R3T, AllData, element);
        createExcel(wb, element, DataNoneR3T, ClientNamesNone_R3T, AllData);
      }
      if (element === "Business") {
        createInvoice("./Business/invoice.pdf", 0, DataBR3T, ClientNamesB_R3T, AllData, element);
        createInvoice("./Business/SecondInvoice.pdf", 1, DataBR3T, ClientNamesB_R3T, AllData, element);
        createExcel(wb, element, DataBR3T, ClientNamesB_R3T, AllData);
      }

      if (element === "Business VIP") {
        createInvoice("./Business VIP/invoice.pdf", 0, DataBVR3T, ClientNamesBV_R3T, AllData, element);
        createInvoice("./Business VIP/SecondInvoice.pdf", 1, DataBVR3T, ClientNamesBV_R3T, AllData, element);
        createExcel(wb, element, DataBVR3T, ClientNamesBV_R3T, AllData);
      }
      if (element === "Enterprise") {
        createInvoice("./Enterprise/invoice.pdf", 0, DataEnterpriseR3T, ClientNamesE_R3T, AllData, element);
        createInvoice("./Enterprise/SecondInvoice.pdf", 1, DataEnterpriseR3T, ClientNamesE_R3T, AllData, element);
        createExcel(wb, element, DataEnterpriseR3T, ClientNamesE_R3T, AllData);
      }
      if (element === "Wholesale") {
        createInvoice("./Wholesale/invoice.pdf", 0, DataWS3T, ClientNamesW_R3T, AllData, element);
        createInvoice("./Wholesale/SecondInvoice.pdf", 1, DataWS3T, ClientNamesW_R3T, AllData, element);
        createExcel(wb, element, DataWS3T, ClientNamesW_R3T, AllData);
      }
      if (element === "Reseller") {
        createInvoice("./Reseller/invoice.pdf", 0, DataResellerR3T, ClientNamesReseller_R3T, AllData, element);
        createInvoice("./Reseller/SecondInvoice.pdf", 1, DataResellerR3T, ClientNamesReseller_R3T, AllData, element);
        createExcel(wb, element, DataResellerR3T, ClientNamesReseller_R3T, AllData);
      }
    }
  });
  wb.write("Excel.xlsx");
} catch (err) {
  console.error(err);
}

// (async () => {
//   try {
//     const { data } = await createFile(
//       {
//         symbology: SymbologyType.CODE128,
//         fileName: `./${FolderName}/barcodes/${ClientData[5]}.png`,
//       },
//       ClientData[5]
//     );
//     // console.log("cool");
//   } catch (error) {
//     console.log(error);
//   }

// doc.image(`./${FolderName}/barcodes/${ClientData[5]}.png`, 50, 45, { width: 565 }).moveDown();
// console.log("Result: ", data);
// })();
