// Background Service Worker
// Handles cookie classification, risk detection, and reset preference

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {

    if (request.action === "scanCookies"){

        scanCookies(request.domain)
            .then(result => sendResponse(result))
            .catch(error => {
                console.error(error);
                sendResponse({ error: "Failed to scan cookies" });
            });

        return true;
    }


    if (request.action === "resetCookies"){

        resetCookies(request.domain)
            .then(() => sendResponse({ status: "Cookies removed successfully!" }))
            .catch(error => {
                console.error(error);
                sendResponse({ status: "Error removing cookies" });
            });

        return true;
    }

});



/* ====== Cookie Classification ====== */

function classifyCookie(cookie, currentDomain){

    let partyType;
    let durationType;

    // First-party or Third-party
    if (cookie.domain.includes(currentDomain)){
        partyType = "First-Party";
    } else {
        partyType = "Third-Party";
    }

    // Session or Persistent
    if (cookie.session){
        durationType = "Session Cookie";
    } else {
        durationType = "Persistent Cookie";
    }

    return{
        party: partyType,
        duration: durationType
    };
}


/* ====== Risk Model ====== */

function detectRisk(cookie, classification){

    let riskScore = 0;

    // High level risk
    if (classification.party === "Third-Party"){
        riskScore += 3;
    }

    // Medium level risk
    if (classification.duration === "Persistent Cookie"){
        riskScore += 2;
    }

    // Long expiration time
    if (cookie.expirationDate){

        const remainingDays =
            (cookie.expirationDate * 1000 - Date.now()) /
            (1000 * 60 * 60 * 24);

        if (remainingDays > 30){
            riskScore += 2;
        }
    }

    // Advertising and tracking indicators
    const trackingKeywords = [
        "track",
        "analytics",
        "ads",
        "pixel",
        "doubleclick",
        "facebook"
    ];

    for (let keyword of trackingKeywords){

        if (cookie.name.toLowerCase().includes(keyword) || cookie.domain.toLowerCase().includes(keyword)){
            riskScore += 3;
        }
    }

    // Convert score to label
    if (riskScore <= 2) return "Low";
    if (riskScore <= 5) return "Medium";

    return "High";
}



/* ====== Cookie Scanning ====== */

async function scanCookies(domain){

    const cookies = await chrome.cookies.getAll({ domain: domain });

    let results = [];

    for (let cookie of cookies){

        const classification = classifyCookie(cookie, domain);
        const risk = detectRisk(cookie, classification);

        results.push({
            name: cookie.name,
            partyType: classification.party,
            durationType: classification.duration,
            riskLevel: risk
        });

    }

    return{
        totalCookies: cookies.length,
        cookies: results
    };

}



/* ====== Reset Cookie Preference ====== */

async function resetCookies(domain){

    const cookies = await chrome.cookies.getAll({ domain: domain });

    for (let cookie of cookies){

        const cookieUrl =
            (cookie.secure ? "https://" : "http://") +
            cookie.domain.replace(/^\./, "") +
            cookie.path;

        try{

            await chrome.cookies.remove({
                url: cookieUrl,
                name: cookie.name
            });

        } 
        catch (error){

            console.log("Failed to remove cookie:", cookie.name);

        }
    }

}