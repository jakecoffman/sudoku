<script>
  import '../global.css'
  import {selected, usingPencil, darkMode} from "../store.js";
  import Pencil from "$lib/icons/Pencil.svelte";
  import Close from "$lib/icons/Close.svelte";
  import { createEventDispatcher } from 'svelte';

  const dispatch = createEventDispatcher();

  const digits = ['1', '2', '3', '4', '5', '6', '7', '8', '9']
</script>

<div class="mobile" class:dark-mode={$darkMode}>
  {#each digits as digit, i}
    <span class="flex center justify-center"
          on:click={() => dispatch('pick', digit)}
          class:selected={$selected?.user && $selected?.pencil?.includes(digit)}
    >
      <span>{digit}</span>
    </span>
  {/each}
  <span class:selected={$usingPencil}
        on:click={() => $usingPencil = !$usingPencil}>
    <Pencil/>
  </span>
  <span></span>
  <span on:click={() => dispatch('clear')}>
    <Close/>
  </span>
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
