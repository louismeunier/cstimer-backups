<script lang="ts">
    import { onMount } from "svelte";

    async function downloadBackup() {
        const backupSessions = await chrome.storage.local.get("backup");
        console.log(backupSessions);
        const url = "data:text/plain;charset=utf-8, " + encodeURIComponent(JSON.stringify(backupSessions["backup"]));
        chrome.downloads.download({
            filename: `csTimerBackup.txt`,
            url:url
        });

    }
    let currentSettings;

    onMount(async () => {
        currentSettings = await chrome.storage.local.get("settings");
        console.log(currentSettings);
    })
</script>

<style>
    main {
        display: flex;
        flex-direction: column;
        height: 100%;
        margin-left: 15rem;
        margin-right: 15rem;
    }
</style>

<div>
    <main>
        <h1>CSTimer Backups</h1>
        <h2>Options</h2>
        {#if currentSettings}
            <input type="checkbox" checked={currentSettings.settings.showBackupTime} on:change={(e) => {
                // @ts-ignore
                const checked = e.target.checked;
                const newSettings = {...currentSettings.settings, showBackupTime: checked}
                chrome.storage.local.set({settings: newSettings});
            }}/>
            <input type="number" min="1" value={currentSettings.settings.interval} on:change={(e) => {
                // @ts-ignore
                const value = parseInt(e.target.value);
                const newSettings = {...currentSettings.settings, interval: value};
                chrome.storage.local.set({settings: newSettings})
            }}/>
            <span>{currentSettings.settings.interval}</span>
        {/if}
        <button on:click={downloadBackup}>download latest session</button>
    </main>
</div>