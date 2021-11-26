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
        showBackupTime: true,
        interval: 1
    }

    if (details.reason == "install") {
        // set default settings on install
        chrome.storage.local.set({settings: DEFAULT_SETTINGS});

        alarm.createAlarm(DEFAULT_SETTINGS.interval, backup);
    }
    if (details.reason == "update") {

        // update settings if new default keys don't exist when extension is updated
        const search = await chrome.storage.local.get("settings");
        const currentSettings:Settings = search["settings"];
        for (const key in DEFAULT_SETTINGS) {
            if (!currentSettings[key]) {
                currentSettings[key] = DEFAULT_SETTINGS[key];
            }
        }
        chrome.storage.local.set(currentSettings)
        console.log(currentSettings);

        // create alarm to automatically backup sessions
        alarm.createAlarm(currentSettings.interval, backup);
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

chrome.storage.onChanged.addListener(async (changes, area) => {
    if (area == "local") {
        console.log(changes);
        if (changes.settings) {
            if (changes.settings.oldValue.interval != changes.settings.newValue.interval) {
                console.log("interval changed")
                alarm.createAlarm(changes.settings.newValue.interval, backup);
            }
        }
    }
})
export {};