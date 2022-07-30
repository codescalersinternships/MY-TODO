<script lang="ts">
  import Footer from "./components/footer/Footer.svelte";
  import TodoList from "./components/todoList/TodoList.svelte";
  import Form from "./components/form/Form.svelte";
  import Settings from "./components/settings/Settings.svelte";
  import SettingsApi from "./components/settings/SettingsApi";
  import { onMount } from "svelte";
  import { SettingsStore } from "./stores";
  import Image from "./components/image/Image.svelte";

  onMount(async function () {
    $SettingsStore = await SettingsApi.getSettings();
  });
  let rootElement: HTMLDivElement;

  $: rootElement &&
    rootElement.style.setProperty(
      "--primary-color",
      $SettingsStore["primary-color"]
    );
  $: rootElement &&
    rootElement.style.setProperty(
      "--secondary-color",
      $SettingsStore["secondary-color"]
    );
  $: rootElement &&
    rootElement.style.setProperty(
      "--background-image",
      $SettingsStore["background-image"]
    );
</script>

<div class="fluid-container all" bind:this={rootElement}>
  <div class="container p-5">
    <div class="body">
      <div class="center">
        <Image src={"assets/logo.png"} />
      </div>
      <Settings />
      <Form />
      <TodoList />
    </div>
  </div>
  <Footer />
</div>

<style>
  :root {
    --primary-color: inherit;
    --secondary-color: inherit;
    --background-image: inherit;
    --text-color: var(var(--secondary-color));
    font-family: "Quicksand", sans-serif;
  }
  .all {
    background-image: var(--background-image);
    min-height: 100vh;
    min-width: 100vh;
    background-size: cover;
    background-repeat: no-repeat;
    background-position: center center;
    background-size: cover;
    background-attachment: fixed;
  }
  .body {
    background-color: var(--secondary-color);
    max-height: 80vh;
    border-radius: 10px;
    padding: 4rem;
    width: 100%;
    overflow: hidden;
  }
  .center {
    text-align: center;
    height: 100px;
    margin-top: -100px;
  }
</style>
