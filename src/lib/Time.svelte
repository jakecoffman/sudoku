<script>
  import {seconds} from "../store.js";
  $: minutes = Math.floor($seconds/60)
</script>

<code>
  {minutes.toLocaleString('en-US', {minimumIntegerDigits: 2})}:{($seconds - minutes*60).toLocaleString('en-US', {minimumIntegerDigits: 2})}
</code>

<style>
  code {
      font-size: 16pt;
  }
</style>
