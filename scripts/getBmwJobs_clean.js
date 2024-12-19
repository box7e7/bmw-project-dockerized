// Required dependencies
const fs = require('fs').promises;
const fetch = require('node-fetch');
const { resolve } = require('path');
var _client = require("@prisma/client");
const { copyFileSync } = require('fs');
var prisma = new _client.PrismaClient();
const moment = require('moment');

// Metro area drivers mapping with their UIDs and Towbook IDs
let momentum_towing_drivers_uid_metro = [
    {'uid': 'e09deb6f-8721-4166-ae32-ea0790a2b094', 'driver_name': 'ABU SALIM SAMER',      'driver_id_towbook':401438},
    {'uid': 'e09deb6f-8721-4166-ae32-ea0790a2b094', 'driver_name': 'SAMER ABU SALIM',      'driver_id_towbook':401438},
    {'uid': '0999c017-2c0d-4f99-8f05-7611a3a19da8', 'driver_name': 'Ahmad Masadeh',        'driver_id_towbook':401436},
    {'uid': '0999c017-2c0d-4f99-8f05-7611a3a19da8', 'driver_name': 'AHMAD MESSAADAH',      'driver_id_towbook':401436},
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
    {'uid': null,                                   'driver_name': 'Dementry cloud',       'driver_id_towbook':538706},
    {'uid': null,                                   'driver_name': 'aHMAD   ALNSAIRAT',   'driver_id_towbook':401439},
    {'uid': null,                                   'driver_name': 'AMIR BENJAMIN',        'driver_id_towbook':563981},
];

// Initialize arrays and process driver names
let drivers_li = [];
let pattern = /\(Momentum Towing/;
momentum_towing_drivers_uid_metro.forEach(el => {
    drivers_li.push(el.driver_name.toLowerCase().replace(/\s/g, ''));
});

// Create mapping of driver names to their towbook IDs
let drivers_uid = {};
momentum_towing_drivers_uid_metro.forEach(el => {
    drivers_uid[el.driver_name.toLowerCase().replace(/\s/g, '')] = el.driver_id_towbook;
});

console.log(drivers_uid);

// Function to search for jobs by PO number
const searchForJob = async (po) => {
    let url = `https://app.towbook.com/api/calls/Search?page=1&quick=${po}`;

    const currentWorkingDirectory = process.cwd();
    const cookiesString = await fs.readFile(`${currentWorkingDirectory}/cookies_towbook18.json`);
    let cookies = JSON.parse(cookiesString);

    return await new Promise((resolve, reject) => {
        let NET_SessionId;
        let intercom_session;
        let xtl;
        let X_Session_Timeout;

        for (let i = 0; i < cookies.length; i++) {
            if (cookies[i].name === 'ASP.NET_SessionId') {
                NET_SessionId = cookies[i].value;
            } else if (cookies[i].name === 'intercom-session-kw06m3f5') {
                intercom_session = cookies[i].value;
            } else if (cookies[i].name === '.xtl') {
                xtl = cookies[i].value;
            } else if (cookies[i].name === 'X-Session-Timeout') {
                X_Session_Timeout = cookies[i].value;
            }
        }
        resolve(`'ASP.NET_SessionId=${NET_SessionId}; intercom-session-kw06m3f=${intercom_session}; .xtl=${xtl}; X-Session-Timeout=${X_Session_Timeout}'`);
    }).then(async res => {
        return await fetch(url, {
            method: 'GET',
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
        })
        .then(async res => await res.text())
        .then(data => JSON.parse(data))
        .catch(e => {
            console.log("///// error from dispatch fetch GET /////\n", e);
            return { error: e };
        });
    });
};

// Main function to process BMW jobs
const func = async () => {
    let auth_token_obj = await fs.readFile('./cookies.json');
    let auth_token = JSON.parse(auth_token_obj)["data"][0]["authToken"];
    console.log("///////////////// auth token //////////////////////\n", auth_token);

    let active_jobs = [];
    let update_active_jobs = [];
    let update_jobDetails0 = [];

    async function getAllBMWs() {
        const allBMWs = await prisma.bmw.findMany({
            where: {
                update: true,
            }
        });
        return allBMWs;
    }

    let updateJobs = await getAllBMWs();
    console.log("//// update jobs /////\n", updateJobs);

    await new Promise(resolve => {
        resolve(updateJobs);
    }).then(async res => {
        for (let i = 0; i < res.length; i++) {
            let url = `https://ops-apis.urgent.ly/v3//ops/providers/jobs/${res[i].PO}/dispatch`;

            let response = await fetch(url, {
                method: 'GET',
                cache: 'no-cache',
                credentials: 'same-origin',
                'Cache-Control': 'no-cache',
                headers: {
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${auth_token}`,
                    'Content-Type': 'application/json'
                }
            });

            let result0 = await response.json();
            update_jobDetails0.push({ 0: result0, 1: result1 });
        }
    });

    let result0 = await extractActiveJobDetails(momentum_towing_drivers_uid_metro, prices_obj, xxx);
    let result01 = await extractActiveJobDetails(momentum_towing_drivers_uid_metro, prices_obj, update_jobDetails0);

    console.log("////// result0 /////\n", result0);
    console.log("////// result01 /////\n", result01);

    let obj00 = [];
    result0.forEach(el => {
        if (el.price > 0) {
            obj00.push(el);
        }
    });

    await fs.writeFile('./jobsToDispatch_metro.json', JSON.stringify(obj00, null, 2));
};

// Execute the main function
func();
