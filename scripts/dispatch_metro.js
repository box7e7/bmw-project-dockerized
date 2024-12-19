const fetch = require('node-fetch');
// var _client = require("@prisma/client");
// var prisma = new _client.PrismaClient();
const fs = require('fs').promises;
const moment = require('moment');
let body=require('./towbook_completedCall_metro');
const { resolve } = require('path');



async function upsertBMW(id, createData, updateData) {
  const bmw = await prisma.bmw.upsert({
      where: { "PO": id }, // Unique identifier to check if the record exists
      create: createData, // Data to create if the record doesn't exist
      update: updateData, // Data to update if the record exists
  });
  return bmw;
}


// let drivers_id =[
//   { 'driver_name': 'ABU SALIM SAMER',      'driver_id_towbook':401438},
//   { 'driver_name': 'Ahmad Masadeh',        'driver_id_towbook':401436},
//   { 'driver_name': 'Bassam Al Widian',     'driver_id_towbook':401437},
//   { 'driver_name': 'Billy Johnson',        'driver_id_towbook':412748},
//   { 'driver_name': 'Demetrius Cornelius',  'driver_id_towbook':470489},
//   { 'driver_name': 'Kamal Kacha',          'driver_id_towbook':470490},
//   { 'driver_name': 'Mohanad Walid',        'driver_id_towbook':470488},
//   { 'driver_name': 'Fayssal Fekair',       'driver_id_towbook':392043},
//   { 'driver_name': 'Gabriel Trevin Rounds','driver_id_towbook':401439},
//   { 'driver_name': 'Hamid Messaoud',       'driver_id_towbook':409326},
//   { 'driver_name': 'Hamzeh Bashaireh',     'driver_id_towbook':470491},
//   { 'driver_name': 'JAAOUI YOUCEF',        'driver_id_towbook':403534},
//   { 'driver_name': 'James leonard',        'driver_id_towbook':401440},
//   { 'driver_name': 'aHMAD   ALNSAIRAT',    'driver_id_towbook':470487},

// ]



// let list_drivers={}
// drivers_id.forEach(elem => {
//   list_drivers[elem["driver_name"].replace(/\(Momentum Towing\)/g, '').replace(/\s*\([^)]*\)/, '').toLowerCase().replace(/\s/g, '')]=elem.driver_id_towbook
// });

// console.log(list_drivers)


let reason={"Jump Start":365,"Auto Lockout":364,'Flat Tire':1513,'Towing':6,'Stuck':3,'Fuel':366}




const func=async (cookies_path,jobs)=>{
  
  
  // const cookiesString = await fs.readFile('./cookies_towbook_metro.json');
  const cookiesString = await fs.readFile(cookies_path);
  let cookies = JSON.parse(cookiesString);

  // console.log("/////$$$$$ cookies $$$$//////",cookies)

  const options = {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
    timeZone: 'America/Chicago' 
    };



 
  // let jsonData = await fs.readFile(jobs);

  let jsonData = [jobs]


  console.log("*********************************************/n",jsonData)

 

  // console.log(jsonData[0])

  return await new Promise((resolve,reject)=>{
    ////////// Get cookies for authentication ///////////
    let NET_SessionId
    let intercom_session
    let xtl
    let X_Session_Timeout
    
    for (let i=0;i<cookies.length;i++){
      
      if( cookies[i].name==='ASP.NET_SessionId'){
       NET_SessionId=cookies[i].value
      }
      else if(cookies[i].name==='intercom-session-kw06m3f5'){
        intercom_session=cookies[i].value
      }
      else if(cookies[i].name==='.xtl'){
        xtl=cookies[i].value
      }
      else if(cookies[i].name==='X-Session-Timeout'){
        X_Session_Timeout=cookies[i].value
      }
      
    }
    resolve(`'ASP.NET_SessionId=${NET_SessionId}; intercom-session-kw06m3f=${intercom_session}; .xtl=${xtl}; X-Session-Timeout=${X_Session_Timeout}'`)
    /////////////   Cookies are resolved  /////////////////////
  }).then(async res=>{
    
   
    // console.log("/////$$$$$ cookies from res $$$$//////",res)

    let jobsDone=[]
    
    // for(let i=0;i<jsonData.length;i++){
    for(let i=0;i<jsonData.length;i++){
       
      
      // if(!jsonData[i].callId  && !jsonData[i]["DriverName"].toLowerCase().includes("alnsairat")){
      // if(!jsonData[i].callId){  
      if(!jsonData[i].PdfCreatedAt){ 
            // #################################################

                
            console.log("#######################################################")
            console.log(`########################## ${i} #######################`)
            console.log("#######################################################")
            console.log(jsonData[i])
            console.log("#######################################################")
            console.log(`########################## ${i} #######################`)
            console.log("#######################################################")

              /////////////////////////////////////////////////////////////////////////////////////////// 
              let obj0
              await new Promise(resolve=>{
                resolve(body)
              }).then(res=>{

                let driverId
                // driverId=list_drivers[jsonData[i].DriverName.replace(/\(Momentum Towing\)/g, '').replace(/\s*\([^)]*\)/, '').toLowerCase().replace(/\s/g, '')]
                driverId=jsonData[i].driverIdTowbook
                console.log("//// driver id /////",driverId)

                res.data.contacts[0].name=jsonData[i].contact
                // res.data.contacts[0].phone=jsonData["customer info"]["phone number"]
                body.data.contacts[0].email="daniela.hernandezfernandez@momentumbmw.net"
                res.data.towSource= jsonData[i].towFrom
                res.data.towDestination= jsonData[i].towTo
                res.data.waypoints[0].address=  jsonData[i].towFrom
                res.data.waypoints[1].address=jsonData[i].towTo
                res.data.assets[0].year=jsonData[i].vehicle.year
                res.data.assets[0].make=jsonData[i].vehicle.make
                res.data.assets[0].model=jsonData[i].vehicle.model
                res.data.assets[0].vin=jsonData[i].vehicle.vin
                res.data.assets[0].drivers[0].driver.id=driverId
                // res.data.assets[0].drivers[0].driver.id=401438
                // res.data.notes=additionalArgument

                res.data.purchaseOrderNumber=jsonData[i].PO
                res.data.invoiceNumber=jsonData[i].PO
                res.data.attributes[0].value=jsonData[i].PO

                res.data.commissions.drivers[0].driverId=driverId
                // res.data.assets[0].drivers[0].driver.id=401438

                let arr=jsonData[i].createdAT.toLowerCase().split(",")
                let createdAT=[arr[0],arr[1].split(" ").join("")].join(" ")
                
                let arr1=jsonData[i].completed.toLowerCase().split(",")
                let completed=jsonData[i].completed
                console.log(completed)
                completed=='Invalid Date' ? [arr[0],arr[1].split(" ").join("")].join(" ")  : [arr1[0],arr1[1].split(" ").join("")].join(" ")
                
                res.data.createDate=createdAT
                // res.data.completionTime=completed
                completed=='Invalid Date' ?  res.data.completionTim=createdAT : res.data.completionTime=completed
                
                // body.data.assets[0].color={'id':6}

                console.log("/////// resons ///////",reason[jsonData[i].serviceType] )
                res.data.reason.id=reason[jsonData[i].serviceType] ? reason[jsonData[i].serviceType] : 6

                res.data.invoiceSubtotal=jsonData[i].price
                res.data.invoiceTotal=jsonData[i].price
                res.data.invoiceItems[0].price=jsonData[i].price
                res.data.invoiceItems[0].itemTotal=jsonData[i].price

                obj0=res.data
                console.log(obj0)
              })


            console.log("/////$$$$$ cookies from res $$$$//////",res)
              
            let call_id
            await fetch('https://app.towbook.com/api/calls/?deleteMissingAssets=true', {
                                        //  Authorization : `Basic ${credentials}`,
                                          method: 'POST', 
                                          // mode: 'cors', 
                                          cache: 'no-cache', 
                                          credentials: 'same-origin',
                                          'Cache-Control': 'no-cache',
                                          
                                          headers: {
                                            'Accept': 'application/json,text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
                                            'Accept-Encoding': 'gzip, deflate, br',
                                            'Accept-Language': 'en-US,en;q=0.9',
                                          'Connection': 'keep-alive',
                                            'Cookie': res,
                                            'Host': 'app.towbook.com',
                                            'Origin': 'https://app.towbook.com',
                                            // 'Pragma': 'no-cache',
                                            // 'Referer': 'https://app.towbook.com/Security/Login.aspx?ReturnUrl=%2f'


                                          }, 
                                          body:JSON.stringify(obj0) 
                                          // body:body
                                        }).then(async res=>{
                                                    // resolve({response:res.ok,status:res.status})
                                                    // console.log(res)
                                                    // console.log(res.body)
                                                    console.log("///// header sent with post fetch dispatch //////\n",{...res.headers})
                                                    return await res.text()
                                                  }).then(data=>{
                                                    console.log("///// received data from fetch post dispatch //////\n",data)
                                                    console.log(JSON.parse(data))
                                                    console.log("////// call id //////",JSON.parse(data).id)
                                                    call_id=JSON.parse(data).id
                                                    
                                                  })
                                          .catch(e=>console.log("///// error from dispatch fetch post /////\n",e)) 

            ///////////////////////////////////////////////////////////////////////////////////////////////////////

           

            await new Promise(resolve=>{
            setTimeout(()=>{
              let date = new Date()
              call_id ? jsonData[i]["callId"]=call_id : null
              call_id ? jsonData[i]["dispached_date"]= `${date.toLocaleString('en-US', options)}` : null
              resolve("//// timeout done /////")
            },500)
            }).then(res=>{
            console.log(res)
            })      

            // await fs.writeFile('./jobsByMomentum_metro.json', JSON.stringify(jsonData, null, 2)); 
            

            await new Promise(resolve=>{
              // Parse the date string using moment.js
              const parsedDate = moment(jsonData[0]["createdAT"], 'MM/DD/YYYY, hh:mm:ss A');
              // Convert to ISO-8601 format
              const isoDateString = parsedDate.toISOString();
              resolve(isoDateString)
              }).then(res=>{
                jsonData[0]["createdAT"]=res
                  // console.log("$$$$$$$$$$$$$$$$$$$$\n",result0[i],res)
              })


            // let bmw=await upsertBMW(jsonData[0].PO, jsonData[0],jsonData[0])


            return {data:jsonData[0]}
            // return {callId:jsonData[0]["callId"],bmw:bmw}
            // return {callId:jsonData[0]["callId"]}

            // ################################################# 
        } 
      else{
        return {error:"pdf file already ccreated"}
      }  
      

    }
  })
  

  
}


module.exports = func;
// func()

