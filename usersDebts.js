const fs = require("fs");
let rawData = fs.readFileSync("billing0Response.json");
let userData = fs.readFileSync("UsersResponse.json");
let Users = JSON.parse(userData);
let billing = JSON.parse(rawData);

let objectManage = Object.keys(billing.data);

let AllData = [];

for (let index = 0; index < objectManage.length; index++) {
  let dateSent = billing.data[objectManage[index]].date;
  data = new Date(dateSent * 1000);
  const formData = () => {
    const day = data.getDate();
    const month = data.getMonth() + 1;
    const year = data.getFullYear();
    return `${day}/${month}/${year}`;
  };

  AllData.push({
    Invoice: billing.data[objectManage[index]].invid,
    clientid: billing.data[objectManage[index]].clientid,
    dateSent: formData(),
    amount_unpaid: billing.data[objectManage[index]].amount_unpaid,
  });
}

const timesRepeatedClientID = {};
AllData.forEach((el, index) => (timesRepeatedClientID[el.clientid] = timesRepeatedClientID[el.clientid] + 1 || 1));

// Clientes Residential
let ObjectUsers = Object.keys(Users.data);
let ClientesResidential = [];

// ClientidR3T= Clientid Repeated 3 Times
let ClientidR3T = [];
let ClientNamesR3T = [];

// ClientidC_R3T= Clientid Comercial Repeated 3 Times
let ClientidB_R3T = [];
let ClientNamesB_R3T = [];

// ClientidNone_R3T= Clientid None Repeated 3 Times
let ClientidNone_R3T = [];
let ClientNamesNone_R3T = [];

// ClientidBV_R3T= Clientid BusinessVIP Repeated 3 Times
let ClientidBV_R3T = [];
let ClientNamesBV_R3T = [];

// ClientidE_R3T= Clientid Enterprise Repeated 3 Times
let ClientidE_R3T = [];
let ClientNamesE_R3T = [];

// ClientidW_R3T= Clientid Wholesale Repeated 3 Times
let ClientidW_R3T = [];
let ClientNamesW_R3T = [];

// ClientidReseller_R3T= Clientid Reseller Repeated 3 Times
let ClientidReseller_R3T = [];
let ClientNamesReseller_R3T = [];

Object.keys(timesRepeatedClientID).forEach((element, index) => {
  if (Object.values(timesRepeatedClientID)[index] >= 3) {
    ObjectUsers.forEach((element2) => {
      let Residenciales = Users.data[element2].metadata.client_type;
      if (Residenciales === "Residential" && element === Users.data[element2].clientid) {
        ClientidR3T.push(element);

        ClientNamesR3T.push([
          Users.data[element2].company.trim() === "" ? Users.data[element2].full_name : Users.data[element2].company,
          Users.data[element2].address,
          Users.data[element2].city,
          Users.data[element2].state,
          Users.data[element2].zip,
          Users.data[element2].clientid,
        ]);
      }
      if (Residenciales === "Business" && element === Users.data[element2].clientid) {
        ClientidB_R3T.push(element);
        ClientNamesB_R3T.push([
          Users.data[element2].company.trim() === "" ? Users.data[element2].full_name : Users.data[element2].company,
          Users.data[element2].address,
          Users.data[element2].city,
          Users.data[element2].state,
          Users.data[element2].zip,
          Users.data[element2].clientid,
        ]);
      }
      if (Residenciales === "NONE" && element === Users.data[element2].clientid) {
        ClientidNone_R3T.push(element);
        ClientNamesNone_R3T.push([
          Users.data[element2].company.trim() === "" ? Users.data[element2].full_name : Users.data[element2].company,
          Users.data[element2].address,
          Users.data[element2].city,
          Users.data[element2].state,
          Users.data[element2].zip,
          Users.data[element2].clientid,
        ]);
      }

      if (Residenciales === "Business VIP" && element === Users.data[element2].clientid) {
        ClientidBV_R3T.push(element);
        ClientNamesBV_R3T.push([
          // Users.data[element2].full_name.trim() === "" ? Users.data[element2].company : Users.data[element2].full_name,
          Users.data[element2].company.trim() === "" ? Users.data[element2].full_name : Users.data[element2].company,
          Users.data[element2].address,
          Users.data[element2].city,
          Users.data[element2].state,
          Users.data[element2].zip,
          Users.data[element2].clientid,
        ]);
      }

      if (Residenciales === "Enterprise" && element === Users.data[element2].clientid) {
        ClientidE_R3T.push(element);
        ClientNamesE_R3T.push([
          // Users.data[element2].full_name.trim() === "" ? Users.data[element2].company : Users.data[element2].full_name,
          Users.data[element2].company.trim() === "" ? Users.data[element2].full_name : Users.data[element2].company,
          Users.data[element2].address,
          Users.data[element2].city,
          Users.data[element2].state,
          Users.data[element2].zip,
          Users.data[element2].clientid,
        ]);
      }

      if (Residenciales === "Wholesale" && element === Users.data[element2].clientid) {
        ClientidW_R3T.push(element);
        ClientNamesW_R3T.push([
          // Users.data[element2].full_name.trim() === "" ? Users.data[element2].company : Users.data[element2].full_name,
          Users.data[element2].company.trim() === "" ? Users.data[element2].full_name : Users.data[element2].company,
          Users.data[element2].address,
          Users.data[element2].city,
          Users.data[element2].state,
          Users.data[element2].zip,
          Users.data[element2].clientid,
        ]);
      }

      if (Residenciales === "Reseller" && element === Users.data[element2].clientid) {
        ClientidReseller_R3T.push(element);
        ClientNamesReseller_R3T.push([
          // Users.data[element2].full_name.trim() === "" ? Users.data[element2].company : Users.data[element2].full_name,
          Users.data[element2].company.trim() === "" ? Users.data[element2].full_name : Users.data[element2].company,
          Users.data[element2].address,
          Users.data[element2].city,
          Users.data[element2].state,
          Users.data[element2].zip,
          Users.data[element2].clientid,
        ]);
      }
    });
  }
});

// ClientidR3T.filter((element) => element === ClientesResidential);

let total = [];
let DataRR3T = [];
let DataBR3T = [];
let DataNoneR3T = [];
let DataBVR3T = [];
let DataEnterpriseR3T = [];
let DataWS3T = [];
let DataResellerR3T = [];

// ClientidC_R3T
// ClientidNone_R3T
// ClientidBV_R3T
// ClientidE_R3T
// ClientidW_R3T
// ClientidReseller_R3T
ClientidR3T.forEach((element, index) => {
  let Clients = AllData.filter((el) => el.clientid === element);
  DataRR3T.push(Clients);
  // console.log(Clients.length);
  // total.push(Clients.reduce((a, b) => parseFloat(a) + parseFloat(b.amount_unpaid), 0));
  // console.log(
  //   element,
  //   ClientNamesR3T[index],
  //   Clients.reduce((a, b) => parseFloat(a) + parseFloat(b.amount_unpaid), 0)
  // );
});

ClientidB_R3T.forEach((element, index) => {
  let Clients = AllData.filter((el) => el.clientid === element);
  DataBR3T.push(Clients);
});
ClientidNone_R3T.forEach((element, index) => {
  let Clients = AllData.filter((el) => el.clientid === element);
  DataNoneR3T.push(Clients);
});
ClientidBV_R3T.forEach((element, index) => {
  let Clients = AllData.filter((el) => el.clientid === element);
  DataBVR3T.push(Clients);
});
ClientidE_R3T.forEach((element, index) => {
  let Clients = AllData.filter((el) => el.clientid === element);
  DataEnterpriseR3T.push(Clients);
});
ClientidW_R3T.forEach((element, index) => {
  let Clients = AllData.filter((el) => el.clientid === element);
  DataWS3T.push(Clients);
});
ClientidReseller_R3T.forEach((element, index) => {
  let Clients = AllData.filter((el) => el.clientid === element);
  DataResellerR3T.push(Clients);
});

// skip it
DataRR3T.forEach((element, index) => {
  DataRR3T[index].forEach((element2, index0) => {
    if (index0 === 0) {
      let Clients = AllData.filter((el) => el.clientid === element2.clientid);
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

module.exports = {
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
};
