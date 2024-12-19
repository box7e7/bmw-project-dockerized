const fs = require('fs').promises
const fetch = require('node-fetch');
const { resolve } = require('path');
var _client = require("@prisma/client");
const { copyFileSync } = require('fs');
var prisma = new _client.PrismaClient();
const moment = require('moment');


let momentum_towing_drivers_uid_metro =[
    {'uid': 'e09deb6f-8721-4166-ae32-ea0790a2b094', 'driver_name': 'ABU SALIM SAMER',      'driver_id_towbook':401438},
    {'uid': 'e09deb6f-8721-4166-ae32-ea0790a2b094', 'driver_name': 'SAMER ABU SALIM',      'driver_id_towbook':401438},
    {'uid': '0999c017-2c0d-4f99-8f05-7611a3a19da8', 'driver_name': 'Ahmad Masadeh',        'driver_id_towbook':401436},
    {'uid': '0999c017-2c0d-4f99-8f05-7611a3a19da8', 'driver_name': 'AHMAD MESSAADAH',       'driver_id_towbook':401436},
    {'uid': '5d29c7ff-c7aa-4411-a6a7-fe793d221ef2', 'driver_name': 'Bassam Al Widian',     'driver_id_towbook':401437},
    {'uid': 'a1e91e32-5329-457a-914e-1193a6a2adf8', 'driver_name': 'Billy Johnson',        'driver_id_towbook':412748},
    {'uid': '23484f5c-7020-43ff-80d3-73594daf8d7a', 'driver_name': 'Demetrius Cornelius',  'driver_id_towbook':470489},
    {'uid': '79beb75e-694e-4789-8a44-d6a911a4e601', 'driver_name': 'DRIVER Kamal Kacha',   'driver_id_towbook':470490},
    {'uid': '79beb75e-694e-4789-8a44-d6a911a4e601', 'driver_name': 'Kamal Kacha',          'driver_id_towbook':470490},
    {'uid': '6aecbbfd-3491-4453-b3ff-e4e9fddffd50', 'driver_name': 'Dr Mohanad Yassen',    'driver_id_towbook':470488},
    {'uid': '6aecbbfd-3491-4453-b3ff-e4e9fddffd50', 'driver_name': 'MOHANAD W YASEEN',     'driver_id_towbook':470488},
    {'uid': '6aecbbfd-3491-4453-b3ff-e4e9fddffd50', 'driver_name': 'Mohanad Walid',        'driver_id_towbook':470488},
    {'uid': '19eb1dc7-e882-4587-900f-2b7864d0500c', 'driver_name': 'NAJDAT AFANDE',        'driver_id_towbook':514287},
    {'uid': '6aecbbfd-3491-4453-b3ff-e4e9fddffd50', 'driver_name': 'Driver Mohanad Walid', 'driver_id_towbook':470488},
    {'uid': '1c5d36df-e5af-4812-89df-61716b5624c3', 'driver_name': 'Fayssal Fekair',       'driver_id_towbook':392043},
    {'uid': 'c4e550fc-82c0-44ae-b13a-5a5e5de35f77', 'driver_name': 'Gabriel Trevin Rounds','driver_id_towbook':401439},
    {'uid': '24f0de64-e38d-410c-8820-6d5201ca75bb', 'driver_name': 'Hamid Messaoud',       'driver_id_towbook':409326},
    {'uid': '667e7cf7-b26e-4885-a8f7-306c6b9a842f', 'driver_name': 'Hamzeh Bashaireh',     'driver_id_towbook':470491},
    {'uid': '667e7cf7-b26e-4885-a8f7-306c6b9a842f', 'driver_name': 'HAMZA BASHAIREH',      'driver_id_towbook':470491},
    {'uid': '060fb321-ec22-4211-aa64-cc840e54e26d', 'driver_name': 'JAAOUI YOUCEF',        'driver_id_towbook':403534},
    {'uid': 'e50572f0-4a95-4762-857c-93e68de20ceb', 'driver_name': 'James leonard',        'driver_id_towbook':401440},
    {'uid': 'e50572f0-4a95-4762-857c-93e68de20ceb', 'driver_name': 'Driver James leonard', 'driver_id_towbook':401440},
    {'uid': null,                                   'driver_name': 'TREVIN ROUNDS',        'driver_id_towbook':470487},
    {'uid': null,                                   'driver_name': 'James Jefferson',      'driver_id_towbook':538704},
    {'uid': null,                                   'driver_name': 'Yazan bashar',         'driver_id_towbook':538705},
    {'uid': null,                                   'driver_name': 'Dementry cloud',      'driver_id_towbook':538706},
    {'uid': null,                                   'driver_name': 'aHMAD   ALNSAIRAT',    'driver_id_towbook':401439},
    {'uid': null,                                   'driver_name': 'AMIR BENJAMIN',    'driver_id_towbook':563981},
]




let drivers_li=[]
let pattern = /\(Momentum Towing/;
momentum_towing_drivers_uid_metro.forEach(el=>{
    drivers_li.push(el.driver_name.toLowerCase().replace(/\s/g, ''))
})



let drivers_uid={}
momentum_towing_drivers_uid_metro.forEach(el=>{
    
    drivers_uid[el.driver_name.toLowerCase().replace(/\s/g, '')]=el.driver_id_towbook
})

console.log(drivers_uid)


const searchForJob=async(po)=>{
    let url=`https://app.towbook.com/api/calls/Search?page=1&quick=${po}`

    const currentWorkingDirectory = process.cwd();
    // console.log("#### currentWorkingDirectory #######",currentWorkingDirectory);
    const cookiesString = await fs.readFile(`${currentWorkingDirectory}/cookies_towbook18.json`);
    let cookies = JSON.parse(cookiesString);


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


        return await fetch(url, {
            //  Authorization : `Basic ${credentials}`,
              method: 'GET', 
              // mode: 'cors', 
              cache: 'no-cache', 
              credentials: 'same-origin',
              'Cache-Control': 'no-cache',
              
              headers: {
                'Accept': 'application/json',
                'Accept-Encoding': 'gzip, deflate, br',
                'Accept-Language': 'en-US,en;q=0.9',
                'Connection': 'keep-alive',
                'Cookie': res,
                'Host': 'app.towbook.com',
                'Origin': 'https://app.towbook.com',                                    
              }
              
              // body:body
            }).then(async res=>{
                        
                        
                        return await res.text()
                      }).then(data=>{
                        // console.log("///// received data from fetch post dispatch //////\n",data)
                        // console.log(JSON.parse(data))
                        return JSON.parse(data)
                        
                        
                        
                      })
              .catch(e=>{
          
                console.log("///// error from dispatch fetch GET /////\n",e)
                return {error:e}
                                          
              }) 


      })

    }

const func=async()=>{

    let auth_token_obj =  await fs.readFile('./cookies.json');
    let auth_token=JSON.parse(auth_token_obj)["data"][0]["authToken"]
    console.log("///////////////// auth token //////////////////////\n",auth_token)

    let active_jobs=[]
   
    let update_jobDetails0=[]

    async function getAllBMWs() {
    const allBMWs = await prisma.bmw.findMany({
        where:{
            update: true,
        }
    });
    return allBMWs;
    }

    let updateJobs=await getAllBMWs()
    console.log("//// update jobs /////\n",updateJobs)

    await new Promise(resolve=>{
        resolve(updateJobs)
    }).then(async res=>{

        
        for(let i=0;i<res.length;i++){
            let url=`https://ops-apis.urgent.ly/v3//ops/providers/jobs/${res[i].PO}/dispatch`
            
            let response=await fetch(url, {
            method: 'GET', 
            // mode: 'cors', 
            cache: 'no-cache', 
            credentials: 'same-origin',
            'Cache-Control': 'no-cache',
            
            headers: {
            'Content-Type': 'application/json; charset=UTF-8',
            'Accept-Encoding': 'gzip, deflate, br',
            'Connection': 'keep-alive',
            'auth-token': auth_token,
    
            }, 
        
        })
    
        let result0 = await response.json();
        // obj0.push(result)
    
        
        url=`https://ops-apis.urgent.ly/v3/ops/cases/${res[i]["casePO"]}`
    
        response=await fetch(url, {
        method: 'GET', 
        // mode: 'cors', 
        cache: 'no-cache', 
        credentials: 'same-origin',
        'Cache-Control': 'no-cache',
    
        headers: {
        'Content-Type': 'application/json; charset=UTF-8',
        'Accept-Encoding': 'gzip, deflate, br',
        'Connection': 'keep-alive',
        'auth-token': auth_token,
    
        }, 
    
        })
    
        let result1 = await response.json();
        // obj0.push({0:result0,1:result1})
        update_jobDetails0.push({0:result0,1:result1})
        }
    })

  


// /////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    




    let response=await fetch(`https://ops-apis.urgent.ly/v3/ops/users/66525/jobs?state=1&offset=0&limit=50`, {
        method: 'GET', 
        // mode: 'cors', 
        cache: 'no-cache', 
        credentials: 'same-origin',
        'Cache-Control': 'no-cache',
        
        headers: {
        'Content-Type': 'application/json; charset=UTF-8',
        'Accept-Encoding': 'gzip, deflate, br',
        'Connection': 'keep-alive',
        'auth-token': auth_token,

        }, 
    })

    const result = await response.json();
   
    console.log("//// all jobs /////",result["data"].length)

    
    count=0
    for(let i=0;i<result["data"].length;i++){

        
        
        
        const bmwRecord = await prisma.bmw.findUnique({
            where: {
                "PO": parseInt(result["data"][i].service.number),
            },
        });

       

        

        if(!bmwRecord){
            
            if(drivers_li.includes(result["data"][i].provider.firstName?.replace(/\s*\([^)]*\)/, '').replace(pattern, "").replace(',', '').replace(/\s/g, '').toLowerCase())){
                count+=1
                console.log(count,result["data"][i].service.number,result["data"][i].provider.firstName)
                active_jobs.push(result["data"][i])
            } 
            else{
                
                console.log("//// driver not in the list /////",result["data"][i].provider.firstName,parseInt(result["data"][i].service.number)) 
                if(!result["data"][i].provider.firstName?.includes("Gabe")){
                    active_jobs.push(result["data"][i])

                
                }    
            }

        }
        else if(bmwRecord){
          
          
            if(!bmwRecord["dispached_date"]){

                active_jobs.push(result["data"][i])
                
            }

        }
        else{
            // console.log("$$$$$$$$$$$$$$$$$$$","//// driver found ////")
            if(bmwRecord.update==true){
                console.log("///// update //////",bmwRecord)
            }
        }
    }
        
   

////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////// get jobs details ////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////

async function getActiveJobDetails(active_jobs){

        let jobDetails0=[]
        for(let i=0;i< active_jobs.length;i++){

            let url=`https://ops-apis.urgent.ly/v3//ops/providers/jobs/${active_jobs[i]["service"]["number"]}/dispatch`
            // url=`https://ops-apis.urgent.ly/v3/ops/cases/${el["caseDTO"]["id"]}`
    
            let response=await fetch(url, {
            method: 'GET', 
            // mode: 'cors', 
            cache: 'no-cache', 
            credentials: 'same-origin',
            'Cache-Control': 'no-cache',
            
            headers: {
            'Content-Type': 'application/json; charset=UTF-8',
            'Accept-Encoding': 'gzip, deflate, br',
            'Connection': 'keep-alive',
            'auth-token': auth_token,
    
            }, 
        
        })
    
        let result0 = await response.json();
        // obj0.push(result)
    
        
        url=`https://ops-apis.urgent.ly/v3/ops/cases/${active_jobs[i]["caseDTO"]["id"]}`
    
        response=await fetch(url, {
        method: 'GET', 
        // mode: 'cors', 
        cache: 'no-cache', 
        credentials: 'same-origin',
        'Cache-Control': 'no-cache',
    
        headers: {
        'Content-Type': 'application/json; charset=UTF-8',
        'Accept-Encoding': 'gzip, deflate, br',
        'Connection': 'keep-alive',
        'auth-token': auth_token,
    
        }, 
    
        })
    
        let result1 = await response.json();
        // obj0.push({0:result0,1:result1})
        jobDetails0.push({0:result0,1:result1})
    
        // await fs.writeFile('./jobDetails0.json', JSON.stringify(obj0, null, 2));
        // await fs.writeFile('./jobDetails000.json', JSON.stringify(jobDetails0, null, 2));
    
        }

        return jobDetails0
        
  }

////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////// get jobs details ////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////

let xxx=await getActiveJobDetails(active_jobs)
console.log("//// xxx ////", xxx)



let prices_obj =  await fs.readFile('./jobsPrice.json');
prices_obj=JSON.parse(prices_obj)
console.log("prices_obj", prices_obj.length)

////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////// extract jobs details ////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////

async function extractActiveJobDetails(momentum_towing_drivers_uid,prices_obj,obj){

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

    let li_uid=[]
    let dict_drivers={}
    let list_drivers={}
    momentum_towing_drivers_uid.forEach(elem => {
    

    li_uid.push(elem["uid"])
    dict_drivers[elem["uid"]]=elem["driver_id_towbook"]
    list_drivers[elem["driver_name"].toLowerCase().replace(/\s/g, '')]=elem.driver_id_towbook
    });


    let count=0
    let jobs=[]
    let sum=0

    obj.forEach(el=>{
        // console.log(el["data"][0]["caseDTO"]["id"],el["data"][0]["provider"]?.["driverId"])

        let timestampInMilliSeconds=el[1]["createdAt"]
        let date = new Date(timestampInMilliSeconds);
        

        let PO=el[0]["data"][0]["service"]["number"]
       
        
        let casePO=el[1]["jobs"][0]["caseDTO"]["id"]
        let DriverName=`${el[0]["data"][0]["provider"]?.["firstName"]}  ${el[0]["data"][0]["provider"]?.["lastName"]}`.replace(/\s*\([^)]*\)/, '').replace(/DRIVER/g, '')
        DriverName=DriverName.replace("(","").replace(")","").replace("Momentum Towing","")
        let createdAT=`${date.toLocaleString('en-US', options)}`
        let towFrom=el[1]["jobs"][0]["location"]?.["address"]
        let towTo=el[1]["jobs"][0]["dropOffLocation"]?.["address"]
        let service= el[1]["jobs"][0]["service"]["serviceType"]
        let contact= el[1]["jobs"][0]["personalInfo"]?.["name"]
        let vehicle={}
        vehicle["make"]=el[1]["jobs"][0]["vehicle"]["make"]
        vehicle["model"]=el[1]["jobs"][0]["vehicle"]["model"]
        vehicle["year"]=el[1]["jobs"][0]["vehicle"]["year"]
        vehicle["color"]=el[1]["jobs"][0]["vehicle"]["color"]
        vehicle["vin"]=el[1]["jobs"][0]["vehicle"]["vin"]

        timestampInMilliSeconds=el[1]["jobs"][0]["service"]["completeTimestamp"]
        date = new Date(timestampInMilliSeconds);
        let completed=`${date.toLocaleString('en-US', options)}`
         let price
         let serviceType


         prices_obj.forEach(el=>{
            // console.log(el["jobNumber"])
            el["jobNumber"]==PO ? price=el["price"] : null
            el["jobNumber"]==PO ? serviceType=el["jobType"] : null
            el["jobNumber"]==PO ? sum=sum+el["price"] : null

        })

        console.log("//// $$$$ /////",el[1]["jobs"][0]["caseDTO"]["id"],el[1]["jobs"][0]["location"]?.["address"],price)



       


        // li_uid.includes(el["data"][0]["driverDTO"]?.["technicianUid"]?.trim()) ? console.log(count,PO,casePO,service, `${DriverName} ${createdAT}`, towFrom, towTo, contact, vehicle, sum) : null
        jobs.push({PO:PO,casePO:casePO,DriverName:DriverName,driverIdTowbook:list_drivers[DriverName.toLowerCase().replace(/\s/g, '').trim()],createdAT:createdAT,completed:completed,towFrom:towFrom,towTo:towTo,service:service,serviceType:serviceType,contact:contact,vehicle:vehicle,price:price ? price : 0})
        // jobs.push({PO:PO,casePO:casePO,DriverName:DriverName,driverIdTowbook:dict_drivers[el[1]["jobs"][0]["driverDTO"]?.["technicianUid"]?.trim()],createdAT:createdAT,completed:completed,towFrom:towFrom,towTo:towTo,service:service,serviceType:serviceType,contact:contact,vehicle:vehicle,price:price ? price : null})
        // dict_drivers[el[1]["jobs"][0]["driverDTO"]?.["technicianUid"]?.trim()] ?  jobs.push({PO:PO,casePO:casePO,DriverName:DriverName,driverIdTowbook:dict_drivers[el[1]["jobs"][0]["driverDTO"]?.["technicianUid"]?.trim()],createdAT:createdAT,completed:completed,towFrom:towFrom,towTo:towTo,service:service,serviceType:serviceType,contact:contact,vehicle:vehicle,price:price ? price : null}) : null
        // }


        count+=1
    })

    return jobs





}
////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////// extract jobs details ////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////
 
let result0=await extractActiveJobDetails(momentum_towing_drivers_uid_metro,prices_obj,xxx)
let result01=await extractActiveJobDetails(momentum_towing_drivers_uid_metro,prices_obj,update_jobDetails0)


console.log("////// result0 /////\n",result0)
console.log("////// result01 /////\n",result01)



let obj00=[]
await new Promise(async resolve=>{
    
    for(let i=0;i< result01.length;i++){
        result01[i].update=true
        if(result01[i].PO==updateJobs[i].PO){
            result01[i].PdfCreatedAt=updateJobs[i].PdfCreatedAt
            result01[i].dispached_date=updateJobs[i].dispached_date
            result01[i].callId=updateJobs[i].callId
            obj00.push(result01[i])
        }
       
    }

    for(let i=0;i< result0.length;i++){
        obj00.push(result0[i])
    }

    resolve(obj00)
}).then(res=>{
    obj00=res
})

await fs.writeFile('./jobsToDispatch_metro.json', JSON.stringify(obj00, null, 2));




////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////// update BMW datebase mongodb /////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////

async function upsertBMW(id, createData, updateData) {
    const bmw = await prisma.bmw.upsert({
        where: { "PO": id }, // Unique identifier to check if the record exists
        create: createData, // Data to create if the record doesn't exist
        update: updateData, // Data to update if the record exists
    });
    return bmw;
  }


let upsertBmwObj=async function(obj){

    for(let i=0;i<obj.length;i++){


        await new Promise(resolve=>{
            // Parse the date string using moment.js
        const parsedDate = moment(obj[i]["createdAT"], 'MM/DD/YYYY, hh:mm:ss A');
        // Convert to ISO-8601 format
        const isoDateString = parsedDate.toISOString();
        resolve(isoDateString)
        }).then(async res=>{

            if(obj[i].DriverName.includes("undefined")){
                let job=await searchForJob(obj[i].PO)
                // console.log("$$$$$$$$$$$$$ job $$$$$$$$$$$$$$$$$$\n",job)
                let driver=job[0].assets[0].driver.name
                console.log("$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$")
                console.log(obj[i].PO,"$$$$$$$$$$$$$$$ undefined driver name $$$$$$$$$$$$$$$$",driver)
                console.log("$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$")
                obj[i].DriverName=driver
                obj[i].driverIdTowbook=drivers_uid[driver.toLowerCase().replace(/\s/g, '')]
                
            }
            // console.log("$$$$$$$$$$$$$ drievr name $$$$$$$$$$$$$$$$\n",obj[i].DriverName)
            obj[i]["createdAT"]=res
            // console.log("$$$$$$$$$$$$$$$$$$$$\n",result0[i],res)
        })
    
        
        let bmw=await upsertBMW(obj[i]["PO"],obj[i],obj[i])
        console.log("//// bmw upsert to database ////\n",bmw)
    }
}

await upsertBmwObj(obj00)

}

func()
