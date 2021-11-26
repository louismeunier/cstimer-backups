export default {
    async getCurrentTab() {
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true});
        return tab;
    },
    async getCSTimerTab() {
        const [tab] = await chrome.tabs.query({ url: "*://cstimer.net/*" })
        return tab;
    },
    async settings() {
        const settings:Settings = await chrome.storage.local.get("settings");
        return settings;
    }
}