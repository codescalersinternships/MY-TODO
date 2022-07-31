<script lang="ts">
  import type { TodoType } from "../../types";
  import TodosDataService from "../../services/todo";
  import { SettingsStore, TodoListStore } from "../../stores";
  import { onMount } from "svelte";
  import { fade, scale } from "svelte/transition";
  import SettingsApi from "../settings/SettingsApi";
  import Item from "./Item.svelte";
  import Paging from "./Paging.svelte";
  import StatusFilter from "../filters/StatusFilter.svelte";
  let error = "";

  // Getting tasks
  onMount(async function () {
    try {
      // todo make it uuid
      SettingsApi.updateSettings();
      let todoList = (
        await TodosDataService.getByAuthor($SettingsStore["name"])
      ).data;
      TodoListStore.set(todoList);
    } catch (err) {
      error = err.message;
    }
  });
  // Deleting Tasks
  async function handleDeleteItem(event: { detail: { id: number } }) {
    let id = event.detail.id;
    // parse string to int
    await TodosDataService.delete(id);
    // todo set it to store
    TodoListStore.set($TodoListStore.filter((t: TodoType) => t.ID !== id));
    tasksCount = $TodoListStore.length;
    tasksDone = $TodoListStore.filter(
      (t: TodoType) => t.status === true
    ).length;
     
    currentPage = 0;
  }

  // Updating Tasks
  async function handleUpdateItem(event: {
    detail: { id: number; status: boolean; task: string };
  }) {
    let id = event.detail.id;
    let status = event.detail.status;
    let task = event.detail.task;

    await TodosDataService.update(id, {
      ID: id,
      author: $SettingsStore["name"],
      status: status,
      task: task,
    });

    TodoListStore.set(
      $TodoListStore.map((t: TodoType) =>
        t.ID === id ? { ...t, status: status, task: task } : t
      )
    );
    tasksDone = $TodoListStore.filter(
      (t: TodoType) => t.status === true
    ).length;
  }

  $: currentPage = 0;
  $: filteredTodoList = $TodoListStore;
  function triggerFlip(event: { detail: { page: number } }) {
    currentPage = event.detail.page;
  }
  function handleStatus(event: { detail: { status: boolean } }) {
    let status = event.detail.status;
    if (status === null) {
      filteredTodoList = $TodoListStore;
      return;
    }

    filteredTodoList = $TodoListStore.filter(
      (t: TodoType) => t.status === status
    );
  }
  $: tasksCount = $TodoListStore.length;
  $: tasksDone = $TodoListStore.filter(
    (t: TodoType) => t.status === true
  ).length;
</script>

{#if error || $TodoListStore.length === 0}
  <p class="list-status">No Items Exist {error}</p>
{:else}
  <div class="list">
    <div class="status">
      <div class="status-buttons">
        <StatusFilter on:handleStatus={handleStatus} />
      </div>
      <div class="count">Tasks : {tasksDone}/{tasksCount}</div>
    </div>
    {#each filteredTodoList.slice(3 * currentPage, 3 * (currentPage + 1)) as todo, index (todo.ID)}
      <div in:scale out:fade={{ duration: 400 }}>
        <Item
          counter={index + 1}
          id={todo.ID}
          task={todo.task}
          status={todo.status}
          CreatedAt={todo.CreatedAt}
          on:delete={handleDeleteItem}
          on:update={handleUpdateItem}
        />
      </div>
    {/each}
    <Paging
      pageLength={Math.ceil(filteredTodoList.length / 3)}
      on:triggerFlip={triggerFlip}
      {currentPage}
    />
  </div>
{/if}

<style>
  .status {
    font-size: 2rem;
    font-weight: bold;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 0.8rem;
    margin-top: -2rem;
  }

  .list {
    padding: 15px;
  }

  .list-status {
    margin: 0;
    text-align: center;
    color: #ffffff;
    font-weight: bold;
    font-size: 1.1em;
  }
</style>
