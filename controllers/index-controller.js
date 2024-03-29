const axios = require('axios');

const controller = {};

function getLocation(x) {
    if (checkLastUpdate(x.LastUpdate)) {
        const location = x.Data;
        return location.replace(/,\sNetherlands/g, '');
    }
    return "Onbekend";
}

function checkLastUpdate(dt) {
    const minutes = new Date(new Date() - new Date(dt)).getMinutes();
    return (minutes < 30);
}

controller.getIndexModel = async () => {
    const baseUrl = "http://192.168.50.221:8080/json.htm?type=devices&rid=";
    try {
        // binnen temp
        let response = await axios.get(baseUrl + "37");
        const roomTemp = response.data.result[0].Temp;
        // binnen vocht
        response = await axios.get(baseUrl + "38");
        const roomHumid = response.data.result[0].Humidity;
        let roomHumidLabel = "normaal";
        if (roomHumid < 50) {
            roomHumidLabel = "droog";
        }
        if (roomHumid > 60) {
            roomHumidLabel = "vochtig";
        }
        // CO2
        response = await axios.get(baseUrl + "39");
        const co2 = response.data.result[0].Data;
        const ppm = Number(co2.replace(/\D/g, ''));
        let airQuality = "goed";
        if (ppm > 1600) {
            airQuality = "evacueren!"
        } else if (ppm > 1200) {
            airQuality = "slecht";
        } else if (ppm > 800) {
            airQuality = "matig";
        }

        // buiten temp en vocht
        response = await axios.get(baseUrl + "10");
        const temp = response.data.result[0].Temp;
        const humid = response.data.result[0].Humidity;
        let humidLabel = "normaal";
        if (humid < 50) {
            humidLabel = "droog";
        }
        if (humid > 60) {
            humidLabel = "vochtig";
        }

        // gevoel
        response = await axios.get(baseUrl + "12");
        const feelTemp = response.data.result[0].Temp;

        // stroomgebruik
        response = await axios.get(baseUrl + "3");
        const usage = response.data.result[0].Data;
        const watt = Number(usage.replace(/[^\d.]/g, ''));

        // zonnepanelen nu
        response = await axios.get(baseUrl + "4");
        const solar = response.data.result[0].Data;
        const solarWatt = Number(solar.replace(/[^\d.]/g, ''));

        // zonnepanelen vandaag
        response = await axios.get(baseUrl + "25");
        const solarToday = response.data.result[0].CounterToday;
        const solarTodayWatt = Number(solarToday.replace(/[^\d.]/g, ''));

        // gas
        response = await axios.get(baseUrl + "5");
        const gasRaw = response.data.result[0].CounterToday;
        let gas = Number(gasRaw.replace(/[^\d.]/g, ''));
        let gasDue = 0;

        const gasPriceDec = 1.28200;
        const gasPerDayDec = 0.25596 + 0.658;

        const gasPriceJan = 1.39478;
        const gasPerDayJan = 0.25596 + 0.67530;

        const today = new Date();
        if (today.getMonth() === 11 ) {
            gasDue = gasPriceDec * gas + gasPerDayDec;
        } else {
            gasDue = gasPriceJan * gas + gasPerDayJan;
        }

        // mensjes
        response = await axios.get(baseUrl + "40");
        const ruth = getLocation(response.data.result[0]);

        response = await axios.get(baseUrl + "41");
        const mj = getLocation(response.data.result[0]);

        response = await axios.get(baseUrl + "42");
        const al = getLocation(response.data.result[0]);

        response = await axios.get(baseUrl + "43");
        const jw = getLocation(response.data.result[0]);

        response = await axios.get(baseUrl + "44");
        const hugo = getLocation(response.data.result[0]);

        // date
        let weekday = today.toLocaleString("nl-NL", { weekday: 'long' });
        let time = today.toLocaleTimeString("nl-NL", { hour: 'numeric', minute: 'numeric' });
        let date = today.toLocaleDateString("nl-NL", { year: "numeric", month: "long", day: "numeric" });

        // buienradar
        const buienData = [];
        try {
            response = await axios.get("https://gpsgadget.buienradar.nl/data/raintext?lat=52.2&lon=6.01");
            const buienradarData = response.data;
            const lines = buienradarData.replace(/\r/g, '').split("\n");

            for (let i = 0; i < lines.length; i++) {
                const periodData = lines[i].split("|");
                const precip = Number(periodData[0]);
                const time = periodData[1];
                buienData.push({ time, precip });
            }
        } catch (errbuien) {
        }
        const buienJson = JSON.stringify(buienData);

        return {
            roomTemp: roomTemp.toLocaleString("nl-NL"),
            roomHumid: roomHumid.toLocaleString("nl-NL"),
            roomHumidLabel,
            ppm,
            airQuality,
            temp: temp.toLocaleString("nl-NL"),
            feelTemp: feelTemp.toLocaleString("nl-NL"),
            humid,
            humidLabel,
            watt,
            solarWatt: solarWatt.toLocaleString("nl-NL"),
            solarTodayWatt: solarTodayWatt.toLocaleString("nl-NL"),
            gas: gas.toLocaleString("nl-NL", { minimumFractionDigits: 3, maximumFractionDigits: 3 }),
            gasDue: gasDue.toLocaleString("nl-NL", { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
            gasDuePlafond: "",
            time,
            weekday,
            date,
            buienJson,
            ruth, mj, al, jw, hugo
        };
    } catch (err) {
        return { err: err.response ? err.response.body : err }
    }
};

module.exports = controller;