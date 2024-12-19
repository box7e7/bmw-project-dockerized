const fs = require('fs').promises;
const fetch = require('node-fetch');
const path = require('path');

const extractCookies = async () => {
    const cookiesString = await fs.readFile(path.join(process.cwd(), 'scripts', 'cookies_towbook_metro.json'));
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

const getDriversFull = async () => {
    try {
        const url="https://app.towbook.com/api/drivers/full"
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
        console.error("Error in getDriversFull:", error);
        return { error };
    }
};

module.exports = { getDriversFull };
