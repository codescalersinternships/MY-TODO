<script lang="ts">
  import Card from "./Card.svelte";
  import TodosDataService from "../../services/todo";
  import type { TodoType } from "../../types";
  import { TodoListStore, SettingsStore } from "../../stores";

  let text = "";
  let btnDisabled = true;
  let min = 10;
  let message: string;
  let validateInput = "";
  let error: Error;
  const handleInput = () => {
    const textLength = text.trim().length;

    if (textLength <= min) {
      message = `Text must be at least ${min} characters`;
      validateInput = "wrong-input";
      btnDisabled = true;
    } else if (textLength > min) {
      message = null;
      btnDisabled = false;
      validateInput = "correct-input";
    }
  };
  const handleSubmit = async () => {
    if (text.trim().length > min) {
      const newTodo: TodoType = {
        task: text,
        author: $SettingsStore["name"],
        status: false,
      };
      try {
        console.log("before @Form.svelte", $TodoListStore);
        let newTodoData = (await TodosDataService.create(newTodo)).data;
        TodoListStore.update((currentTodoList) => {
          return [newTodoData, ...currentTodoList];
        });
        console.log("after @Form.svelte", $TodoListStore);

        text = "";
        validateInput = "";
        btnDisabled = true;
      } catch (e) {
        error = e;
      }
    }
  };
  $: name =
    $SettingsStore["name"] === null
      ? "Your Name"
      : $SettingsStore["name"].split("#")[0];
</script>

<Card>
  <header>
    <h2>
      Hello 👋, {name}
    </h2>
  </header>
  <form on:submit|preventDefault={handleSubmit}>
    <div class="input-group {validateInput}">
      <input
        type="text"
        on:input={handleInput}
        bind:value={text}
        placeholder="Write your ideas now !"
        maxlength="30"
        minlength="10"
        id="inputField"
      />
      <button disabled={btnDisabled} class:btnDisabled id="submit" type="submit">
        Submit
        <i class="fa-regular fa-plus icon" />
      </button>
    </div>
    {#if message}
      <div class="message">
        {message}
      </div>
    {/if}
    {#if error}
      <div class="message">
        {error.message}
      </div>
    {/if}
  </form>
</Card>

<style>
  header {
    max-width: 400px;
    margin: auto;
  }
  header h2 {
    font-size: 22px;
    font-weight: 600;
    text-align: center;
  }
  .input-group {
    display: flex;
    flex-direction: row;
    border: 1px solid #ccc;
    padding: 8px 10px;
    border-radius: 8px;
    margin-top: 15px;
  }
  input {
    flex-grow: 2;
    border: none;
    font-size: 16px;
  }
  input:focus {
    outline: none;
  }
  .message {
    padding-top: 10px;
    margin-bottom: -30px;
    text-align: center;
    color: #f44;
  }
  button {
    color: #fff;
    border: 0;
    border-radius: 10px;
    color: #fff;
    width: 100px;
    height: 40px;
    cursor: pointer;
    background-color: var(--primary-color);
    color: var(--text-color);
  }
  .btnDisabled {
    opacity: 0.2;
    cursor: pointer;
  }
  .icon {
    font-size: 1rem;
    font-weight: bold;
    margin-left: 0.1rem;
  }
  .correct-input {
    border: #6f6 2px solid;

  }


  .wrong-input {
    border: #f44 2px solid;
  }
  @keyframes s-ripple {
    0% {
      transform: scale(0);
    }
    20% {
      transform: scale(1);
    }
    100% {
      opacity: 0;
      transform: scale(1);
    }
  }
  @keyframes s-ripple-dup {
    0% {
      transform: scale(0);
    }
    30% {
      transform: scale(1);
    }
    60% {
      transform: scale(1);
    }
    100% {
      opacity: 0;
      transform: scale(1);
    }
  }
</style>
