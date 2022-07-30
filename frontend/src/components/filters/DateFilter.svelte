<script>
  import { createEventDispatcher } from "svelte";
  const dispatch = createEventDispatcher();
  import DateRangeSelect from "svelte-date-range-select";
  let range = {
    startDate: null,
    endDate: null,
  };
  const name = "createdDate";

  const heading = "Created Date";

  // this limits the HTML5 date picker end date - e.g. today is used here
  const endDateMax = new Date();

  // this limits the HTML5 date picker's start date - e.g. 3 years is select here
  const startDateMin = new Date(
    new Date().setFullYear(endDateMax.getFullYear(), endDateMax.getMonth() - 36)
  );

  // option to override the defaults - change to other language, below are the default values
  const labels = {
    notSet: "not set",
    greaterThan: "greater than",
    lessThan: "less than",
    range: "range",
    day: "day",
    days: "days",
    apply: "Apply",
  };

  // form post ids
  const startDateId = "start_date_id";
  const endDateId = "end_date_id";
  // executed when the user selects the range by clicking the apply button (with the fa-check icon)

  function handleApplyDateRange(data) {
    // e.g. will return an object
    // {
    range = data.detail;
    dispatch("applyDateRange", {
      startDate: data.detail.startDate,
      endDate: data.detail.endDate,
    });

    //  startDate: 2000-12-01,
    //  endDate: 2020-04-06,
    //  name: createdDate
    // }
  }
</script>

<DateRangeSelect
  {startDateMin}
  {endDateMax}
  {name}
  {heading}
  {labels}
  {startDateId}
  {endDateId}
  on:onApplyDateRange={handleApplyDateRange}
/>
{#if range.startDate !== null}
  {range.startDate}
  {range.endDate}
{/if}

<style>
</style>
