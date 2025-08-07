<script>
    import BootScreen from './BootScreen.svelte';
    import Desktop from './Desktop.svelte';
    
    let bootComplete = false;
    
    function handleBootComplete() {
        bootComplete = true;
    }
</script>

{#if !bootComplete}
    <BootScreen on:bootComplete={handleBootComplete} />
{/if}

{#if bootComplete}
    <Desktop />
{/if}

<style>
    /* App-level styles if needed */
</style>
