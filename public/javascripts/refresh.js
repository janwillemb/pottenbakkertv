const href = window.location.href;
setInterval(() => {
    fetch(href).then((response) => {
        return response.text();
    }).then((text) => {
        const div = document.createElement("div");
        div.innerHTML = text;
        const divs = div.getElementsByTagName("div");
        let newLeftCol;
        let newDateTime;
        let newBuienData;
        for (let i = 0; i < divs.length; i++) {
            if (divs[i].id == "leftcol") {
                newLeftCol = divs[i];
            }
            if (divs[i].id == "datetime") {
                newDateTime = divs[i];
            }
        }

        const leftCol = document.getElementById("leftcol");
        leftCol.replaceWith(newLeftCol);
        const datetime = document.getElementById("datetime");
        datetime.replaceWith(newDateTime);
    });
}, 1000);

setTimeout(() => {
    // refresh entire page after 5 mins.
    window.location.reload();
}, 5 * 60 * 1000);