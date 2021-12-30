<script>
  import {sudoku, DIFFICULTY} from "$lib/sudoku.js";

  let board = sudoku.generate(DIFFICULTY.easy)
  let grid = sudoku.board_string_to_grid(board)
  let candidates = sudoku.get_candidates(board)

  let showCandidates = false
  let selected = null

  function select(group, cell) {
    selected = `${group}.${cell}`
  }
</script>

<section>
  <div class="board">
  {#each grid as group, groupIndex}
    <div class="row">
    {#each group as cell, cellIndex}
      <div class="cell" class:selected={selected === `${groupIndex}.${cellIndex}`} on:click={() => select(groupIndex, cellIndex)}>
        {#if cell !== '.'}
          {cell}
        {:else if showCandidates}
          <div class="candidates">
            {#each sudoku.DIGITS as v, i}
              {#if candidates[groupIndex][cellIndex].includes(v)}
                <span>{v}</span>
              {:else}
                <span>&nbsp;</span>
              {/if}
            {/each}
          </div>
        {/if}
      </div>
    {/each}
    </div>
  {/each}
  </div>
</section>

<section>
  <label>
    <input bind:checked={showCandidates} type="checkbox">
    <span>Show candidates</span>
  </label>
</section>

<svelte:head>
  <style>
    body {
        font-family: system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,"Noto Sans",sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol","Noto Color Emoji";
    }
  </style>
</svelte:head>

<style>
  :root {
      --lg: #d5d5d5;
  }

  section {
      display: flex;
      justify-content: center;
      margin-bottom: 2rem;
  }

  .board {
      min-width: 35rem;
      border-radius: 5px;

      display: grid;
      grid-template-columns: 1fr 1fr 1fr;
      grid-gap: 4px;
      background: var(--lg);

      box-shadow: 0 25px 50px -12px rgb(0 0 0 / 25%);
  }
  .row {
      display: grid;
      grid-gap: 1px;
      grid-template-columns: 1fr 1fr 1fr;
      background: var(--lg);
  }
  .cell {
      /* aspect-ratio often breaks resizing */
      aspect-ratio: 1/1;
      background: white;
      text-align: center;

      min-height: 100%;
      overflow: hidden;

      font-size: 2.5rem;
  }
  .candidates {
      display: grid;
      grid-template-columns: 1fr 1fr 1fr;
      font-size: .9rem;
      pointer-events: none;
  }
  .candidates * {
      pointer-events: none;
  }
  .selected {
      background: #2979fb;
  }
</style>
