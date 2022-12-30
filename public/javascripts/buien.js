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
    let periodPrecip;

    for (let i = 0; i < buienData.length; i++) {
        const periodData = buienData[i];
        const period = periodData.time;
        const precip = Math.min(100, Math.pow(10, (periodData.precip - 109) / 32) * 10); //mm*10, max 100 (10mm)
        const barHeight = ((height - 2) / 100) * precip; // als het meer dan 10mm wordt zie je het niet meer.

        context.fillRect(i * barSize + 1, height - barHeight - 2, barSize - 2, barHeight);

        if (!firstPeriod && precip > 0) {
            periodPrecip = Math.round(precip) / 10;
            if (periodPrecip > 0.0) {
                firstPeriod = period;
            }
        }
    }

    context.beginPath();
    context.moveTo(0, height);
    context.lineTo(width, height);
    context.closePath();
    context.stroke();

    if (firstPeriod) {
        buienTekst.innerText = periodPrecip.toLocaleString("nl-NL") + " mm neerslag verwacht om " + firstPeriod;
    } else {
        buienTekst.innerText = "Geen neerslag verwacht.";
    }

} else {

    buienTekst.innerText = "Geen neerslaggegevens gevonden";

}