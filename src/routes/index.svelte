<script>
  import Pencil from "$lib/Pencil.svelte";
  import Stopwatch from "$lib/Stopwatch.svelte";
  import Time from "$lib/Time.svelte";
  import Gear from "$lib/Gear.svelte";
  import Pause from "$lib/Pause.svelte";

  import {scale, fade} from 'svelte/transition'
  import {stringToGrid, displayToGrid, setErrors, getRandomInt, clearSuperfluousPencilMarks, doAutoPencil} from "$lib/jake.js";
  import {easyGames, hardGames} from "$lib/games.js";
  import {onMount} from "svelte";
  import Undo from "$lib/Undo.svelte";

  const digits = ['1','2','3','4','5','6','7','8','9']

  let games = hardGames
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
  let autoPencil = false
  let selected = null
  let target = null
  let end = false
  let history = []
  let showSettings = false

  onMount(() => {
    let str = localStorage.getItem('history')
    if (str) {
      history = JSON.parse(str)
      displayGrid = history[history.length-1]
      gridGrid = displayToGrid(displayGrid)
      if (localStorage.getItem('seconds')) {
        seconds = Number(localStorage.getItem('seconds'))
      }
    } else {
      newGame()
    }

    window.onblur = () => {
      paused = true
    }
    window.onfocus = () => {
      paused = false
    }
    window.onbeforeunload = () => {
      console.log(seconds)
      localStorage.setItem('seconds', seconds.toString())
    }
  })

  function newGame() {
    end = false
    paused = false
    displayGrid = stringToGrid(games[getRandomInt(0, games.length)])
    gridGrid = displayToGrid(displayGrid)
    history = [JSON.parse(JSON.stringify(displayGrid))]
    localStorage.setItem('history', JSON.stringify(history))
  }

  // select called when a user clicks a cell
  function select(event, cell) {
    if (paused) {
      return
    }

    // user is clicking on a cell they've already entered something into: clear it
    if (cell.user && cell.digit !== '0') {
      cell.digit = '0'
      setErrors(displayGrid, gridGrid)
      if (autoPencil) {
        doAutoPencil(displayGrid, gridGrid)
      }
      displayGrid = displayGrid
      gridGrid = gridGrid
      history.push(JSON.parse(JSON.stringify(displayGrid)))
      localStorage.setItem('history', JSON.stringify(history))
      return
    }
    selected = cell
    target = event.target.getBoundingClientRect()
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
      selected.user = true // indicate this wasn't part of the initial puzzle
      setErrors(displayGrid, gridGrid)
      clearSuperfluousPencilMarks(selected, displayGrid, gridGrid)
      selected = null
    }
    displayGrid = displayGrid
    gridGrid = gridGrid
    history.push(JSON.parse(JSON.stringify(displayGrid)))
    localStorage.setItem('history', JSON.stringify(history))

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
    if (autoPencil) {
      for (let row of displayGrid) {
        for (let cell of row) {
          cell.pencil = []
        }
      }
      displayGrid = displayGrid
      return
    }
    doAutoPencil(displayGrid, gridGrid)
    displayGrid = displayGrid
    gridGrid = gridGrid
  }

  function undo() {
    if (history.length < 2) {
      return
    }
    history.pop()
    displayGrid = JSON.parse(JSON.stringify(history[history.length-1]))
    gridGrid = displayToGrid(displayGrid)
  }
</script>

<section>
  <div class="board">
  {#each displayGrid as group, groupIndex}
    <div class="row">
    {#each group as cell, cellIndex}
      <div class="cell" class:selected={selected === cell} on:click={(e) => select(e, cell)}>
        {#if paused}
          <span></span>
        {:else if cell.digit !== '0'}
          <span class:user={cell.user} class:error={cell.error}>
            {cell.digit}
          </span>
        {:else}
          <div class="candidates">
            {#each digits as v, i}
              {#if cell.pencil.includes(v)}
                <span>{v}</span>
              {:else}
                <span>&nbsp;</span>
              {/if}
            {/each}
          </div>
        {/if}
      </div>
    {/each}
    </div>
  {/each}
  </div>
</section>

<!--<section>-->
<!--  <fieldset style="border: 1px solid black">-->
<!--    <legend>Difficulty</legend>-->
<!--    {#each Object.entries(DIFFICULTY) as diff}-->
<!--    <label>-->
<!--      <input type=radio bind:group={difficulty} name="difficulty" value={diff[1]} on:change={newGame}>-->
<!--      {diff[0]}-->
<!--    </label>-->
<!--    {/each}-->
<!--  </fieldset>-->
<!--</section>-->

<section class="timebar">
  <div>
    <button on:click={undo}>
      <Undo/>
    </button>
  </div>
  <button class="flex gap-25" on:click={() => paused = !paused}>
    {#if paused}
      <Pause/>
    {:else}
      <Stopwatch/>
    {/if}
    <Time bind:seconds={seconds}/>
  </button>
  <button on:click={() => showSettings = !showSettings}>
    <Gear/>
  </button>
</section>

<div class="mobile">
  {#each digits as digit, i}
    <span class="flex center justify-center" on:click={() => pick(digit)} class:selected={selected?.pencil?.includes(digit)}>
      <span>{digit}</span>
    </span>
  {/each}
  <span
        class:selected={usingPencil}
        on:click={() => usingPencil = !usingPencil}
  >
    <span class="flex center justify-center">
      <span><Pencil/></span>
    </span>
  </span>
  <span>&nbsp;</span>
  <span>&nbsp;</span>
</div>

{#if selected && (selected.digit === '0' || selected.user)}
  <div class="dialog desktop" on:click={() => selected = null} transition:fade>
    <aside style="position: absolute; top: {target.top-target.height/3}px; left: {target.left-target.width/3}px; width: 6rem;"
           transition:scale
           on:click={e => e.stopPropagation()}
    >
      <div class="row">
        {#each digits as digit, i}
          <span class="cell" on:click={() => pick(digit)} class:selected={selected.pencil.includes(digit)}>
            <span>{digit}</span>
          </span>
        {/each}
        <span class="cell"
              class:selected={usingPencil}
              on:click={() => usingPencil = !usingPencil}
        >
          <span>
            <Pencil/>
          </span>
        </span>
        <span class="cell"><span>&nbsp;</span></span>
        <span class="cell"><span>&nbsp;</span></span>
      </div>
    </aside>
  </div>
{/if}

{#if end}
  <div class="dialog flex center justify-center" transition:fade>
    <aside style="padding: 1rem; display: flex; flex-direction: column; gap: 1rem;" transition:scale>
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
  <div class="dialog flex center justify-center" on:click={() => showSettings = !showSettings} transition:fade>
    <aside class="flex column settings" transition:scale>
      <h2>Settings</h2>
      <label>
        <input bind:checked={autoPencil} on:click={updateAutoPencil} type="checkbox">
        <span>Auto pencil</span>
      </label>
      <label>
        <button on:click={() => confirm('Start a new game?') && newGame()}>
          New Game
        </button>
      </label>
    </aside>
  </div>
{/if}

<svelte:head>
  <style>
    body {
        font-family: system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,"Noto Sans",sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol","Noto Color Emoji";
        background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 2000 1500'%3E%3Cdefs%3E%3CradialGradient id='a' gradientUnits='objectBoundingBox'%3E%3Cstop offset='0' stop-color='%23FB3'/%3E%3Cstop offset='1' stop-color='%23ee5522'/%3E%3C/radialGradient%3E%3ClinearGradient id='b' gradientUnits='userSpaceOnUse' x1='0' y1='750' x2='1550' y2='750'%3E%3Cstop offset='0' stop-color='%23f7882b'/%3E%3Cstop offset='1' stop-color='%23ee5522'/%3E%3C/linearGradient%3E%3Cpath id='s' fill='url(%23b)' d='M1549.2 51.6c-5.4 99.1-20.2 197.6-44.2 293.6c-24.1 96-57.4 189.4-99.3 278.6c-41.9 89.2-92.4 174.1-150.3 253.3c-58 79.2-123.4 152.6-195.1 219c-71.7 66.4-149.6 125.8-232.2 177.2c-82.7 51.4-170.1 94.7-260.7 129.1c-90.6 34.4-184.4 60-279.5 76.3C192.6 1495 96.1 1502 0 1500c96.1-2.1 191.8-13.3 285.4-33.6c93.6-20.2 185-49.5 272.5-87.2c87.6-37.7 171.3-83.8 249.6-137.3c78.4-53.5 151.5-114.5 217.9-181.7c66.5-67.2 126.4-140.7 178.6-218.9c52.3-78.3 96.9-161.4 133-247.9c36.1-86.5 63.8-176.2 82.6-267.6c18.8-91.4 28.6-184.4 29.6-277.4c0.3-27.6 23.2-48.7 50.8-48.4s49.5 21.8 49.2 49.5c0 0.7 0 1.3-0.1 2L1549.2 51.6z'/%3E%3Cg id='g'%3E%3Cuse href='%23s' transform='scale(0.12) rotate(60)'/%3E%3Cuse href='%23s' transform='scale(0.2) rotate(10)'/%3E%3Cuse href='%23s' transform='scale(0.25) rotate(40)'/%3E%3Cuse href='%23s' transform='scale(0.3) rotate(-20)'/%3E%3Cuse href='%23s' transform='scale(0.4) rotate(-30)'/%3E%3Cuse href='%23s' transform='scale(0.5) rotate(20)'/%3E%3Cuse href='%23s' transform='scale(0.6) rotate(60)'/%3E%3Cuse href='%23s' transform='scale(0.7) rotate(10)'/%3E%3Cuse href='%23s' transform='scale(0.835) rotate(-40)'/%3E%3Cuse href='%23s' transform='scale(0.9) rotate(40)'/%3E%3Cuse href='%23s' transform='scale(1.05) rotate(25)'/%3E%3Cuse href='%23s' transform='scale(1.2) rotate(8)'/%3E%3Cuse href='%23s' transform='scale(1.333) rotate(-60)'/%3E%3Cuse href='%23s' transform='scale(1.45) rotate(-30)'/%3E%3Cuse href='%23s' transform='scale(1.6) rotate(10)'/%3E%3C/g%3E%3C/defs%3E%3Cg %3E%3Cg%3E%3Ccircle fill='url(%23a)' r='3000'/%3E%3Cg opacity='0.5'%3E%3Ccircle fill='url(%23a)' r='2000'/%3E%3Ccircle fill='url(%23a)' r='1800'/%3E%3Ccircle fill='url(%23a)' r='1700'/%3E%3Ccircle fill='url(%23a)' r='1651'/%3E%3Ccircle fill='url(%23a)' r='1450'/%3E%3Ccircle fill='url(%23a)' r='1250'/%3E%3Ccircle fill='url(%23a)' r='1175'/%3E%3Ccircle fill='url(%23a)' r='900'/%3E%3Ccircle fill='url(%23a)' r='750'/%3E%3Ccircle fill='url(%23a)' r='500'/%3E%3Ccircle fill='url(%23a)' r='380'/%3E%3Ccircle fill='url(%23a)' r='250'/%3E%3C/g%3E%3Cg transform=''%3E%3Cuse href='%23g' transform='rotate(10)'/%3E%3Cuse href='%23g' transform='rotate(120)'/%3E%3Cuse href='%23g' transform='rotate(240)'/%3E%3C/g%3E%3Ccircle fill-opacity='0.1' fill='url(%23a)' r='3000'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
        background-attachment: fixed;
        background-size: cover;
    }
  </style>
</svelte:head>

<style>
  :root {
      --lg: #d5d5d5;
      --blue: #2979fb;
  }

  button {
      border-radius: 5px;
      border: 1px solid var(--lg);
      padding-top: .5rem;
      padding-bottom: .5rem;
      background: white;
      cursor: pointer;

      display: flex;
      justify-content: center;

      box-shadow: 0 25px 50px -12px rgb(0 0 0 / 25%) !important;
  }
  button:hover {
      background: #d5d5d5;
  }

  .flex {
      display: flex;
  }
  .column {
      flex-direction: column;
  }
  .center {
      align-items: center;
  }
  .justify-center {
      justify-content: center;
  }
  .gap-25 {
      gap: .25rem;
  }
  .gap-1 {
      gap: 1rem;
  }

  .settings {
      padding: 1rem 3rem;
      gap: 2rem;
  }
  .settings > h2 {
      padding: 0;
      margin: 0;
  }

  section {
      display: flex;
      justify-content: center;
      margin-bottom: 1rem;
  }

  .board {
      padding: 5px;
      margin-top: 2rem;
      width: 100%;
      border-radius: 10px;

      display: grid;
      grid-template-columns: 1fr 1fr 1fr;
      grid-gap: 4px;
      background: var(--lg);

      box-shadow: 0 25px 50px -12px rgb(0 0 0 / 25%);
  }
  .row {
      display: grid;
      grid-gap: 1px;
      grid-template-columns: 1fr 1fr 1fr;
      background: var(--lg);
  }
  .cell {
      position: relative;
      box-sizing: border-box;
      background: white;
      font-size: 2.5rem;
      cursor: pointer;
  }
  .cell:before {
      content: '';
      display: block;
      padding-top: 100%;;
  }
  .cell > * {
      position: absolute;
      top: 0;
      left: 0;
      height: 100%;
      width: 100%;

      display: flex;
      align-items: center;
      justify-content: center;
  }
  .candidates {
      display: grid;
      grid-template-columns: 1fr 1fr 1fr;
      font-size: .9rem;
      pointer-events: none;
  }
  .candidates * {
      pointer-events: none;
      display: flex;
      align-items: center;
      justify-content: center;
  }
  .selected {
      background: var(--blue) !important;
  }
  .user {
      color: #2979fb;
  }
  .error {
      color: #ff5050;
  }
  .dialog {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      height: 100%;
      background: rgba(0, 0, 0, 0.22);
  }
  aside {
      background: white;
      border: 1px solid var(--lg);
      border-radius: 5px;
      padding: 2px;
      box-shadow: 0 25px 50px -12px rgb(0 0 0 / 70%);
  }
  aside .cell {
      font-size: 20pt;
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
          grid-template-rows: 1fr 1fr 1fr 1fr;
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
