import { getAccessToken, withApiAuthRequired } from '@auth0/nextjs-auth0';
import { NextResponse } from 'next/server';
import { jwtDecode } from "jwt-decode";
const dispatch_getInvoice=require('/scripts/dispatch_getInvoice');



// let job= {
//     vehicle: {
//        color: null,
//        make: 'BMW',
//        model: 'X5',
//        vin: '5UX13EU06R9S90755',
//        year: '2024'
//      },
//      DriverName: 'Fayssal   Fekair',
//      PO: 7575727,
//      PdfCreatedAt: null,
//      callId: null,
//      casePO: '6073605',
//      completed: '01/29/2024, 08:03:54 AM',
//      contact: 'Chirag Parekh',
//      createdAT: '01/29/2024, 7:09:19 AM',
//      dispached_date: null,
//      driverIdTowbook: 392043,
//      price: 150,
//      service: 'TOW',
//      serviceType: 'Towing',
//      towFrom: '1237 Du Barry Ln, Houston, TX 77018, USA',
//      towTo: '9570 Southwest Freeway,Houston TX 77074',
//      update: null
//    }



export const POST = withApiAuthRequired(async function shows(req) {
  try {
    const res = new NextResponse();
    const { accessToken } = await getAccessToken(req, res);

    const job = await req.json()
    // job=JSON.parse(job)

    console.log("$$$$$ job $$$$$$$\n",job)

  
    var decoded =jwtDecode(accessToken);
    console.log("///// decoded permission //////",decoded.permissions)


    console.log("//// accessToken ////\n",accessToken)

   
    

    if(decoded.permissions.includes('read:dbs')){
      let result=await dispatch_getInvoice(job)
      console.log("############################################\n",result)
      return NextResponse.json(result, res);
    // return NextResponse.json(job, res);
    }
    else{
      return NextResponse.json({ error: "Not Authorized" }, { status: 500 });
    }
 
    

  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: error.status || 500 });
  }
});

  

// export const GET = withApiAuthRequired(async function shows(req) {
//   try {
//     const res = new NextResponse();
//     const { accessToken } = await getAccessToken(req, res);

//     const { searchParams } = new URL(req.url)
//     let job = JSON.parse(searchParams.get('job'))
//     // job=JSON.parse(job)

//     console.log("$$$$$ job $$$$$$$\n",job)

  
//     var decoded =jwtDecode(accessToken);
//     console.log("///// decoded permission //////",decoded.permissions)


//     console.log("//// accessToken ////\n",accessToken)

   
    

//     if(decoded.permissions.includes('read:dbs')){
//       let result=await dispatch_getInvoice(job)
//       console.log("############################################\n",result)
//       return NextResponse.json(result, res);
//     // return NextResponse.json(job, res);
//     }
//     else{
//       return NextResponse.json({ error: "Not Authorized" }, { status: 500 });
//     }
 
    

//   } catch (error) {
//     return NextResponse.json({ error: error.message }, { status: error.status || 500 });
//   }
// });