<script>
  import '../global.css'
  import Pencil from "$lib/icons/Pencil.svelte";

  import {scale, fade} from 'svelte/transition'
  import {digits, displayToGrid} from "$lib/jake.js";
  import {onMount} from "svelte";
  import {
    displayGrid,
    gridGrid,
    selected,
    usingPencil,
    showSettings,
    darkMode,
    loadFromLocalStorage,
    newGame,
    generateSolution,
    pick,
    history,
    end,
    seconds,
    paused
  } from "../store.js";
  import Settings from "$lib/Settings.svelte";
  import GameOver from "$lib/GameOver.svelte";
  import MobileInput from "$lib/MobileInput.svelte";
  import ControlBar from "$lib/ControlBar.svelte";
  import Board from "$lib/Board.svelte";
  import Clear from "$lib/Clear.svelte";

  let target = null

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

    if ($history.length > 0) {
      $displayGrid = history.latest()
      $gridGrid = displayToGrid($displayGrid)
      if (localStorage.getItem('seconds')) {
        $seconds = Number(localStorage.getItem('seconds'))
      }
      generateSolution()
    } else {
      newGame()
    }

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

  // select called when a user clicks a cell
  function select(event, cell) {
    if ($paused) {
      return
    }

    $selected = cell
    target = event.target.getBoundingClientRect()
  }

  let inputStyle
  $: if (target) {
    inputStyle = `position: absolute; top: ${target.top-target.height/3}px; left: ${target.left-target.width/3}px; width: 6rem;`
  } else {
    inputStyle = ``
  }
</script>

<section>
  <Board on:select={e => select(e.detail.event, e.detail.cell)}/>
</section>

<ControlBar/>

<MobileInput/>

<!-- begin desktop input widget -->
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
        <span class="cell" title="toggle pencil"
              class:selected={$usingPencil}
              on:click={() => $usingPencil = !$usingPencil}
        >
          <span>
            <Pencil/>
          </span>
        </span>
        <span class="cell"><span>&nbsp;</span></span>
        <span class="cell"><Clear/></span>
      </div>
    </aside>
  </div>
{/if}

{#if $end}
  <GameOver/>
{/if}

{#if $showSettings}
  <Settings/>
{/if}
