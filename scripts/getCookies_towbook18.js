

const puppeteer = require('puppeteer');
const fs = require('fs').promises;

let user={user:"Momentum-roadside18",password:"fekaTXMRN@18"}



const customArgs = [
        `--start-maximized`,
        '--enable-save-password-bubble',
        '--enable-automatic-password-saving',
        '--enable-automation',
        '--no-sandbox',
        // `--load-extension=/Users/mehdi/Library/Application\ Support/Google/Chrome/Default/Extensions/aedipmheomnpcbgmanofhaccebgapije/1.3.22_0/`
        // `--load-extension=/home/mehdi/.config/google-chrome/Default/Extensions/aedipmheomnpcbgmanofhaccebgapije/1.3.22_0/`
      ];    
    
    async function func() {


        


        const browser = await puppeteer.launch({
          headless: true,
          executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || '/usr/bin/google-chrome-stable',
          // headless: false, 
          ignoreDefaultArgs: ["--disable-extensions"],
          // ignoreDefaultArgs: ["--disable-extensions","--enable-automation"],
          // devtools: true,
          // // ignoreDefaultArgs: true,
          args: customArgs,
          // userDataDir: "./user_data"
        });
    // const browser = await puppeteer.launch({headless: true});


    const page = await browser.newPage();
    // await page.setRequestInterception(true);


    await page.setViewport({width: 1150, height: 1200})
    const res=await page.goto('https://app.towbook.com/DS4/');
    const headers = res.headers();
    await page.waitForTimeout(1000)


    const username = await page.$x('//*[@id="Username"]')
    if( username[0]){
      await username[0].click() 
      await page.keyboard.type(user.user);
    }
    

    const password = await page.$x('//*[@id="Password"]')
    if(password[0]){
      await password[0].click() 
      await page.keyboard.type(user.password);
    }
    
    
    const login = await page.$x('//*[@id="bSignIn"]')
    if (login[0]){
      await login[0].click().then(()=>{console.log('Sign in is clicked!!!!')})
    }
    else{
      console.log('Already logged in and no need to click on sign in')
    }
    
   


///////////////////////////////////// %%%%%%%% //////////////////////////////////////////////////////////
    await page.waitForTimeout(3000).then(()=>{console.log('Ready to Dispatch')})

    // await page.screenshot({
    //   path:'./screenshot.png',
    //   fullPage:true
    // })

  

     cookies = await page.cookies('https://app.towbook.com/DS4/');
    await fs.writeFile('./cookies_towbook18.json', JSON.stringify(cookies, null, 2));
    console.log(cookies)

    await browser.close();

}

func()