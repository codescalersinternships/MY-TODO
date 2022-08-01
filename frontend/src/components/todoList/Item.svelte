<script>
  import { dialogs } from "svelte-dialogs";

  import { createEventDispatcher } from "svelte";

  export let id, task, status, counter, CreatedAt;
  const dispatch = createEventDispatcher();

  function triggerUpdate() {
    dispatch("update", { id:id, task:task, status:status });
  }

  function handleDoubleClick() {
    const yes = confirm("Are you sure you wish to delete this item?");

    if (yes) {
      dispatch("delete", {id:id});
    }
  }
</script>

<div class="item" class:status>
  {counter} .&nbsp;&nbsp;&nbsp;&nbsp;
  <input
    class="text-input"
    type="text"
    bind:value={task}
    readonly={status}
    on:keyup={({ key, target }) => key === "Enter" && target.blur()}
    on:blur={() => triggerUpdate()}
    maxlength="30"
  />
  <input
    class="complete-checkbox"
    type="checkbox"
    bind:checked={status}
    on:change={() => triggerUpdate()}
  />
  <button id="close" on:click={handleDoubleClick}>X</button>
  <span class="created-at"> {new Date(CreatedAt).toLocaleDateString("en-US")}</span>
</div>

<style>
  .item {
    display: flex;
    align-items: center;
    padding: 15px;
    background: #ffffff;
    color: black;
    font-size: 1.2rem;
    margin-bottom: 0.6rem;
    border-bottom: #222 2px solid;
  }
  
  #close {
    position: relative;
    top: -25px;
    font-weight: bold;
    left: 70px;
    cursor: pointer;
    color:var(--text-color);
    background: none;
    border: none;
  }
  .created-at {
    font-size: 0.8rem;
    color: #aaa;
    margin-top: 2.5rem;
    margin-left: 1.2rem;
  }

  .item:focus-within {
    background: rgba(255, 255, 255, 0.8);
  }

  .item.status {
    background: #dddddd;
  }

  .item.status .text-input {
    color: #666666;
    text-decoration: line-through;
  }

  .text-input {
    flex-grow: 1;
    background: none;
    border: none;
    outline: none;
    font-weight: 500;
    font-size: 1em;
  }

 /* checkbox*/
   .complete-checkbox {
    margin-left: 15px;
  }
  input[type="checkbox"] {
    -webkit-appearance: none;
    width: 1.5rem;
    height: 1.5rem;
    border: 1px solid #ccc;
    border-radius: 2px;
    cursor: pointer;
    animation: s-ripple 300ms ease-out;
  } 
  input[type="checkbox"]:checked {
    background: #6f6;
    animation: s-ripple-dup 300ms ease-in;
  }
  @keyframes s-ripple {
    0% {
      transform: scale(0);
    }
    33.3% {
      transform: scale(1.1);
    }
    66.6% {
      transform: scale(1.2);
    }
    100% {
      transform: scale(1.3);
    }
  }
  @keyframes s-ripple-dup {
    0% {
      transform: scale(0);
    }
    33.3% {
      transform: scale(1.1);
    }
    66.6% {
      transform: scale(1.2);
    }
    100% {
      transform: scale(1.3);
    }
  }
</style>
