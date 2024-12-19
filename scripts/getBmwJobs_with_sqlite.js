const fs = require('fs').promises;
const fetch = require('node-fetch');
const { resolve } = require('path');
var _client = require("@prisma/client");
const { copyFileSync } = require('fs');
var prisma = new _client.PrismaClient();
const moment = require('moment');
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./drivers.db');

let drivers_li = [];
let drivers_uid = {};

async function initializeDriversLi() {
    return new Promise((resolve, reject) => {
        db.all("SELECT driver_name FROM drivers", (err, rows) => {
            if (err) {
                reject(err);
            } else {
                rows.forEach(el => {
                    drivers_li.push(el.driver_name.toLowerCase().replace(/\s/g, ''));
                });
                resolve();
            }
        });
    }).then(() => {
        console.log(drivers_li);
    });
}

async function initializeDriversUid() {
    return new Promise((resolve, reject) => {
        db.all("SELECT driver_name, driver_id_towbook FROM drivers", (err, rows) => {
            if (err) {
                reject(err);
            } else {
                rows.forEach(el => {
                    drivers_uid[el.driver_name.toLowerCase().replace(/\s/g, '')] = el.driver_id_towbook;
                });
                resolve();
            }
        });
    }).then(() => {
        console.log(drivers_uid);
    });
}

const searchForJob = async(po) => {
    let url = `https://app.towbook.com/api/calls/Search?page=1&quick=${po}`;

    const currentWorkingDirectory = process.cwd();
    const cookiesString = await fs.readFile(`${currentWorkingDirectory}/cookies_towbook18.json`);
    let cookies = JSON.parse(cookiesString);

    return await new Promise((resolve, reject) => {
        ////////// Get cookies for authentication ///////////
        let NET_SessionId;
        let intercom_session;
        let xtl;
        let X_Session_Timeout;
        
        for (let i = 0; i < cookies.length; i++) {
            if (cookies[i].name === 'ASP.NET_SessionId') {
                NET_SessionId = cookies[i].value;
            }
            else if (cookies[i].name === 'intercom-session-kw06m3f5') {
                intercom_session = cookies[i].value;
            }
            else if (cookies[i].name === '.xtl') {
                xtl = cookies[i].value;
            }
            else if (cookies[i].name === 'X-Session-Timeout') {
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
        }).then(async res => {
            return await res.text();
        }).then(data => {
            return JSON.parse(data);
        }).catch(e => {
            console.log("///// error from dispatch fetch GET /////\n", e);
            return { error: e };
        });
    });
}

const func = async() => {
    // Initialize drivers first
    await initializeDriversLi();
    await initializeDriversUid();

    let auth_token_obj = await fs.readFile('./cookies.json');
    let auth_token = JSON.parse(auth_token_obj)["data"][0]["authToken"];
    console.log("///////////////// auth token //////////////////////\n", auth_token);

    let active_jobs = [];
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
                    'Content-Type': 'application/json; charset=UTF-8',
                    'Accept-Encoding': 'gzip, deflate, br',
                    'Connection': 'keep-alive',
                    'auth-token': auth_token,
                }
            });

            let result0 = await response.json();

            url = `https://ops-apis.urgent.ly/v3/ops/cases/${res[i]["casePO"]}`;

            response = await fetch(url, {
                method: 'GET',
                cache: 'no-cache',
                credentials: 'same-origin',
                'Cache-Control': 'no-cache',
                headers: {
                    'Content-Type': 'application/json; charset=UTF-8',
                    'Accept-Encoding': 'gzip, deflate, br',
                    'Connection': 'keep-alive',
                    'auth-token': auth_token,
                }
            });

            let result1 = await response.json();
            update_jobDetails0.push({0:result0,1:result1});
        }
    });

    let response = await fetch(`https://ops-apis.urgent.ly/v3/ops/users/66525/jobs?state=1&offset=0&limit=50`, {
        method: 'GET',
        cache: 'no-cache',
        credentials: 'same-origin',
        'Cache-Control': 'no-cache',
        headers: {
            'Content-Type': 'application/json; charset=UTF-8',
            'Accept-Encoding': 'gzip, deflate, br',
            'Connection': 'keep-alive',
            'auth-token': auth_token,
        }
    });

    const result = await response.json();
    console.log("//// all jobs /////", result["data"].length);

    let count = 0;
    for (let i = 0; i < result["data"].length; i++) {
        const bmwRecord = await prisma.bmw.findUnique({
            where: {
                "PO": parseInt(result["data"][i].service.number),
            },
        });

        if (!bmwRecord) {
            if (drivers_li.includes(result["data"][i].provider.firstName?.replace(/\s*\([^)]*\)/, '').replace(/\(Momentum Towing/, "").replace(',', '').replace(/\s/g, '').toLowerCase())) {
                count += 1;
                console.log(count, result["data"][i].service.number, result["data"][i].provider.firstName);
                active_jobs.push(result["data"][i]);
            }
            else {
                console.log("//// driver not in the list /////", result["data"][i].provider.firstName, parseInt(result["data"][i].service.number));
                if (!result["data"][i].provider.firstName?.includes("Gabe")) {
                    active_jobs.push(result["data"][i]);
                }
            }
        }
        else if (bmwRecord) {
            if (!bmwRecord["dispached_date"]) {
                active_jobs.push(result["data"][i]);
            }
        }
        else {
            if (bmwRecord.update == true) {
                console.log("///// update //////", bmwRecord);
            }
        }
    }

    async function getActiveJobDetails(active_jobs) {
        let jobDetails0 = [];
        for (let i = 0; i < active_jobs.length; i++) {
            let url = `https://ops-apis.urgent.ly/v3//ops/providers/jobs/${active_jobs[i]["service"]["number"]}/dispatch`;

            let response = await fetch(url, {
                method: 'GET',
                cache: 'no-cache',
                credentials: 'same-origin',
                'Cache-Control': 'no-cache',
                headers: {
                    'Content-Type': 'application/json; charset=UTF-8',
                    'Accept-Encoding': 'gzip, deflate, br',
                    'Connection': 'keep-alive',
                    'auth-token': auth_token,
                }
            });

            let result0 = await response.json();

            url = `https://ops-apis.urgent.ly/v3/ops/cases/${active_jobs[i]["caseDTO"]["id"]}`;

            response = await fetch(url, {
                method: 'GET',
                cache: 'no-cache',
                credentials: 'same-origin',
                'Cache-Control': 'no-cache',
                headers: {
                    'Content-Type': 'application/json; charset=UTF-8',
                    'Accept-Encoding': 'gzip, deflate, br',
                    'Connection': 'keep-alive',
                    'auth-token': auth_token,
                }
            });

            let result1 = await response.json();
            jobDetails0.push({0:result0,1:result1});
        }
        return jobDetails0;
    }

    let xxx = await getActiveJobDetails(active_jobs);
    console.log("//// xxx ////", xxx);

    let prices_obj = await fs.readFile('./jobsPrice.json');
    prices_obj = JSON.parse(prices_obj);
    console.log("prices_obj", prices_obj.length);

    async function extractActiveJobDetails(drivers, prices_obj, obj) {
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

        let count = 0;
        let jobs = [];
        let sum = 0;

        obj.forEach(el => {
            let timestampInMilliSeconds = el[1]["createdAt"];
            let date = new Date(timestampInMilliSeconds);

            let PO = el[0]["data"][0]["service"]["number"];
            let casePO = el[1]["jobs"][0]["caseDTO"]["id"];
            let DriverName = `${el[0]["data"][0]["provider"]?.["firstName"]}  ${el[0]["data"][0]["provider"]?.["lastName"]}`.replace(/\s*\([^)]*\)/, '').replace(/DRIVER/g, '');
            DriverName = DriverName.replace("(","").replace(")","").replace("Momentum Towing","");
            let createdAT = `${date.toLocaleString('en-US', options)}`;
            let towFrom = el[1]["jobs"][0]["location"]?.["address"];
            let towTo = el[1]["jobs"][0]["dropOffLocation"]?.["address"];
            let service = el[1]["jobs"][0]["service"]["serviceType"];
            let contact = el[1]["jobs"][0]["personalInfo"]?.["name"];
            let vehicle = {};
            vehicle["make"] = el[1]["jobs"][0]["vehicle"]["make"];
            vehicle["model"] = el[1]["jobs"][0]["vehicle"]["model"];
            vehicle["year"] = el[1]["jobs"][0]["vehicle"]["year"];
            vehicle["color"] = el[1]["jobs"][0]["vehicle"]["color"];
            vehicle["vin"] = el[1]["jobs"][0]["vehicle"]["vin"];

            timestampInMilliSeconds = el[1]["jobs"][0]["service"]["completeTimestamp"];
            date = new Date(timestampInMilliSeconds);
            let completed = `${date.toLocaleString('en-US', options)}`;
            let price;
            let serviceType;

            prices_obj.forEach(el => {
                if (el["jobNumber"] == PO) {
                    price = el["price"];
                    serviceType = el["jobType"];
                    sum = sum + el["price"];
                }
            });

            console.log("//// $$$$ /////", el[1]["jobs"][0]["caseDTO"]["id"], el[1]["jobs"][0]["location"]?.["address"], price);

            jobs.push({
                PO: PO,
                casePO: casePO,
                DriverName: DriverName,
                driverIdTowbook: drivers_uid[DriverName.toLowerCase().replace(/\s/g, '').trim()],
                createdAT: createdAT,
                completed: completed,
                towFrom: towFrom,
                towTo: towTo,
                service: service,
                serviceType: serviceType,
                contact: contact,
                vehicle: vehicle,
                price: price ? price : 0
            });

            count += 1;
        });

        return jobs;
    }

    let result0 = await extractActiveJobDetails(drivers_li, prices_obj, xxx);
    let result01 = await extractActiveJobDetails(drivers_li, prices_obj, update_jobDetails0);

    console.log("////// result0 /////\n", result0);
    console.log("////// result01 /////\n", result01);

    let obj00 = [];
    await new Promise(async resolve => {
        for (let i = 0; i < result01.length; i++) {
            result01[i].update = true;
            if (result01[i].PO == updateJobs[i].PO) {
                result01[i].PdfCreatedAt = updateJobs[i].PdfCreatedAt;
                result01[i].dispached_date = updateJobs[i].dispached_date;
                result01[i].callId = updateJobs[i].callId;
                obj00.push(result01[i]);
            }
        }

        for (let i = 0; i < result0.length; i++) {
            obj00.push(result0[i]);
        }

        resolve(obj00);
    }).then(res => {
        obj00 = res;
    });

    await fs.writeFile('./jobsToDispatch_metro.json', JSON.stringify(obj00, null, 2));

    async function upsertBMW(id, createData, updateData) {
        const bmw = await prisma.bmw.upsert({
            where: { "PO": id },
            create: createData,
            update: updateData,
        });
        return bmw;
    }

    let upsertBmwObj = async function(obj) {
        for (let i = 0; i < obj.length; i++) {
            await new Promise(resolve => {
                const parsedDate = moment(obj[i]["createdAT"], 'MM/DD/YYYY, hh:mm:ss A');
                const isoDateString = parsedDate.toISOString();
                resolve(isoDateString);
            }).then(async res => {
                if (obj[i].DriverName.includes("undefined")) {
                    let job = await searchForJob(obj[i].PO);
                    let driver = job[0].assets[0].driver.name;
                    console.log("$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$");
                    console.log(obj[i].PO, "$$$$$$$$$$$$$$$ undefined driver name $$$$$$$$$$$$$$$$", driver);
                    console.log("$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$");
                    obj[i].DriverName = driver;
                    obj[i].driverIdTowbook = drivers_uid[driver.toLowerCase().replace(/\s/g, '')];
                }
                obj[i]["createdAT"] = res;
            });

            let bmw = await upsertBMW(obj[i]["PO"], obj[i], obj[i]);
            console.log("//// bmw upsert to database ////\n", bmw);
        }
    }

    await upsertBmwObj(obj00);
}

func();
