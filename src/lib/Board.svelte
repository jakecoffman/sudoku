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
    .board {
        padding: 5px;
        margin-top: 2rem;
        width: 100%;
        border-radius: 10px;

        display: grid;
        grid-template-columns: 1fr 1fr 1fr;
        grid-gap: 4px;
        background: var(--lg);

        box-shadow: 0 25px 50px -12px rgb(0 0 0 / 25%);
    }
    @media (min-width: 650px) {
        .board {
            width: 35rem !important;
        }
    }
    .candidates {
        display: grid;
        grid-template-columns: 1fr 1fr 1fr;
        font-size: .9rem;
        pointer-events: none;
    }
    .candidates * {
        pointer-events: none;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    @media (max-width: 650px) {
        .candidates {
            font-size: .7rem;
        }
    }
    .highlight {
        background: #ffb460;
    }
    .selected {
        background: var(--blue);
    }
</style>
