/**
 * Creates a backup of CSTimer sessions + settings
 */
 async function createBackup() {
    /**
     * Get csTimer session settings from local storage
     * @returns object
     */
    function getLocalStorage() {
        const sessionSettings = localStorage.getItem('properties');
        return sessionSettings;
    }

    /**
     * Get data from IndexedDB
     * @returns Promise<object>
     */
    function getIndexedDb(): Promise<{[key: string]: string}> {
        return new Promise((resolve, reject) => {
            let data = {};
            //handle different browsers
            window.indexedDB = window.indexedDB;
            window.IDBTransaction = window.IDBTransaction;
            window.IDBKeyRange = window.IDBKeyRange;

            if (!window.indexedDB) {
                //no indexedDB therefore no saved data
                reject("Database not found");
            }

            const csTimerDB = window.indexedDB.open("cstimer", 1);

            //success opening db
            csTimerDB.onsuccess = event => {
                const db = event.target.result;

                const request = db
                    .transaction("sessions")
                    .objectStore("sessions")
                    .openCursor()
                request.onsuccess = requestEvent => {
                    let cursor = requestEvent.target.result;
                    if (cursor) {
                        data[cursor.key] = cursor.value;
                        cursor.continue();
                    } else {
                        resolve(data);
                    }
                }
                //error getting keys+values
                request.onerror = error => {
                    reject("Can't get database keys");
                }
            }

            //error opening db
            csTimerDB.onerror = event => {
                reject("Can't open the database");
            }
        })   
    }

    /**
     * Format the IndexedDB appropriately 
     * @param {object} data 
     * @returns object
     */
    function formatIndexedDbResults(data: object): {[key:string]: string} {
        let formattedData = {};
        for (const keyIndex in Object.keys(data)) {
            const key = Object.keys(data)[keyIndex];
            const formattedKey = `session${key.split("_")[1].substr(1)}`;
            if (formattedData[formattedKey]) {
                formattedData[formattedKey].push(...data[key]);
            } else {
                formattedData[formattedKey] = data[key];
            }
        }
        return formattedData;
    }

    console.log("BACKING UP")
    const results = await getIndexedDb().catch(err => console.log(err));
    // handle errors better
    if (!results) return;
    const formattedSessions = formatIndexedDbResults(results);
    const sessionSettings = getLocalStorage();
    const fullBackup = {
        ...formattedSessions,
        properties: sessionSettings
    };
    
    console.log(fullBackup)

    chrome.storage.local.set({
        backup: fullBackup,
        lastBackupTime: new Date().getTime()
    })

    return fullBackup;
}

export default createBackup;