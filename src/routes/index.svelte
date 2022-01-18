<script>
  import '../global.css'
  import Pencil from "$lib/icons/Pencil.svelte";
  import Stopwatch from "$lib/icons/Stopwatch.svelte";
  import Time from "$lib/Time.svelte";
  import Gear from "$lib/icons/Gear.svelte";
  import Pause from "$lib/icons/Pause.svelte";
  import Close from "$lib/icons/Close.svelte";
  import Undo from "$lib/icons/Undo.svelte";

  import {scale, fade} from 'svelte/transition'
  import {digits, stringToGrid, displayToGrid, setErrors,
    getRandomInt, clearSuperfluousPencilMarks, doAutoPencil} from "$lib/jake.js";
  import {easyGames, mediumGames, hardGames} from "$lib/games.js";
  import {onMount} from "svelte";
  import {Sudoku} from '@brunoccc/sudokujs'
  import {autoPencil, darkMode, difficulty, loadFromLocalStorage, showErrors, history} from "../store.js";
  import Settings from "$lib/Settings.svelte";

  let displayGrid = stringToGrid('000000000000000000000000000000000000000000000000000000000000000000000000000000000')
  let gridGrid = displayToGrid(displayGrid)

  let paused = false
  setInterval(() => {
    if (!paused) {
      seconds += 1
    }
  }, 1000)
  let seconds = 0
  let usingPencil = false
  let selected = null
  let target = null
  let end = false
  let showSettings = false
  let solution = null

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
      displayGrid = history.latest()
      gridGrid = displayToGrid(displayGrid)
      if (localStorage.getItem('seconds')) {
        seconds = Number(localStorage.getItem('seconds'))
      }
      generateSolution()
    } else {
      newGame()
    }

    window.onblur = () => {
      paused = true
    }
    window.onfocus = () => {
      if (!end) {
        paused = false
      }
    }
    window.onbeforeunload = () => {
      localStorage.setItem('seconds', seconds.toString())
    }
  })

  function newGame() {
    seconds = 0
    end = false
    paused = false
    showSettings = false
    let games
    switch ($difficulty) {
      case 'easy':
        games = easyGames
        break
      case 'medium':
        games = mediumGames
        break
      case 'hard':
        games = hardGames
        break
      default:
        $difficulty = 'hard'
        games = hardGames
    }
    displayGrid = stringToGrid(games[getRandomInt(0, games.length)])
    gridGrid = displayToGrid(displayGrid)
    if ($autoPencil) {
      doAutoPencil(displayGrid, gridGrid)
    }
    $history = [JSON.parse(JSON.stringify(displayGrid))]

    generateSolution()
  }

  // select called when a user clicks a cell
  function select(event, cell) {
    if (paused) {
      return
    }

    selected = cell
    target = event.target.getBoundingClientRect()
  }

  // user clicked X on the numpad
  function clear() {
    if (!selected.user) {
      return
    }
    selected.digit = '0'
    setErrors(displayGrid, gridGrid)
    if ($autoPencil) {
      doAutoPencil(displayGrid, gridGrid)
    }
    displayGrid = displayGrid
    gridGrid = gridGrid
    history.push(displayGrid)
    selected = null
  }

  // pick called when a user clicks a digit on the popup dialog picker
  function pick(digit) {
    if (paused) {
      return
    }

    if (usingPencil) {
      if (selected.pencil.includes(digit)) {
        selected.pencil = selected.pencil.filter(v => v !== digit)
      } else {
        selected.pencil = [...selected.pencil, digit]
      }
    } else {
      selected.digit = digit
      setErrors(displayGrid, gridGrid)
      clearSuperfluousPencilMarks(selected, displayGrid, gridGrid)
      selected = null
    }
    displayGrid = displayGrid
    gridGrid = gridGrid
    history.push(displayGrid)

    // check for win condition
    for (let row of displayGrid) {
      if (row.some(v => v.digit === '0' || v.error)) {
        return
      }
    }
    end = true
    paused = true
  }

  function updateAutoPencil() {
    // this looks backwards, but the svelte click hasn't fired yet
    if ($autoPencil) {
      for (let row of displayGrid) {
        for (let cell of row) {
          cell.pencil = []
        }
      }
      displayGrid = displayGrid
      history.push(displayGrid)
      return
    }
    doAutoPencil(displayGrid, gridGrid)
    history.push(displayGrid)
    displayGrid = displayGrid
    gridGrid = gridGrid
  }

  function undo() {
    if ($history.length < 2) {
      return
    }
    history.pop()
    displayGrid = history.latest()
    gridGrid = displayToGrid(displayGrid)
  }

  function generateSolution() {
    const input = []
    for (let row of gridGrid) {
      input.push(row.map(i => i.user ? 0 : Number(i.digit)))
    }
    const s = new Sudoku(input)
    if (!s.solve()) {
      // this should never happen
      console.error('not solvable')
    }
    const c = s.grid.map(row => row.map(cell => cell.toString())).flat().join('')
    solution = stringToGrid(c)
  }
</script>

<section>
  <div class="board">
  {#each displayGrid as group, groupIndex}
    <div class="row">
    {#each group as cell, cellIndex}
      <div class="cell" class:dark-mode={$darkMode} class:selected={selected === cell} on:click={(e) => select(e, cell)}>
        {#if paused && !end}
          <span></span>
        {:else if cell.digit !== '0'}
          <span class:user={cell.user}
                class:error={cell.error || ($showErrors && solution[groupIndex][cellIndex].digit !== cell.digit)}
                class:highlight={selected !== cell && selected?.digit === cell.digit}
                out:fade={{delay: 100}}
          >
            {cell.digit}
          </span>
        {:else}
          <div class="candidates">
            {#each digits as v, i}
              {#key v}
              <span transition:fade={{duration: 100}}>
                { cell.pencil.includes(v) ? v : ' '}
              </span>
              {/key}
            {/each}
          </div>
        {/if}
      </div>
    {/each}
    </div>
  {/each}
  </div>
</section>

<section class="timebar">
  <div>
    <button on:click={undo}>
      <Undo/>
    </button>
  </div>
  <button class="flex gap-25" on:click={() => paused = !paused} title="Pause">
    {#if paused}
      <Pause/>
    {:else}
      <Stopwatch/>
    {/if}
    <Time bind:seconds={seconds}/>
  </button>
  <button on:click={() => showSettings = !showSettings} title="Settings">
    <Gear/>
  </button>
</section>

<div class="mobile" class:dark-mode={$darkMode}>
  {#each digits as digit, i}
    <span class="flex center justify-center"
          on:click={() => pick(digit)}
          class:selected={selected?.user && selected?.pencil?.includes(digit)}
    >
      <span>{digit}</span>
    </span>
  {/each}
  <span class:selected={usingPencil}
        on:click={() => usingPencil = !usingPencil}>
    <Pencil/>
  </span>
  <span></span>
  <span on:click={clear}>
    <Close/>
  </span>
</div>

{#if selected && (selected.digit === '0' || selected.user)}
  <div class="dialog desktop" on:click={() => selected = null} in:fade>
    <aside style="position: absolute; top: {target.top-target.height/3}px; left: {target.left-target.width/3}px; width: 6rem;"
           in:scale
           on:click={e => e.stopPropagation()}
           class:dark-mode={$darkMode}
    >
      <div class="row">
        {#each digits as digit, i}
          <span class="cell" on:click={() => pick(digit)} class:selected={selected.pencil.includes(digit)}>
            <span>{digit}</span>
          </span>
        {/each}
        <span class="cell" title="toggle pencil"
              class:selected={usingPencil}
              on:click={() => usingPencil = !usingPencil}
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

{#if end}
  <div class="dialog flex center justify-center" transition:fade>
    <aside class="flex column center justify-center settings" transition:scale on:click={e => e.stopPropagation()} class:dark-mode={$darkMode}>
      <h1>YOU WIN!</h1>
      <p>Time spent:</p>
      <Time bind:seconds={seconds}/>
      <button on:click={newGame}>
        New game
      </button>
    </aside>
  </div>
{/if}

{#if showSettings}
  <Settings bind:showSettings on:updateAutoPencil={updateAutoPencil} on:newGame={newGame}/>
{/if}

<style>
  .selected, .mobile>.selected {
      background: var(--blue);
  }
  .highlight {
      background: #ffb460;
  }
  .mobile {
      display: none;
      grid-template-columns: 1fr 1fr 1fr;
      gap: 1px;
      background: var(--lg);
      text-align: center;
      font-size: 24pt;
  }
  .mobile > * {
      background: white;
      width: 100%;
      height: 100%;
  }
  .timebar {
      gap: 1rem;
      flex-direction: row;
      align-items: center;
  }
  @media (min-width: 650px) {
      .board {
          width: 35rem !important;
      }
  }
  @media (max-width: 650px) {
      .timebar {
          flex-direction: row;
      }
      .candidates {
          font-size: .7rem;
      }
      aside {
          display: none;
      }
      .mobile {
          display: grid;
          grid-template-columns: 1fr 1fr 1fr;
          grid-template-rows: 1fr 1fr 1fr;
          border: 1px solid var(--lg);
          border-radius: 5px;
          padding: 5px;
      }
      .board {
          margin-top: 0;
      }
      .desktop {
          display: none;
      }
  }
</style>
