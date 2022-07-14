var http = require('http');
var static = require('node-static');
var fileServer = new static.Server('./client');
var port = process.env.PORT || 8000;
http.createServer(function (req, res) {
    fileServer.serve(req, res);
    if (req.url != "/") {
        // console.log('Page redirected to /');
        // res.writeHead(302, {
        //     location: "http://10.35.13.108:8000",
        // });
        // res.end();
    }
}).listen(port);
console.log(`Http server running at http://127.0.0.1:${port}/`);

const express = require("express");
const cors = require('cors')
const fs = require('fs');
const appport = 8001
const app = express();
const bodyParser = require('body-parser')
const moment = require('moment');
const XLSX = require("xlsx");
const path = require('path');

var plcdata = {
    slurrym3: 0,
    slurryhourly: 0,
    slurrytotal: 0
}


app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

app.listen(appport, () => {
    console.log(`${appport} api port started`)
})

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'static')));
app.set("view engine", "pug");

app.get('/api/getpdcdata', function (req, res) {
    res.sendFile('./data.json', { root: __dirname });
});

app.get('/api/getslurrydata', function (req, res) {
    res.sendFile('./slurrydata.json', { root: __dirname });
});

app.get('/api/saveslurry', function (req, res) {
    res.destroy();
    const prof = new Promise(function (resolve, reject) {
        try {
            resolve(req.query);
        } catch (e) {
            reject('0');
            console.log(e);
        }
    })

    prof.then(function (jsondata) {
        if (jsondata == undefined) { jsondata = 0; }
        var json = fs.readFileSync('./slurrydata.json');
        var Obj = JSON.parse(json);
        var ss = moment().format('H');
        let vard
        if (ss >= 0 && ss <= 7) {
            vard = "V1";
        } else if (ss >= 8 && ss <= 15) {
            vard = "V2";
        } else if (ss >= 16 && ss <= 23) {
            vard = "V3";
        }

        // for (var k in Obj) {
        // var ob = Obj[k];
        // var now = moment().unix();
        // var endTime = ob.timestamp;

        // if (now > endTime + 3600*12) {
        // Obj.splice(k,1);
        // }
        // }

        Obj.unshift({
            time: GetDate(true),
            vardiya: vard,
            Slurry: parseInt(jsondata["Slurry"]).toFixed(),
        });
        var newData = JSON.stringify(Obj);
        fs.writeFile('./slurrydata.json', newData, err => {
            if (err) throw err;
            console.log(`${GetDate(true)} saved!`);
        });
    }).catch(function (hata) {
        console.log(hata)
    })
    if (moment().format('H') == 0) {
        setTimeout(function () {
            var prof = new Promise(function (resolve, reject) {
                fs.readFile('./slurrydata.json', null, function (error, data) {
                    if (error) { reject('0'); console.log(error); }
                    var jdata = JSON.parse(data)
                    var Slurry = 0;
                    for (var i in jdata.slice(0, 23)) {
                        Slurry += parseInt(jdata[i].Slurry);
                    }
                    jdata.unshift({
                        time: GetDate(),
                        vardiya: "Toplam",
                        Slurry,
                    });
                    fs.writeFile('./slurrydata.json', JSON.stringify(jdata), err => {
                        if (err) throw err;
                        console.log(`${GetDate()} Total saved!`);
                    });
                    resolve(true)
                });
            })
            prof.then(function (jsondata) {

            }).catch(function (hata) {
                console.log(hata)
            })
        }, 1000);
    }
});


app.get("/takeX", (req, res) => {
    res.destroy();
    const prof = new Promise(function (resolve, reject) {
        try {
            resolve(req.query);
        } catch (e) {
            reject('0');
            console.log(e);
        }
    })

    prof.then(function (jsondata) {
        if (jsondata == undefined) { jsondata = 0; }
        var json = fs.readFileSync('./data.json');
        var Obj = JSON.parse(json);
        var ss = moment().format('H');
        let vard
        if (ss >= 0 && ss <= 7) {
            vard = "V1";
        } else if (ss >= 8 && ss <= 15) {
            vard = "V2";
        } else if (ss >= 16 && ss <= 23) {
            vard = "V3";
        }

        // for (var k in Obj) {
        // var ob = Obj[k];
        // var now = moment().unix();
        // var endTime = ob.timestamp;

        // if (now > endTime + 3600*12) {
        // Obj.splice(k,1);
        // }
        // }

        Obj.unshift({
            time: GetDate(),
            vardiya: vard,
            BC1B_PDC1: parseInt(jsondata["BC1BPDC1"]).toFixed(),
            BC1B_PDC2: parseInt(jsondata["BC1BPDC2"]).toFixed(),
            D301_PDC1: parseInt(jsondata["D301PDC1"]).toFixed(),
            D301_PDC2: parseInt(jsondata["D301PDC2"]).toFixed(),
            D701: parseInt(jsondata["D701"]).toFixed(),
            D705: parseInt(jsondata["D705"]).toFixed(),
            D706: parseInt(jsondata["D706"]).toFixed(),
            D707: parseInt(jsondata["D707"]).toFixed(),
            D710: parseInt(jsondata["D710"]).toFixed(),
            Slurry: parseInt(jsondata["Slurry"]).toFixed(),
            Keson: parseInt(jsondata["Keson"]).toFixed()
        });
        var newData = JSON.stringify(Obj);
        fs.writeFile('./data.json', newData, err => {
            if (err) throw err;
            console.log(`${vard} PDC saved!`);
        });
    }).catch(function (hata) {
        console.log(hata)
    })
    if (moment().format('H') == 23) {
        setTimeout(function () {
            var prof = new Promise(function (resolve, reject) {
                fs.readFile('./data.json', null, function (error, data) {
                    if (error) { reject('0'); console.log(error); }
                    var jdata = JSON.parse(data)
                    var BC1B_PDC1 = 0, BC1B_PDC2 = 0, D301_PDC1 = 0, D301_PDC2 = 0, D701 = 0, D705 = 0, D706 = 0, D707 = 0, D710 = 0, Keson = 0, Slurry = 0;
                    for (var i in jdata.slice(0, 3)) {
                        BC1B_PDC1 += parseInt(jdata[i].BC1B_PDC1);
                        BC1B_PDC2 += parseInt(jdata[i].BC1B_PDC2);
                        D301_PDC1 += parseInt(jdata[i].D301_PDC1);
                        D301_PDC2 += parseInt(jdata[i].D301_PDC2);
                        D701 += parseInt(jdata[i].D701);
                        D705 += parseInt(jdata[i].D705);
                        D706 += parseInt(jdata[i].D706);
                        D707 += parseInt(jdata[i].D707);
                        D710 += parseInt(jdata[i].D710);
                        Keson += parseInt(jdata[i].Keson);
                        Slurry += parseInt(jdata[i].Slurry);
                    }
                    jdata.unshift({
                        time: GetDate(),
                        vardiya: "Toplam",
                        BC1B_PDC1,
                        BC1B_PDC2,
                        D301_PDC1,
                        D301_PDC2,
                        D701,
                        D705,
                        D706,
                        D707,
                        D710,
                        Keson,
                        Slurry,
                    });
                    fs.writeFile('./data.json', JSON.stringify(jdata), err => {
                        if (err) throw err;
                        console.log(`${GetDate(false)} Total saved!`);
                    });
                    resolve(true)
                });
            })
            prof.then(function (jsondata) {

            }).catch(function (hata) {
                console.log(hata)
            })
        }, 1000);
    }
})

function GetDate(bool) {
    if (bool) {
        var today = new Date();
        var date = today.getDate() + '-' + (today.getMonth() + 1) + '-' + today.getFullYear();
        var time = today.getHours() + ":" + today.getMinutes();
        return `${date} ${time}`;
    } else {
        var today = new Date();
        var date = today.getDate() + '/' + (today.getMonth() + 1) + '/' + today.getFullYear();
        var time = today.getHours() + ":" + today.getMinutes();
        return `${date}`;
    }
}





var nodes7 = require('nodes7');
var conn = new nodes7;
var doneReading = false;
var doneWriting = false;

var variables = {
    m3Slurry: 'DB80,REAL0',
    SlurryTotal: 'DB80,REAL16',
    HourlySlurry: 'DB80,REAL24',
    // TEST2: 'M32.2',        // Bit at M32.2
    // TEST3: 'M20.0',        // Bit at M20.0
    // TEST4: 'DB1,REAL0.20', // Array of 20 values in DB1
    // TEST5: 'DB1,REAL4',    // Single real value
    // TEST6: 'DB1,REAL8',    // Another single real value
    // TEST7: 'DB1,INT12.2',  // Two integer value array
    // TEST8: 'DB1,LREAL4',   // Single 8-byte real value
    // TEST9: 'DB1,X14.0',    // Single bit in a data block
    // TEST10: 'DB5,X0.0.8'  // Array of 8 bits in a data block
};

conn.initiateConnection({
    port: 102,
    host: '10.35.17.10',
    rack: 0,
    slot: 1,
    timeout: 30000,
    debug: true
}, connected);


function connected(err) {
    if (typeof (err) !== "undefined") {
        console.log(err);
        process.exit();
    }
    conn.setTranslationCB(function (tag) {
        return variables[tag];
    });
    conn.addItems(['m3Slurry', 'HourlySlurry', 'SlurryTotal']);
    conn.readAllItems(valuesReady);
}

function valuesReady(err, values) {
    if (err) { console.log("OKUNAN DEĞERLERDE HATA VAR"); }
    conn.readAllItems(valuesReady);
    plcdata.slurrym3 = values.m3Slurry;
    plcdata.slurryhourly = values.HourlySlurry;
    plcdata.slurrytotal = values.SlurryTotal;
    doneReading = true;
}

function valuesWritten(anythingBad) {
    if (anythingBad) { console.log("YAZILAN DEĞERLERDE HATA VAR"); }
    console.log("Yazıldı.");
    doneWriting = true;
    if (doneReading) { process.exit(); }
}
app.get('/api/getPLCData', function (req, res) {
    res.send(plcdata);
});