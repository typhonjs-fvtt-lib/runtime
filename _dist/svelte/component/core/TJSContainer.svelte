<script>
   export let warn = false;
   export let children = void 0;
</script>

<svelte:options accessors={true}/>

{#if Array.isArray(children)}
    {#each children as child}
        <svelte:component this={child.class} {...child.props} />
    {/each}
{:else if warn}
    <p>Container warning: No children.</p>
{/if}

<style>
    p {
        color: red;
        font-size: 18px;
    }
</style>