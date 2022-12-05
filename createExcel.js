// Create a new instance of a Workbook class

const createExcel = (wb, element, DataRR3T, ClientNamesR3T, AllData) => {
  var ws = wb.addWorksheet(element);

  var style = wb.createStyle({
    font: {
      // color: "#FF0800",
      size: 12,
    },
    numberFormat: "$#,##0.00; ($#,##0.00); -",
  });

  // Set value of cell A1 to 100 as a number type styled with paramaters of style
  ws.cell(1, 1).string("ClientID").style(style);
  ws.cell(1, 2).string("Nombre").style(style);
  ws.cell(1, 3).string("Balance total atrasado").style(style);
  ws.column(2).setWidth(30);
  ws.column(3).setWidth(18);

  for (let index = 0; index < DataRR3T.length; index++) {
    let ArraySize = DataRR3T[index].length;
    let Clients = AllData.filter((el) => el.clientid === DataRR3T[index][0].clientid);
    let DeudaTotalxClient = Clients.reduce((a, b) => parseFloat(a) + parseFloat(b.amount_unpaid), 0);
    // console.log(element, ClientNamesR3T[index][0], " ", ClientNamesR3T[index][5], " ", DeudaTotalxClient);
    // client ID
    ws.cell(index + 2, 1).number(parseInt(ClientNamesR3T[index][5]));
    // Nombre
    ws.cell(index + 2, 2).string(ClientNamesR3T[index][0]);
    // Balance total atrasado
    ws.cell(index + 2, 3).number(DeudaTotalxClient);
  }

  // Set value of cell A3 to true as a boolean type styled with paramaters of style but with an adjustment to the font size.
  // ws.cell(3, 1)
  //   .bool(true)
  //   .style(style)
  //   .style({ font: { size: 14 } });
};
module.exports = { createExcel };
