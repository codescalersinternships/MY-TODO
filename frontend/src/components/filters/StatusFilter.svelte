<script>
  import { createEventDispatcher } from "svelte";

  const dispatch = createEventDispatcher();

  let allClicked = "active";
  let notCompletedClicked = "";
  let completedClicked = "";
  function handleStatus(status) {
    dispatch("handleStatus", { status: status });
    switch (status) {
      case null:
        allClicked = "active";
        notCompletedClicked = "";
        completedClicked = "";
        break;
      case false:
        allClicked = "";
        notCompletedClicked = "active";
        completedClicked = "";
        break;
      case true:
        allClicked = "";
        notCompletedClicked = "";
        completedClicked = "active";
        break;
    }
  }
</script>

<div class="status-filters">
  <button
    on:click={() => {
      handleStatus(null);
    }}
    class={allClicked}>All</button
  >
  <button
    on:click={() => {
      handleStatus(false);
    }}
    class={notCompletedClicked}>Not Yet</button
  >
  <button
    on:click={() => {
      handleStatus(true);
    }}
    class={completedClicked}>Completed</button
  >
</div>

<style>
  .status-filters {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .status-filters button {
    border: 1px solid #ccc;
    border-radius: 5px;
    padding: 5px 10px;
    margin: 0 10px;
    font-size: 14px;
    font-weight: bold;
    color:var(--text-color);
    background-color: var(--primary-color);
    cursor: pointer;
  }
  .active {
    background-color: var(--secondary-color) !important;
  }
</style>
