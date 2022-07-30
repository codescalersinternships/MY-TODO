<script lang="ts">
  // get todays date
  const todayDate = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
</script>

<span class="today-date">{todayDate}</span>

<style>
  .today-date {
    font-size: 1.2rem;
    font-weight: bold;
    color: #222;
    margin-bottom: 0.6rem;
  }
</style>
