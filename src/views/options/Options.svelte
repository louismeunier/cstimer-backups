<script lang="ts">
    import { onMount } from "svelte";

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
                chrome.storage.local.set({settings: {showBackupTime: checked}});
            }}/>
        {/if}
    </main>
</div>