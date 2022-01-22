<script>
  import '../global.css'
  import Pencil from "$lib/icons/Pencil.svelte";
  import Close from "$lib/icons/Close.svelte";

  import {scale, fade} from 'svelte/transition'
  import {digits, displayToGrid, setErrors, clearSuperfluousPencilMarks, doAutoPencil} from "$lib/jake.js";
  import {onMount} from "svelte";
  import {
    displayGrid,
    gridGrid,
    selected,
    usingPencil,
    showSettings,
    autoPencil,
    darkMode,
    loadFromLocalStorage,
    newGame,
    generateSolution,
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

  // pick called when a user clicks a digit on the popup dialog picker
  function pick(digit) {
    if ($paused) {
      return
    }

    if ($usingPencil) {
      if ($selected.pencil.includes(digit)) {
        $selected.pencil = $selected.pencil.filter(v => v !== digit)
      } else {
        $selected.pencil = [...$selected.pencil, digit]
      }
    } else {
      $selected.digit = digit
      setErrors($displayGrid, $gridGrid)
      clearSuperfluousPencilMarks($selected, $displayGrid, $gridGrid)
      $selected = null
    }
    $displayGrid = $displayGrid
    $gridGrid = $gridGrid
    history.push($displayGrid)

    // check for win condition
    for (let row of $displayGrid) {
      if (row.some(v => v.digit === '0' || v.error)) {
        return
      }
    }
    $end = true
    $paused = true
  }

  function updateAutoPencil() {
    // this looks backwards, but the svelte click hasn't fired yet
    if ($autoPencil) {
      for (let row of $displayGrid) {
        for (let cell of row) {
          cell.pencil = []
        }
      }
      $displayGrid = $displayGrid
      history.push($displayGrid)
      return
    }
    doAutoPencil($displayGrid, $gridGrid)
    history.push($displayGrid)
    $displayGrid = $displayGrid
    $gridGrid = $gridGrid
  }
</script>

<section>
  <Board on:select={e => select(e.detail.event, e.detail.cell)}/>
</section>

<ControlBar/>

<MobileInput on:clear={clear} on:pick={e => pick(e.detail)}/>

<!-- begin desktop input widget -->
{#if $selected && ($selected.digit === '0' || $selected.user)}
  <div class="dialog desktop" on:click={() => $selected = null} in:fade>
    <aside style="position: absolute; top: {target.top-target.height/3}px; left: {target.left-target.width/3}px; width: 6rem;"
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
        <span class="cell" on:click={clear} title="close">
          <span><Close/></span>
        </span>
      </div>
    </aside>
  </div>
{/if}

{#if $end}
  <GameOver/>
{/if}

{#if $showSettings}
  <Settings on:updateAutoPencil={updateAutoPencil} on:newGame={newGame}/>
{/if}
