const fs = require("fs");
let rawData = fs.readFileSync("response1year.json");
let userData = fs.readFileSync("usuarios.json");
let Users = JSON.parse(userData);
let billing = JSON.parse(rawData);

let objectManage = Object.keys(billing.data);

let newArray = [];

for (let index = 0; index < objectManage.length; index++) {
  let dateSent = billing.data[objectManage[index]].date;
  data = new Date(dateSent * 1000);
  const formData = () => {
    const day = data.getDate();
    const month = data.getMonth() + 1;
    const year = data.getFullYear();
    return `${day}/${month}/${year}`;
  };

  newArray.push({
    Invoice: billing.data[objectManage[index]].invid,
    clientid: billing.data[objectManage[index]].clientid,
    dateSent: formData(),
    amount_unpaid: billing.data[objectManage[index]].amount_unpaid,
  });
}

const timesRepeatedClientID = {};
newArray.forEach(
  (el, index) =>
    (timesRepeatedClientID[el.clientid] =
      timesRepeatedClientID[el.clientid] + 1 || 1)
);

// Clientes Residential
let ObjectUsers = Object.keys(Users.data);
let ClientesResidential = [];

// ClientidR3T= Clientid Repeated 3 Times
let ClientidR3T = [];
let ClientNamesR3T = [];

Object.keys(timesRepeatedClientID).forEach((element, index) => {
  if (Object.values(timesRepeatedClientID)[index] >= 3) {
    ObjectUsers.forEach((element2) => {
      let Residenciales = Users.data[element2].metadata.client_type;
      if (
        Residenciales === "Residential" &&
        element === Users.data[element2].clientid
      ) {
        ClientidR3T.push(element);
        ClientNamesR3T.push([
          Users.data[element2].full_name,
          Users.data[element2].address,
          Users.data[element2].city,
          Users.data[element2].state,
          Users.data[element2].zip,
        ]);
      }
    });
  }
});

// ClientidR3T.filter((element) => element === ClientesResidential);

let total = [];
let dataArray = [];

ClientidR3T.forEach((element, index) => {
  let Clients = newArray.filter((el) => el.clientid === element);

  dataArray.push(Clients);
  total.push(
    Clients.reduce((a, b) => parseFloat(a) + parseFloat(b.amount_unpaid), 0)
  );
  // console.log(
  //   element,
  //   ClientNamesR3T[index],
  //   Clients.reduce((a, b) => parseFloat(a) + parseFloat(b.amount_unpaid), 0)
  // );
});

dataArray.forEach((element, index) => {
  dataArray[index].forEach((element2, index0) => {
    if (index0 === 0) {
      let Clients = newArray.filter((el) => el.clientid === element2.clientid);
      // console.log(Clients);
      // console
      // .log
      // ClientNamesR3T[index],
      // Clients.reduce((a, b) => parseFloat(a) + parseFloat(b.amount_unpaid), 0)
      // ();
    }
    // console.log(element2);
  });
});

// console.log(ClientNamesR3T);
module.exports = { dataArray, ClientNamesR3T, newArray };
