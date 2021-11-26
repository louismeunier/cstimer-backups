const Alarm = {
    /**
     * Wrapper of chrome.alarms.create to handle creating, clearing, and listening
     * @param interval Interval of time to run the alarm
     * @param callback Function to run every time the alarm goes off
     */
    async createAlarm(interval: number, callback?: Function) {
        console.log("created alarm")
        function onAlarm(alarm:chrome.alarms.Alarm) {
            if (alarm.name == "auto-backup") {
                callback();
            }
        };

        await chrome.alarms.clearAll();

        chrome.alarms.create(
            "auto-backup",
            {
                periodInMinutes: interval,
                delayInMinutes: interval
            }
        )

        chrome.alarms.onAlarm.removeListener(onAlarm);
        chrome.alarms.onAlarm.addListener(onAlarm);
    },

}

export default Alarm;