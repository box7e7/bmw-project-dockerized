const axios = require('axios');
const fs = require('fs').promises;
const fs1 = require('fs');
const { fileURLToPath } = require('url');



const downloadPDF=async(url)=>{

    const currentWorkingDirectory = process.cwd();
    console.log("#### currentWorkingDirectory #######",currentWorkingDirectory);

    let downloadedFilename = '';
    const cookiesString = await fs.readFile(`${currentWorkingDirectory}/scripts/cookies_towbook_metro.json`);
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

        // const downloadUrl = 'https://app.towbook.com/dispatch2/Invoice.aspx?id=172050625&pdf=1&download=1&showPrices=0&hideDiscounts=0&hidePhotos=0&hideLineItems=0';
        const downloadUrl = url
        return axios({
            method: 'get',
            url: downloadUrl,
            responseType: 'stream',
            maxRedirects: 5, // Adjust as necessary
            headers: {
              Cookie: res
            }
          })
      .then(response => {
        if (response.headers['content-type'] !== 'application/pdf') {
          console.error('The URL did not return a PDF file.');
          return {error:'The URL did not return a PDF file.'};
        }

        // Extract filename from Content-Disposition header or create a default name
        const contentDisposition = response.headers['content-disposition'];
        let filename = 'downloaded_file.pdf';
        if (contentDisposition) {
          const filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
          const matches = filenameRegex.exec(contentDisposition);
          if (matches != null && matches[1]) filename = matches[1].replace(/['"]/g, '');
        }

        // Save the PDF file

        console.log("//// file name ////\n",filename)
        // const writer = fs1.createWriteStream(`./${filename}`);
        const writer = fs1.createWriteStream(`${currentWorkingDirectory}/scripts/tmp/${filename}`);
       
        response.data.pipe(writer);

        return new Promise((resolve, reject) => {
          writer.on('finish', resolve);
          writer.on('error', reject);
          downloadedFilename = filename;
        });
      })
      .then(() => {
        console.log('File downloaded successfully');
        return {msg:'File downloaded successfully',filename:downloadedFilename}
      })
      .catch(error => {
        console.error('Error downloading file:', error);
        return {error:'Error downloading file'}
      });

    })

}





// module.exports=downloadPDF

const func=async()=>{
   let call_id=181360687
   const downloadUrl = `https://app.towbook.com/dispatch2/Invoice.aspx?id=${call_id}&pdf=1&download=1&showPrices=1`
   let result=await downloadPDF(downloadUrl)

   console.log("///***  result ***///",result)

 }

 func()





