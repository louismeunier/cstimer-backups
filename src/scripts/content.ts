import utils from "./utils";

async function setPageInfo(time: number) {
    const lastBackupTime = document.getElementById("--ext-last-backup-time");
    lastBackupTime.innerText = new Date(time).toLocaleString();
}

utils.settings().then(settings => {
    console.log(settings)
    chrome.storage.onChanged.addListener((changes, where) => {
        if (where == "local" && Object.keys(changes).indexOf("lastBackupTime") != -1) {
            setPageInfo(changes["lastBackupTime"].newValue);
        }
    })

    if (settings.showBackupTime == false) return;
    
    chrome.storage.local.get("lastBackupTime").then(async time => {
        const newDisplay = document.createElement("span");

        newDisplay.id = "--ext-last-backup-time";
        newDisplay.className = "click";

        if (time["lastBackupTime"]) {
            newDisplay.innerText = new Date(time["lastBackupTime"]).toLocaleString();
        } else {
            newDisplay.innerText = "No backups yet";
        }

        newDisplay.style.fontSize = "15px";
        newDisplay.style.textAlign = "center";
        newDisplay.style.position = "fixed";
        newDisplay.style.bottom = "0";
        newDisplay.style.width = "100%";
        newDisplay.style.marginBottom = "5px";

        document.body.appendChild(newDisplay);
    });
}).catch(err => console.log(err));