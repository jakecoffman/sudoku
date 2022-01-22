<script>
  import '../global.css'
  import {selected, darkMode, pick} from "../store.js";
  import ButtonPencil from "$lib/icons/ButtonPencil.svelte";
  import ButtonClear from "$lib/ButtonClear.svelte";
  import {digits} from "$lib/sudoku.js";
</script>

<div class="mobile" class:dark-mode={$darkMode}>
  {#each digits as digit, i}
    <span class="flex center justify-center"
          on:click={() => pick(digit)}
          class:selected={$selected?.user && $selected?.pencil?.includes(digit)}
    >
      <span>{digit}</span>
    </span>
  {/each}
  <ButtonPencil/>
  <span></span>
  <ButtonClear/>
</div>

<style>
    .mobile {
        display: none;
        grid-template-columns: 1fr 1fr 1fr;
        gap: 1px;
        background: var(--lg);
        text-align: center;
        font-size: 24pt;
    }
    .mobile > * {
        background: white;
        width: 100%;
        height: 100%;
    }
    .selected {
        background: var(--blue);
    }
    @media (max-width: 650px) {
        .mobile {
            display: grid;
            grid-template-columns: 1fr 1fr 1fr;
            grid-template-rows: 1fr 1fr 1fr;
            border: 1px solid var(--lg);
            border-radius: 5px;
            padding: 5px;
        }
    }
</style>
