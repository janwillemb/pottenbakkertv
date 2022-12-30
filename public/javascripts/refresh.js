const href = window.location.href;
let isSwapped = false;

setInterval(() => {
    fetch(href).then((response) => {
        return response.text();
    }).then((text) => {
        const div = document.createElement("div");
        div.innerHTML = text;
        const divs = div.getElementsByTagName("div");
        let newLeftCol;
        let newDateTime;
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

        if (isSwapped) {
            fixCssAfterSwap();
        }
    });
}, 1000);

setTimeout(() => {
    // refresh entire page after 5 mins.
    window.location.reload();
}, 5 * 60 * 1000);


function fixCssAfterSwap() {
    const rightCol = document.getElementById("rightcol");
    const leftCol = document.getElementById("leftcol");

    leftCol.style.marginLeft = "0px";
    leftCol.style.marginRight = "200px";
    leftCol.style.paddingRight = "0px";
    leftCol.style.paddingLeft = "40px";

    rightCol.style.marginLeft = "200px";
    rightCol.style.marginRight = "0px";
    rightCol.style.paddingRight = "40px";
    rightCol.style.paddingLeft = "0px";
    rightCol.style.textAlign = "left";
}

// switch the columns each 10 minutes, to prevent the screensaver from kicking in
function doSwap() {
    const rightCol = document.getElementById("rightcol");
    const leftcol = document.getElementById("leftcol");
    rightCol.style.marginRight = "40px";
    leftcol.parentElement.insertBefore(rightCol, leftcol);
    isSwapped = true;
    fixCssAfterSwap();
}
const minutes = Math.floor(new Date().getMinutes() / 10);
if (minutes % 2 == 0) {
    doSwap();
}

