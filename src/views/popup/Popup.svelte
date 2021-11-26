<script lang="ts">
    async function handleClick() {
        chrome.runtime.sendMessage({message: "backup"}, () => {})
    }
</script>

<style>
    div {
        color: red;
    }
</style>

<div>
    <button on:click="{handleClick}">Backup</button>
</div>