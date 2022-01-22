<script>
  import Pause from "$lib/icons/Pause.svelte";
  import Undo from "$lib/icons/Undo.svelte";
  import Stopwatch from "$lib/icons/Stopwatch.svelte";
  import Time from "$lib/Time.svelte";
  import Gear from "$lib/icons/Gear.svelte";

  import {showSettings, paused, history, displayGrid, gridGrid} from "../store.js";
  import {displayToGrid} from "$lib/sudoku.js";

  function undo() {
    if ($history.length < 2) {
      return
    }
    history.pop()
    $displayGrid = history.latest()
    $gridGrid = displayToGrid($displayGrid)
  }
</script>

<div>
  <button on:click={undo}>
    <Undo/>
  </button>
</div>
<button class="flex gap-25" on:click={() => $paused = !$paused} title="Pause">
  {#if $paused}
    <Pause/>
  {:else}
    <Stopwatch/>
  {/if}
  <Time/>
</button>
<button on:click={() => $showSettings = !$showSettings} title="Settings">
  <Gear/>
</button>
