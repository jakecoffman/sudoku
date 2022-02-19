<script>
  import {fade, scale} from "svelte/transition";
  import {target, darkMode, pick, selected} from "../store.js";
  import {digits} from "$lib/sudoku.js";
  import ButtonPencil from "$lib/ButtonPencil.svelte";
  import ButtonClear from "$lib/ButtonClear.svelte";

  let inputStyle
  $: if ($target) {
    inputStyle = `position: absolute; top: ${$target.top-$target.height/3}px; left: ${$target.left-$target.width/3}px; width: 6rem;`
  } else {
    inputStyle = ``
  }
</script>

{#if $selected && ($selected.digit === '0' || $selected.user)}
  <div class="dialog desktop" on:click={() => $selected = null} in:fade>
    <aside style={inputStyle}
           in:scale
           on:click={e => e.stopPropagation()}
           class:dark-mode={$darkMode}
    >
      <div class="row">
        {#each digits as digit, i}
          <span class="cell" on:click={() => pick(digit)} class:selected={$selected.pencil.includes(digit)}>
            <span>{digit}</span>
          </span>
        {/each}
        <span class="cell">
          <ButtonPencil/>
        </span>
        <span class="cell"><span>&nbsp;</span></span>
        <span class="cell">
          <ButtonClear/>
        </span>
      </div>
    </aside>
  </div>
{/if}
