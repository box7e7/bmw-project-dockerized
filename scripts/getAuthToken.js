const fetch = require('node-fetch');
const fs = require('fs').promises
// Load environment variables
require('dotenv').config();

let user_urgently=process.env.URGENTLY_USER
let password_urgently=process.env.URGENTLY_PASSWORD

console.log(`user: ${user_urgently}`);
console.log(`password: ${password_urgently}`);



function isJsonString(str) {
    try {
      const json = JSON.parse(str);
      // Check if the result is an object or array
      if (typeof json === 'object' && json !== null) {
        return true;
      }
    } catch (error) {
      // The string is not valid JSON
    }
    return false;
  }

const func=async()=>{


    let obj0={
        email: user_urgently,
        password: password_urgently
    }

    let response=await fetch(`https://ops-apis.urgent.ly/v3//ops/login`, {
                      
                        method: 'POST', 
                        // cache: 'no-cache', 
                        
                        headers: {
                            'Content-Type': 'application/json; charset=UTF-8',
                            'Accept-Encoding': 'gzip, deflate, br',
                            'Connection': 'keep-alive',
                        }, 
                        body:JSON.stringify(obj0)
                      })

        // console.log(response)  

        let result

        if(isJsonString(response)){
            result = await response.json();
        }
        else{
            result = await response.text();
        }
        

    await fs.writeFile('./cookies.json', result);
}



func()
