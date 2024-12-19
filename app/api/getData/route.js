import { getAccessToken, withApiAuthRequired } from '@auth0/nextjs-auth0';
import { NextResponse } from 'next/server';
import { jwtDecode } from "jwt-decode";
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const convertDateFormat = (inputDate) => {
  // Create a new Date object
  const date = new Date(inputDate);

  // Define options for date and time formatting
  const options = {
      year: 'numeric', month: '2-digit', day: '2-digit',
      hour: 'numeric', minute: '2-digit', second: 'numeric',
      hour12: true
  };

  // Format the date
  const formattedDate = new Intl.DateTimeFormat('en-US', options).format(date);

  return formattedDate;
};

const func = async () => {
    // Get today's date
    const today = new Date();
    // Add one day to get tomorrow's date
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    // substract 15 days 
    const last2weeks=new Date(today);
    last2weeks.setDate(tomorrow.getDate() - 60);
    
    const startDate = last2weeks
    const endDate = tomorrow;

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

      for(let i=0;i<bmwRecords.length;i++){

        if(!bmwRecords[i]["PdfCreatedAt"]){
            bmwRecords[i]["createdAT"]=convertDateFormat(bmwRecords[i]["createdAT"])
            obj.push(bmwRecords[i])
        }
      }

    //   console.log("bmwRecords:", bmwRecords); // Debugging log
    
      return obj;
    } catch (error) {
      console.error("Error fetching data:", error);
      throw error;
    }
  };



export const GET = withApiAuthRequired(async function shows(req) {
  try {
    const res = new NextResponse();
    const { accessToken } = await getAccessToken(req, res);

  
    var decoded =jwtDecode(accessToken);
    console.log("///// decoded permission //////",decoded.permissions)


    console.log("//// accessToken ////\n",accessToken)

    let result= await func()
    

    if(decoded.permissions.includes('read:dbs')){
      return NextResponse.json(result, res);
    }
    else{
      return NextResponse.json({ error: "Not Authorized" }, { status: 500 });
    }
 
    

  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: error.status || 500 });
  }
});
