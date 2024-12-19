
import React from 'react';
import { getSession, withPageAuthRequired } from '@auth0/nextjs-auth0';
import { PrismaClient } from '@prisma/client'
const moment = require('moment-timezone');

const prisma = new PrismaClient()


// const centralTimeZone=function(datetime){
    
//     // Create a date object for '2024-01-26'
//     // Assuming the date is initially in UTC
//     const dateUTC = moment.utc(datetime);

//     // Convert the date to Central Time
//     const dateCentral = dateUTC.tz('America/Chicago');  
//     // const dateCentral = dateUTC.tz('UTC'); 

//     // Format the date as a string, if needed
//     const centralTimeString = dateCentral.format(); // ISO 8601 format

//     return centralTimeString
// }

const func = async () => {
    const startDate = new Date('2024-01-26');
    const endDate = new Date('2024-01-28');



    let obj=[]
    try {
      const bmwRecords = await prisma.bmw.findMany({
        where: {
            createdAT: {
              gte: startDate,
              lte: endDate,
            },
          },
      });

    //   for(let i=0;i<bmwRecords.length;i++){

    //     if(!bmwRecords[i]["PdfCreatedAt"]){
    //         obj.push(bmwRecords[i])
    //     }
    //   }

    

    //   console.log("bmwRecords:", bmwRecords); // Debugging log
    //   return obj;
      return bmwRecords;
    } catch (error) {
      console.error("Error fetching data:", error);
      throw error;
    }
  };




  export default withPageAuthRequired( async function Index() {
    let result= await func()
   
    // console.log(result)
  return (
    <div className='text-center'>
        
        <a>{result.length}</a>
    {result.map(item=>{
        return <div>
                    <h3>{item.PO}</h3>
                    <h4>{item.createdAT.toString()}</h4>
                </div>
    })}
    </div>
  );
},  { returnTo: '/server' }
);