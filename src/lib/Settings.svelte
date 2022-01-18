<script>
  import {fade, scale} from "svelte/transition";
  import { createEventDispatcher } from 'svelte';
  import {autoPencil, showErrors, darkMode, difficulty} from "../store.js";

  const dispatch = createEventDispatcher();

  const DIFFICULTY = ['easy', 'medium', 'hard']

  export let showSettings
</script>

<div class="dialog flex center justify-center" on:click={() => showSettings = false} transition:fade>
  <aside class="flex column center justify-center settings" transition:scale on:click={e => e.stopPropagation()} class:dark-mode={$darkMode}>
    <h2>Settings</h2>
    <label>
      <input bind:checked={$autoPencil} on:click={() => dispatch('updateAutoPencil')} type="checkbox">
      <span>Auto pencil</span>
    </label>
    <label>
      <input bind:checked={$showErrors} type="checkbox">
      <span>Show errors</span>
    </label>
    <label>
      <input bind:checked={$darkMode} type="checkbox">
      <span>Dark mode</span>
    </label>
    <fieldset style="border: 1px solid black">
      <legend>Difficulty</legend>
      {#each DIFFICULTY as diff}
        <label>
          <input type=radio bind:group={$difficulty} name="difficulty" value={diff}>
          {diff}
        </label>
      {/each}
    </fieldset>
    <label>
      <button on:click={() => dispatch('newGame')}>
        New Game
      </button>
    </label>
  </aside>
</div>

<style>
    .settings {
        padding: 1rem 3rem;
        gap: 2rem;
    }
    .settings > h2 {
        padding: 0;
        margin: 0;
    }
    fieldset {
        border-radius: 5px;
        border: 1px solid var(--lg);
    }
</style>
