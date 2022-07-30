<script>
  import { createEventDispatcher } from "svelte";
  const dispatch = createEventDispatcher();
  export let pageLength, currentPage;


  $: pageArr = Array.from({ length: pageLength }, (v, i) => i);

  function triggerUpdate(page) {
    dispatch("triggerFlip", { page: page });
  }
</script>

<div class="pages">
  {#each pageArr as page (page)}
    {#if page === currentPage}
      <button class="page choosen" on:click={() => triggerUpdate(page)}
        >{page+1}</button
      >
    {:else}
      <button class="page" on:click={() => triggerUpdate(page)}>{page+1}</button>
    {/if}
  {/each}
</div>

<style>
  .pages {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 20px;
    gap: 0.5rem;
  }
  .page {
    display: inline-block;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 5px;
    cursor: pointer;
    color: #ccc;
    background-color: #202142;
    text-align: center;
  }
  .choosen {
    background-color: #fff;
    color: #202142;
  }
</style>
