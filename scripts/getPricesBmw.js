const fs = require('fs').promises
const fetch = require('node-fetch');
const { resolve } = require('path');



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



const func0=async()=>{

    let obj =  await fs.readFile('./PricesBmw0.json');
    obj=JSON.parse(obj)

    // let jobsPrice=[]
    // count=0
    // obj.forEach(elm=>{


    //     let date = new Date(elm["createdAt"]);

    //     console.log(elm["jobNumber"],elm["price"],date.toLocaleString('en-US', options))
    //     jobsPrice.push({jobNumber:elm["jobNumber"],price:elm["price"],jobType:elm[ "jobType"]})
    //     count+=1

    // })

    let jobsPrice=[]
    let li_jobs=[]
    count=0
    obj.forEach(elm=>{


        let date = new Date(elm["createdAt"]);

        console.log(elm["jobNumber"],elm["price"],date.toLocaleString('en-US', options))
        
        if(li_jobs.includes(elm["jobNumber"])){

            for(let i=0;i<jobsPrice.length;i++){
                jobsPrice[i].jobNumber==elm["jobNumber"] ? jobsPrice[i].price=jobsPrice[i].price+elm["price"] : null
            }
            console.log("///// $$$$$$ /////", elm["jobNumber"],elm["price"])
        }
        else{
            jobsPrice.push({jobNumber:elm["jobNumber"],price:elm["price"],jobType:elm[ "jobType"]})
        }
       
        count+=1

        li_jobs.push(elm["jobNumber"])

    })

    
    await fs.writeFile('./jobsPrice.json', JSON.stringify(jobsPrice, null, 2));
    console.log("/// count ///", count)



}

// func0()




///////////////////////////////////////////////////////////////////////////////////////////

const func=async()=>{

    let auth_token_obj =  await fs.readFile('./cookies.json');
    let auth_token=JSON.parse(auth_token_obj)["data"][0]["authToken"]
    console.log("///////////////// auth token //////////////////////\n",auth_token)

    let timeNow=Date.now()
    console.log("//// timestamp ////",timeNow)

    // Get the current date
    const currentDate = new Date();

    // Calculate the date 15 days ago
    const fifteenDaysAgo = new Date(currentDate);
    fifteenDaysAgo.setDate(currentDate.getDate() - 15);

    // Get the timestamp in milliseconds for 15 days ago
    const timestamp_15DaysAgo = fifteenDaysAgo.getTime();
    console.log("//// timestamp 15 days ago ////",timestamp_15DaysAgo);

    // https://ops-apis.urgent.ly/v3//ops/provider_payments?size=10&createdAt=1698620400491&createdTill=1699311599177&providerUIds=d6164d60-abfb-44d1-af50-3af43c04f77b
    
    let url=`https://ops-apis.urgent.ly/v3//ops/provider_payments?page=0&size=300&createdAt=${timestamp_15DaysAgo}&createdTill=${timeNow}&providerUIds=d6164d60-abfb-44d1-af50-3af43c04f77b`
    let response=await fetch(`${url}`, {
    method: 'GET', 
    // mode: 'cors', 
    // cache: 'no-cache', 
    // credentials: 'same-origin',
    // 'Cache-Control': 'no-cache',
    
    headers: {
    'Content-Type': 'application/json; charset=UTF-8',
    'Accept-Encoding': 'gzip, deflate, br',
    'Connection': 'keep-alive',
    'auth-token': auth_token,

    }, 
})

    const result = await response.json();

    console.log(result)

    await fs.writeFile('./PricesBmw0.json', JSON.stringify(result["content"], null, 2));


}



// func()


const main=async()=>{
 await func()
 await func0()
}


main()