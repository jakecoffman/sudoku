<script>
  import {sudoku, DIFFICULTY} from "$lib/sudoku.js";

  let board = sudoku.generate(DIFFICULTY.easy)
  let candidates = sudoku.get_candidates(board)
</script>

Select difficulty: {JSON.stringify(DIFFICULTY)}

{JSON.stringify(board)}
{JSON.stringify(candidates)}
