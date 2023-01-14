const buienGrafiek = document.getElementById("buiengrafiek");
const buienTekst = document.getElementById("buientekst");
const context = buienGrafiek.getContext("2d");

if (buienData.length > 0) {

    const width = buienGrafiek.clientWidth;
    const barSize = width / buienData.length;
    const height = buienGrafiek.clientHeight;

    context.fillStyle = "white";
    context.strokeStyle = "white";

    let firstPeriod;
    let periodPrecip = 0;
    let numPeriodsWithRain = 0;

    for (let i = 0; i < buienData.length; i++) {
        const periodData = buienData[i];
        const period = periodData.time;
        const precip = Math.min(100, Math.pow(10, (periodData.precip - 109) / 32) * 10); //mm*10, max 100 (10mm)
        const barHeight = ((height - 2) / 100) * precip; // als het meer dan 10mm wordt zie je het niet meer.

        context.fillRect(i * barSize + 1, height - barHeight - 2, barSize - 2, barHeight);

        if (precip > 0) {
            periodPrecip += precip / 10;
            if (!firstPeriod && periodPrecip > 0.0) {
                firstPeriod = period;
            }
        }

        if (firstPeriod) {
            numPeriodsWithRain++;
        }
    }

    context.beginPath();
    context.moveTo(0, height);
    context.lineTo(width, height);
    context.closePath();
    context.stroke();

    if (numPeriodsWithRain > 0) {
        let rain;
        if (numPeriodsWithRain > 12) {
            // do one hour in advance
            const averagePer5Min = periodPrecip / numPeriodsWithRain;
            const mmPerHour = Math.round(averagePer5Min * 12 * 10) / 10;
            rain = "gemiddeld " + mmPerHour.toLocaleString("nl-NL") + " mm/u";
        } else {
            periodPrecip = Math.round(periodPrecip * 10) / 10;
            rain = "totaal " + periodPrecip.toLocaleString("nl-NL") + " mm";
        }

        buienTekst.innerText = "Regen vanaf " + firstPeriod + ", " + rain;
    } else {
        buienTekst.innerText = "Komende uur geen neerslag verwacht.";
    }

} else {

    buienTekst.innerText = "Geen neerslaggegevens gevonden";

}