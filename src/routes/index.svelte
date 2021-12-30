<script>
  import {sudoku, DIFFICULTY} from "$lib/sudoku.js";

  let board = sudoku.generate(DIFFICULTY.easy)
  let grid = sudoku.board_string_to_grid(board)
  let candidates = sudoku.get_candidates(board)

  let showCandidates = false
</script>

<section>
  <div class="board">
  {#each grid as group, rowIndex}
    <div class="row">
    {#each group as cell, cellIndex}
      <div class="cell">
        {#if cell !== '.'}
          {cell}
        {:else if showCandidates}
          <div class="row candidates">
            {#each [1, 2, 3, 4, 5, 6, 7, 8, 9] as v, i}
              {#if candidates[rowIndex][cellIndex].includes(v.toString())}
                <span>{v}</span>
              {:else}
                <span></span>
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
  section {
      display: flex;
      justify-content: center;
      margin-bottom: 2rem;
  }

  .board {
      min-width: 30rem;
      border: 1px solid black;
      border-radius: 5px;

      display: grid;
      grid-template-columns: 1fr 1fr 1fr;
      grid-gap: 4px;
      background: gray;

      box-shadow: 0 25px 50px -12px rgb(0 0 0 / 25%);
  }
  .row {
      display: grid;
      grid-gap: 1px;
      grid-template-columns: 1fr 1fr 1fr;
      background: gray;
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
      font-size: .9rem;
      background: white;
  }
</style>
