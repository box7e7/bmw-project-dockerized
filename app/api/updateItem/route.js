import { getAccessToken, withApiAuthRequired } from '@auth0/nextjs-auth0';
import { NextResponse } from 'next/server';
import { jwtDecode } from "jwt-decode";
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function upsertBMW(id, createData, updateData) {
    const bmw = await prisma.bmw.upsert({
        where: { "PO": id }, // Unique identifier to check if the record exists
        create: createData, // Data to create if the record doesn't exist
        update: updateData, // Data to update if the record exists
    });
    return bmw;
  }



export const GET = withApiAuthRequired(async function update(req) {
  try {
    const res = new NextResponse();
    const { accessToken } = await getAccessToken(req, res);

    const { searchParams } = new URL(req.url)
    let obj = searchParams.get('obj')
   

  
    var decoded =jwtDecode(accessToken);
    console.log("///// decoded permission //////",decoded.permissions)


    console.log("//// accessToken ////\n",accessToken)

    let {id,...remove_id}=JSON.parse(obj)
    let update_data=remove_id

    // Parse the date string into a Date object
    const date = new Date(update_data.createdAT);

    // Convert to ISO-8601 format
    const isoString = date.toISOString();
    update_data.createdAT=isoString

    // console.log("$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$\n",update_data.PO,update_data)

   


    

    if(decoded.permissions.includes('update:dbs')){
      
      let bmw=await upsertBMW(update_data.PO, update_data, update_data) 
      return NextResponse.json(bmw, res);
    }
    else{
      return NextResponse.json({ error: "Not Authorized" }, { status: 500 });
    }
 
    

  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: error.status || 500 });
  }
});
