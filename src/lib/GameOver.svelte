<script>
  import {fade, scale} from "svelte/transition";
  import Time from "$lib/Time.svelte";
  import {darkMode, newGame} from '../store.js'
</script>

<div class="dialog flex center justify-center" transition:fade>
  <aside class="flex column center justify-center settings" transition:scale on:click={e => e.stopPropagation()} class:dark-mode={$darkMode}>
    <h1>YOU WIN!</h1>
    <p>Time spent:</p>
    <Time/>
    <button on:click={newGame}>
      New game
    </button>
  </aside>
</div>
