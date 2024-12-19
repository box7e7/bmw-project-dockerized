import { getAccessToken, withApiAuthRequired } from '@auth0/nextjs-auth0';
import { NextResponse } from 'next/server';
import { jwtDecode } from "jwt-decode";

export const GET = withApiAuthRequired(async function shows(req) {
  try {
    const res = new NextResponse();
    const { accessToken } = await getAccessToken(req, res);

    // const { accessToken } = await getAccessToken(req, res, {
    //   scopes: ['update:dbs']
    //   // scopes: ['read:shows']

      
    // });
    var decoded =jwtDecode(accessToken);
    console.log("///// decoded permission //////",decoded)


    console.log("//// accessToken ////\n",accessToken)
    // const apiPort = process.env.API_PORT || 3001;
    // const response = await fetch(`http://localhost:${apiPort}/api/shows`, {
    //   headers: {
    //     Authorization: `Bearer ${accessToken}`
    //   }
    // });
    // const shows = await response.json();

    // return NextResponse.json(shows, res);
    return NextResponse.json(decoded, res);

  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: error.status || 500 });
  }
});
