<script>
  import Close from "$lib/icons/Close.svelte";
  import {autoPencil, displayGrid, gridGrid, history, selected} from "../store.js";
  import {doAutoPencil, setErrors} from "$lib/jake.js";

  // user clicked X on the numpad
  function clear() {
    if (!$selected.user) {
      return
    }
    $selected.digit = '0'
    setErrors($displayGrid, $gridGrid)
    if ($autoPencil) {
      doAutoPencil($displayGrid, $gridGrid)
    }
    $displayGrid = $displayGrid
    $gridGrid = $gridGrid
    history.push($displayGrid)
    $selected = null
  }
</script>

<span on:click={clear} title="close">
  <Close/>
</span>
