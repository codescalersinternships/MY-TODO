<script lang="ts">
  import DateFilter from "./DateFilter.svelte";
// sort by date
/* function sortByDate() {
    $TodoListStore.sort((a: TodoType, b: TodoType): number => {
      return new Date(b.CreatedAt) - new Date(a.CreatedAt);
    });
  }
  
// filter by date range
function filterByDateRange() {
    $TodoListStore.filter((t: TodoType) => {
      return new Date(t.CreatedAt) >= new Date("2020-01-01") &&
        new Date(t.CreatedAt) <= new Date("2020-01-31");
    });
  }
  
 */
</script>

<div class="filters">
  <DateFilter />
</div>

<style>
  .filters {
    --applyButtonWidth: 6rem;
    --applyButtonHeight: 2rem;
    --applyButtonColor: var(--text-color);
    --applyButtonBackgroundColor: var(--primary-color);
    --sliderStartBackgroundColor: var(--text-color);
    --sliderEndBackgroundColor: var(--text-color);
    --dateSelectColor: var(--text-color);
    --headingColor: var(--text-color);
    display: flex;
    width: 100%;
    justify-content: space-evenly;
    align-items: center;
    margin: 25px auto;
    gap: 0.7rem;
  }
</style>
