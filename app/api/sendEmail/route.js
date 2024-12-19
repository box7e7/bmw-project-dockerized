import { getAccessToken, withApiAuthRequired } from '@auth0/nextjs-auth0';
import { NextResponse } from 'next/server';
import { jwtDecode } from "jwt-decode";
import { exec } from 'child_process'

const currentWorkingDirectory = process.cwd();

export const GET = withApiAuthRequired(async function shows(req) {


    try {
      const res = new NextResponse();
      const { accessToken } = await getAccessToken(req, res);
  
    
      var decoded =jwtDecode(accessToken);
      console.log("///// decoded permission //////",decoded.permissions)
  
  
      console.log("//// accessToken ////\n",accessToken)
  
      
      
  
      if(decoded.permissions.includes('update:dbs')){
        

     
    


        return await new Promise(resolve=>{
            
            exec(`bash ${currentWorkingDirectory}/scripts/exec.sh`, (error, stdout, stderr) => {
                if (error) {
                  console.error(`Execution error: ${error}`);
                  resolve({error:error})
                  
                }
                if (stderr) {
                  console.error(`stderr: ${stderr}`);
                  resolve({stdrr:stderr})
                  
                  
                }
                console.log(`stdout: ${stdout}`);
                resolve({stdout:stdout})
                
              });
        }).then(res=>{
            if(res.error){
                return NextResponse.json({ error: `Execution error: ${res.error.message}` }, { status: 500 });
            }
            if(res.stdrr){
                return NextResponse.json({ error: res.stderr }, { status: 500 });
            }

            if(res.stdout){
                return NextResponse.json({ message: res.stdout }, res);
            }
        })


   


        
      }
      else{
        return NextResponse.json({ error: "Not Authorized" }, { status: 500 });
      }
   
      
  
    } catch (error) {
      return NextResponse.json({ error: error.message }, { status: error.status || 500 });
    }
  });
  