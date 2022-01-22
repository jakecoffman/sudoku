<script>
  import '../global.css'

  import {onMount} from "svelte";
  import {
    showSettings,
    darkMode,
    loadFromLocalStorage,
    end,
    seconds,
    paused
  } from "../store.js";
  import Settings from "$lib/Settings.svelte";
  import GameOver from "$lib/GameOver.svelte";
  import ControlBar from "$lib/ControlBar.svelte";
  import Board from "$lib/Board.svelte";
  import InputMobile from "$lib/InputMobile.svelte";
  import InputDesktop from "$lib/InputDesktop.svelte";

  $:{
    if (typeof window === 'undefined') {
      // wait for onMount
    } else if ($darkMode) {
      window.document.body.classList.add('dark-mode')
    } else {
      window.document.body.classList.remove('dark-mode')
    }
  }

  onMount(() => {
    loadFromLocalStorage()

    window.onblur = () => {
      $paused = true
    }
    window.onfocus = () => {
      if (!$end) {
        $paused = false
      }
    }
    window.onbeforeunload = () => {
      localStorage.setItem('seconds', $seconds.toString())
    }
  })
</script>

<section>
  <Board/>
</section>

<ControlBar/>

<InputMobile/>

<InputDesktop/>

{#if $end}
  <GameOver/>
{/if}

{#if $showSettings}
  <Settings/>
{/if}
