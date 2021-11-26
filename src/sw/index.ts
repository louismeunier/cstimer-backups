import createBackup from "../scripts/backup";
import utils from "../scripts/utils";
import alarm from "../scripts/alarms";
/**
 * Creates backup
 */
async function backup() {
    console.log("Backing up");
    const tab = await utils.getCSTimerTab();

    if (!tab.id) return;
    const backup = await chrome.scripting.executeScript({
        target: {
            tabId: tab.id
        },
        func: createBackup
    }).catch(err => console.log(err))
}

chrome.runtime.onInstalled.addListener(async details => {
    const DEFAULT_SETTINGS:Settings = {
        showBackupTime: true
    }

    if (details.reason == "install") {
        // set default settings on install
        chrome.storage.local.set({settings: DEFAULT_SETTINGS});
    }
    if (details.reason == "update") {
        // create alarm to automatically backup sessions
        alarm.createAlarm(1, backup);

        // update settings if new default keys don't exist when extension is updated
        const currentSettings = await chrome.storage.local.get("settings");
        for (const key in DEFAULT_SETTINGS) {
            if (!currentSettings[key]) {
                currentSettings[key] = DEFAULT_SETTINGS[key];
            }
        }
        chrome.storage.local.set(currentSettings)
    }
})

chrome.runtime.onMessage.addListener(async (message, sender, respond) => {
    console.log(message)
    if (message.message == "backup") 
        await backup()
    if (message.message == "open-options") { 
        chrome.runtime.openOptionsPage();
    }
})

chrome.storage.onChanged.addListener((changes, area) => {
    if (area == "local") {
        console.log(changes);
    }
})
export {};