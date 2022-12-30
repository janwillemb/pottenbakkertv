const axios = require('axios');

let controller = {};

controller.getIndexModel = async () => {
    const baseUrl = "http://192.168.50.221:8080/json.htm?type=devices&rid=";
    try {
        // binnen temp
        let response = await axios.get(baseUrl + "37");
        const roomTemp = response.data.result[0].Temp;
        // binnen vocht
        response = await axios.get(baseUrl + "38");
        const roomHumid = response.data.result[0].Humidity;
        const roomHumidLabel = "normaal";
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

        // zonnepanelen
        response = await axios.get(baseUrl + "4");
        const solar = response.data.result[0].Data;
        const solarWatt = Number(solar.replace(/[^\d.]/g, ''));

        // zonnepanelen
        response = await axios.get(baseUrl + "5");
        const gasRaw = response.data.result[0].CounterToday;
        let gas = Number(gasRaw.replace(/[^\d.]/g, ''));
        let gasDue = 0;
        const gasPriceDecember = 2.71925;
        const gasPerDayDecember = 0.68618;
        const gasPriceJan = 2.55813;
        const gasPerDayJan = 0.20822;
        const gasPriceFeb = 2.35777;
        const gasPerDayFeb = 0.20822;

        const today = new Date();
        if (today.getFullYear() == 2022) {
            gasDue = gasPriceDecember * gas + gasPerDayDecember;
        } else if (today.getFullYear() == 2023 && today.getMonth() == 0) {
            gasDue = gasPriceJan * gas + gasPerDayJan;
        } else {
            gasDue = gasPriceFeb * gas + gasPerDayFeb;
        }
        gasDue = Math.round(gasDue * 100) / 100;
        gas = Math.round(gas * 1000) / 1000;

        // date
        let weekday = today.toLocaleString("nl-NL", { weekday: 'long' });
        let time = today.toLocaleTimeString("nl-NL", { hour: 'numeric', minute: 'numeric'});
        let date = today.toLocaleDateString("nl-NL", { year: "numeric", month: "long", day: "numeric" });

        // buienradar
        const buienData = [];
        try {
            response = await axios.get("https://gpsgadget.buienradar.nl/data/raintext?lat=52.2&lon=6.01");
            const buienradarData = response.data;
            const lines = buienradarData.replace(/\r/g,'').split("\n");
            
            for (let i = 0; i < lines.length; i++) {
                const periodData = lines[i].split("|");
                const precip = Number(periodData[0]);
                const time = periodData[1];
                buienData.push({time, precip});
            }
        } catch (errbuien) {
        }
        const buienJson = JSON.stringify(buienData);

        return {
            roomTemp,
            roomHumid,
            roomHumidLabel,
            ppm,
            airQuality,
            temp,
            feelTemp,
            humid,
            humidLabel,
            watt,
            solarWatt,
            gas,
            gasDue,
            time,
            weekday,
            date,
            buienJson
        };
    } catch (err) {
        return { err: err.response ? err.response.body : err }
    }
};


module.exports = controller;