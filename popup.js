const scanBtn = document.getElementById("scan");
const resetBtn = document.getElementById("reset");
const resultsDiv = document.getElementById("results");

let currentDomain = "";

// Get active tab domain
async function getCurrentDomain(){

    const tabs = await chrome.tabs.query({
        active: true,
        currentWindow: true
    });

    const url = new URL(tabs[0].url);
    currentDomain = url.hostname;

    return currentDomain;
}



/* ====== Scan Cookie Button ====== */

scanBtn.addEventListener("click", async () => {

    const domain = await getCurrentDomain();

    chrome.runtime.sendMessage(
        {
            action: "scanCookies",
            domain: domain
        },
        function (response){

            displayCookies(response);

        }
    );

});



/* ====== Reset Cookie Button ====== */

resetBtn.addEventListener("click", async () => {

    const domain = await getCurrentDomain();

    chrome.runtime.sendMessage(
        {
            action: "resetCookies",
            domain: domain
        },
        function (response){
            resultsDiv.innerHTML = `
                <div id="resetBox">
                <h4>${response.status}</h4>
                <p>Please reload or refresh the current website</p>
                </div>
            `;

        }
    );

});



/* ====== Result Display ====== */

function displayCookies(data){

    if (!data || !data.cookies) {
        resultsDiv.innerHTML = "No cookies found.";
        return;
    }

    let low = 0;
    let medium = 0;
    let high = 0;

    // Count cookies by risk level
    data.cookies.forEach(cookie => {
        if (cookie.riskLevel === "Low") low++;
        else if (cookie.riskLevel === "Medium") medium++;
        else if (cookie.riskLevel === "High") high++;
    });

    // Header summary
    let html = `
        <ul class="statAll">
            <li><h3>${low}</h3><p>Low Risk</p></li>
            <li><h3>${medium}</h3><p>Medium Risk</p></li>
            <li><h3>${high}</h3><p>High Risk</p></li>
        </ul>
    `;

    data.cookies.forEach(cookie => {

        let riskColor = "green";

        if (cookie.riskLevel === "Medium")
            riskColor = "orange";

        if (cookie.riskLevel === "High")
            riskColor = "red";

        html += `
        <div class="cookieItem">
            <b>${cookie.name}</b><br>
            Type: ${cookie.partyType}<br>
            Duration: ${cookie.durationType}<br>
            Risk: <span style="color:${riskColor}">${cookie.riskLevel}</span>
        </div>
        `;
    });

    resultsDiv.innerHTML = html;
}