<script>
  import '../global.css'

  import {onMount} from "svelte";
  import {
    darkMode,
    loadFromLocalStorage,
    end,
    seconds,
    paused
  } from "../store.js";
  import DialogSettings from "$lib/DialogSettings.svelte";
  import DialogGameOver from "$lib/DialogGameOver.svelte";
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

<section class="bar">
  <ControlBar/>
</section>

<InputMobile/>

<InputDesktop/>

<DialogGameOver/>

<DialogSettings/>

<style>
    .bar {
        gap: 1rem;
        flex-direction: row;
        align-items: center;
    }

    @media (max-width: 650px) {
        .bar {
            flex-direction: row;
        }
    }
</style>
