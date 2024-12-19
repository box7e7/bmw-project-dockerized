const fs = require('fs').promises;
let getCookies= require('./getCookies_towbook_metro')
let dispatch=require('./dispatch_metro');
const downloadPDF=require("./getPdfFile_metro")
var _client = require("@prisma/client");
var prisma = new _client.PrismaClient();


async function upsertBMW(id, createData, updateData) {
    const bmw = await prisma.bmw.upsert({
        where: { "PO": id }, // Unique identifier to check if the record exists
        create: createData, // Data to create if the record doesn't exist
        update: updateData, // Data to update if the record exists
    });
    return bmw;
  }

let user={user:"Metro-roadside23",password:"fekatxmrt@23"} 
let file='./cookies_towbook_metro.json'

// let user1={user:"Momentum-roadside18",password:"fekaTXMRN@18"}
// let file1='./cookies_towbook.json'
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

async function executeSequentially(job) {
  
    try {
      


        // await getCookies(user, file);
        const currentWorkingDirectory = process.cwd();
    
        let result=await dispatch(`${currentWorkingDirectory}/scripts/cookies_towbook_metro.json`,job)
        console.log("&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&\n",job)
        result=result.data
        console.log("%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%\n",result)


        let call_id=result.callId
        const downloadUrl = `https://app.towbook.com/dispatch2/Invoice.aspx?id=${call_id}&pdf=1&download=1&showPrices=1`
        let invoice=await downloadPDF(downloadUrl)

        console.log("///***  result ***///",invoice)

        
        //  upsert bmw database with new values //
        if(invoice.filename){

            return await new Promise(resolve=>{
                let date = new Date()
                console.log(`${date.toLocaleString('en-US', options)}`)
                resolve(`${date.toLocaleString('en-US', options)}`)
              
                }).then(async res=>{
                 result["PdfCreatedAt"]=res
                let bmw=await upsertBMW(result.PO, result,result)

                console.log("//// bmw ////\n",bmw)
                return {bmw:bmw,invoice:invoice,callId:call_id}
                   
                })
                
        }
        else{
            return {invoice:invoice,callId:call_id}
        }


        

    } catch (error) {
        console.error(error);
        return {error:error}
    }
}

module.exports=executeSequentially


// executeSequentially()






















// const fs = require('fs').promises;


// const options = {
//     year: 'numeric',
//     month: '2-digit',
//     day: '2-digit',
//     hour: '2-digit',
//     minute: '2-digit',
//     second: '2-digit',
//     hour12: true,
//     timeZone: 'America/Chicago' 
//     };


// const func=async()=>{

//     let obj =  await fs.readFile('./jobsByMomentum_metro.json');
//     obj=JSON.parse(obj)

//     obj.forEach(elm=>{
//         elm["PdfCreatedAt"]=elm["dispached_date"]
//     })

//     await fs.writeFile('./jobsByMomentum_metro.json', JSON.stringify(obj, null, 2)); 

    

// }


// func()









