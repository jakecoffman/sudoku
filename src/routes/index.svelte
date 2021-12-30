<script>
  import {sudoku, DIFFICULTY} from "$lib/sudoku.js";

  let board = sudoku.generate(DIFFICULTY.easy)
  let grid = sudoku.board_string_to_grid(board)
  let candidates = sudoku.get_candidates(board)
</script>

<section class="flex justify-center">
  <div class="board">
  {#each grid as group, rowIndex}
    <div class="row">
    {#each group as cell, cellIndex}
      <div class="cell">
        {cell === '.' ? '' : cell}
      </div>
    {/each}
    </div>
  {/each}
  </div>
</section>

<svelte:head>
  <style>
    body {
        font-family: system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,"Noto Sans",sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol","Noto Color Emoji";
    }
  </style>
</svelte:head>

<style>
  .flex {
      display: flex;
  }
  .justify-center {
      justify-content: center;
  }

  .board {
      max-width: 40rem;
      min-width: 30rem;
      /*width: 100%;*/
      /*height: 100%;*/
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

      font-size: 32pt;
  }
</style>
