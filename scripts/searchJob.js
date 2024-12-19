const fs = require('fs').promises;
const fetch = require('node-fetch');





const extractCookies = async () => {
    const currentWorkingDirectory = process.cwd();
    const cookiesString = await fs.readFile(`${currentWorkingDirectory}/cookies_towbook18.json`);
    const cookies = JSON.parse(cookiesString);
    
    const cookieMap = {
        'ASP.NET_SessionId': '',
        'intercom-session-kw06m3f5': '',
        '.xtl': '',
        'X-Session-Timeout': ''
    };

    cookies.forEach(cookie => {
        if (cookieMap.hasOwnProperty(cookie.name)) {
            cookieMap[cookie.name] = cookie.value;
        }
    });

    return `ASP.NET_SessionId=${cookieMap['ASP.NET_SessionId']}; intercom-session-kw06m3f5=${cookieMap['intercom-session-kw06m3f5']}; .xtl=${cookieMap['.xtl']}; X-Session-Timeout=${cookieMap['X-Session-Timeout']}`;
};

const searchForJob = async (po,url) => {
    try {
        // const url = `https://app.towbook.com/api/calls/Search?page=1&quick=${po}`;
        

        const cookieString = await extractCookies();

        console.log("cookieString", cookieString);

        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Accept-Encoding': 'gzip, deflate, br',
                'Accept-Language': 'en-US,en;q=0.9',
                'Connection': 'keep-alive',
                'Cookie': cookieString,
                'Host': 'app.towbook.com',
                'Origin': 'https://app.towbook.com'
            },
            cache: 'no-cache',
            credentials: 'same-origin'
        });

        const data = await response.text();
        return JSON.parse(data);
    } catch (error) {
        console.error("Error in searchForJob:", error);
        return { error };
    }
};

// module.exports = { searchForJob };


(async () => {
    let po=8383564
    let url = `https://app.towbook.com/api/calls/Search?page=1&quick=${po}`;
    url="https://app.towbook.com/api/drivers/full"
    let result = await searchForJob(po,url);
    console.log(result);
})();
