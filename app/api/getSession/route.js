import { getAccessToken, withApiAuthRequired } from '@auth0/nextjs-auth0';
import { NextResponse } from 'next/server';
import { jwtDecode } from "jwt-decode";







export const GET = withApiAuthRequired(async function shows(req) {
  try {
    const res = new NextResponse();
    const { accessToken } = await getAccessToken(req, res);

  
    var decoded =jwtDecode(accessToken);
    console.log("///// decoded permission //////",decoded.permissions)

    console.log("//// accessToken ////\n",accessToken)

    // Extract expiration time and convert to Central Time
    const expTimestamp = decoded.exp * 1000; // Convert seconds to milliseconds
    const expDate = new Date(expTimestamp);
    const expCentralTime = new Date(expDate.toLocaleString('en-US', { timeZone: 'America/Chicago' }));


    

    // if(decoded.permissions.includes('read:dbs')){
    //   return NextResponse.json({"session":accessToken,"permissions":decoded.permissions}, res);
    // }
    // else{
    //   return NextResponse.json({ error: "Not Authorized" }, { status: 500 });
    // }

    return NextResponse.json({"session":accessToken,"permissions":decoded.permissions,"exp":expCentralTime}, res);
 
    

  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: error.status || 500 });
  }
});
