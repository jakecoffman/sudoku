<script>
  import '../global.css'
  import {fade} from "svelte/transition";
  import {target, displayGrid, darkMode, selected, paused, showErrors, solution, end} from "../store.js";
  import {digits} from "$lib/sudoku.js";

  function select(event, cell) {
    if ($paused) {
      return
    }

    $selected = cell
    $target = event.target.getBoundingClientRect()
  }
</script>

<div class="board">
  {#each $displayGrid as group, groupIndex}
    <div class="row">
      {#each group as cell, cellIndex}
        <div class="cell"
             class:dark-mode={$darkMode}
             class:selected={$selected === cell}
             on:click={event => select(event, cell)}
        >
          {#if $paused && !$end}
            <span></span>
          {:else if cell.digit !== '0'}
          <span class:user={cell.user}
                class:error={cell.error || ($showErrors && $solution[groupIndex][cellIndex].digit !== cell.digit)}
                class:highlight={$selected !== cell && $selected?.digit === cell.digit}
                out:fade={{delay: 100}}
          >
            {cell.digit}
          </span>
          {:else}
            <div class="candidates">
              {#each digits as v, i}
                {#key v}
              <span transition:fade={{duration: 100}}>
                { cell.pencil.includes(v) ? v : ' '}
              </span>
                {/key}
              {/each}
            </div>
          {/if}
        </div>
      {/each}
    </div>
  {/each}
</div>

<style>
    .highlight {
        background: #ffb460;
    }
    .selected {
        background: var(--blue);
    }
</style>
