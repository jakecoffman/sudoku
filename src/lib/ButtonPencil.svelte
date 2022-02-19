<script>
  import Pencil from "$lib/icons/Pencil.svelte";
  import {usingPencil} from "../store.js";
</script>

<span title="toggle pencil"
      class:selected={$usingPencil}
      on:click={() => $usingPencil = !$usingPencil}>
  <Pencil/>
</span>

<style>
    @media (max-width: 650px) {
        span {
            background: white;
        }
    }
</style>
