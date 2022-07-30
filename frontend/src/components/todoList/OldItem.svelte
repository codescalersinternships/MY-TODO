<script lang="ts">
  import type { TodoType } from "../../types";

  export let data:TodoType;
</script>

<div class="container">
  <div class="row justify-content-center">
    <div class="col-md-6 item">{data.task}</div>
  </div>
</div>

<style>

  .item{
    background-color: var(--primary-color);
    border-radius: 4px;
    padding: 20px;
    margin-bottom: 20px;
  }
  .items{
    display: flex;
    flex-direction: column;
    align-items: center;
  }
</style>


