var _client = require("@prisma/client");
var prisma = new _client.PrismaClient();
const fs = require('fs').promises;



const func=async ()=>{

  const bmwRecords = await prisma.bmw.findMany({
    take: 3
  });

  console.log(bmwRecords);


}


func()


// ////////////////////////////////////////////////////////////
// ///////////////////////////////////////////////////////////

// async function getAllBMWs() {
//   const allBMWs = await prisma.bmw.findMany();
//   return allBMWs;
// }

// getAllBMWs().then(bmw => console.log(bmw));

// ////////////////////////////////////////////////////////////
// ///////////////////////////////////////////////////////////

// async function upsertBMW(id, createData, updateData) {
//   const bmw = await prisma.bmw.upsert({
//       where: { "PO": id }, // Unique identifier to check if the record exists
//       create: createData, // Data to create if the record doesn't exist
//       update: updateData, // Data to update if the record exists
//   });
//   return bmw;
// }

// ////////////////////////////////////////////////////////////
// ///////////////////////////////////////////////////////////