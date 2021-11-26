import createBackup from "../scripts/backup";
import utils from "../scripts/utils";

chrome.runtime.onMessage.addListener(async (message, sender, respond) => {
    if (message.message == "backup") {
        const tab = await utils.getCSTimerTab();

        if (!tab.id) return;
        const backup = await chrome.scripting.executeScript({
            target: {
                tabId: tab.id
            },
            func: createBackup
        }).catch(err => console.log(err))
    }
})

chrome.storage.onChanged.addListener((changes, area) => {
    if (area == "local") {
        console.log(changes);
    }
})
export {};