<script>
  import Pencil from "$lib/icons/Pencil.svelte";
  import {usingPencil} from "../../store.js";
</script>

<span title="toggle pencil"
      class:selected={$usingPencil}
      on:click={() => $usingPencil = !$usingPencil}>
  <Pencil/>
</span>
