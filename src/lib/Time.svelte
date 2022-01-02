<script>
  export let seconds = 0
  $: minutes = Math.floor(seconds/60)
</script>

<code>
  {minutes.toLocaleString('en-US', {minimumIntegerDigits: 2})}:{(seconds - minutes*60).toLocaleString('en-US', {minimumIntegerDigits: 2})}
</code>

<style>
  code {
      font-size: 24pt;
  }
</style>
