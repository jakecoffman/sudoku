<script>
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

  const DIFFICULTY = ['easy', 'medium', 'hard']

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
  <div class="dialog flex center justify-center" on:click={() => showSettings = !showSettings} transition:fade>
    <aside class="flex column center justify-center settings" transition:scale on:click={e => e.stopPropagation()} class:dark-mode={$darkMode}>
      <h2>Settings</h2>
      <label>
        <input bind:checked={$autoPencil} on:click={updateAutoPencil} type="checkbox">
        <span>Auto pencil</span>
      </label>
      <label>
        <input bind:checked={$showErrors} type="checkbox">
        <span>Show errors</span>
      </label>
      <label>
        <input bind:checked={$darkMode} type="checkbox">
        <span>Dark mode</span>
      </label>
      <fieldset style="border: 1px solid black">
        <legend>Difficulty</legend>
        {#each DIFFICULTY as diff}
        <label>
          <input type=radio bind:group={$difficulty} name="difficulty" value={diff}>
          {diff}
        </label>
        {/each}
      </fieldset>
      <label>
        <button on:click={() => newGame()}>
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
        background-color: black;
        transition: background-image 0.5s ease-in-out;
    }
    .cell {
        transition: background-color 0.5s ease-in-out;
    }
    aside {
        transition: background-image 0.5s ease-in-out;
    }
    body.dark-mode {
        color: #b2b2b2;
        background-color: #220C00;
        background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='2000' height='2000' viewBox='0 0 800 800'%3E%3Cg fill='none' %3E%3Cg stroke='%23660000' stroke-width='17'%3E%3Cline x1='-8' y1='-8' x2='808' y2='808'/%3E%3Cline x1='-8' y1='792' x2='808' y2='1608'/%3E%3Cline x1='-8' y1='-808' x2='808' y2='8'/%3E%3C/g%3E%3Cg stroke='%23630300' stroke-width='16'%3E%3Cline x1='-8' y1='767' x2='808' y2='1583'/%3E%3Cline x1='-8' y1='17' x2='808' y2='833'/%3E%3Cline x1='-8' y1='-33' x2='808' y2='783'/%3E%3Cline x1='-8' y1='-783' x2='808' y2='33'/%3E%3C/g%3E%3Cg stroke='%235f0600' stroke-width='15'%3E%3Cline x1='-8' y1='742' x2='808' y2='1558'/%3E%3Cline x1='-8' y1='42' x2='808' y2='858'/%3E%3Cline x1='-8' y1='-58' x2='808' y2='758'/%3E%3Cline x1='-8' y1='-758' x2='808' y2='58'/%3E%3C/g%3E%3Cg stroke='%235c0800' stroke-width='14'%3E%3Cline x1='-8' y1='67' x2='808' y2='883'/%3E%3Cline x1='-8' y1='717' x2='808' y2='1533'/%3E%3Cline x1='-8' y1='-733' x2='808' y2='83'/%3E%3Cline x1='-8' y1='-83' x2='808' y2='733'/%3E%3C/g%3E%3Cg stroke='%23580b00' stroke-width='13'%3E%3Cline x1='-8' y1='92' x2='808' y2='908'/%3E%3Cline x1='-8' y1='692' x2='808' y2='1508'/%3E%3Cline x1='-8' y1='-108' x2='808' y2='708'/%3E%3Cline x1='-8' y1='-708' x2='808' y2='108'/%3E%3C/g%3E%3Cg stroke='%23550c00' stroke-width='12'%3E%3Cline x1='-8' y1='667' x2='808' y2='1483'/%3E%3Cline x1='-8' y1='117' x2='808' y2='933'/%3E%3Cline x1='-8' y1='-133' x2='808' y2='683'/%3E%3Cline x1='-8' y1='-683' x2='808' y2='133'/%3E%3C/g%3E%3Cg stroke='%23520e00' stroke-width='11'%3E%3Cline x1='-8' y1='642' x2='808' y2='1458'/%3E%3Cline x1='-8' y1='142' x2='808' y2='958'/%3E%3Cline x1='-8' y1='-158' x2='808' y2='658'/%3E%3Cline x1='-8' y1='-658' x2='808' y2='158'/%3E%3C/g%3E%3Cg stroke='%234f0f00' stroke-width='10'%3E%3Cline x1='-8' y1='167' x2='808' y2='983'/%3E%3Cline x1='-8' y1='617' x2='808' y2='1433'/%3E%3Cline x1='-8' y1='-633' x2='808' y2='183'/%3E%3Cline x1='-8' y1='-183' x2='808' y2='633'/%3E%3C/g%3E%3Cg stroke='%234b1000' stroke-width='9'%3E%3Cline x1='-8' y1='592' x2='808' y2='1408'/%3E%3Cline x1='-8' y1='192' x2='808' y2='1008'/%3E%3Cline x1='-8' y1='-608' x2='808' y2='208'/%3E%3Cline x1='-8' y1='-208' x2='808' y2='608'/%3E%3C/g%3E%3Cg stroke='%23481100' stroke-width='8'%3E%3Cline x1='-8' y1='567' x2='808' y2='1383'/%3E%3Cline x1='-8' y1='217' x2='808' y2='1033'/%3E%3Cline x1='-8' y1='-233' x2='808' y2='583'/%3E%3Cline x1='-8' y1='-583' x2='808' y2='233'/%3E%3C/g%3E%3Cg stroke='%23451100' stroke-width='7'%3E%3Cline x1='-8' y1='242' x2='808' y2='1058'/%3E%3Cline x1='-8' y1='542' x2='808' y2='1358'/%3E%3Cline x1='-8' y1='-558' x2='808' y2='258'/%3E%3Cline x1='-8' y1='-258' x2='808' y2='558'/%3E%3C/g%3E%3Cg stroke='%23421200' stroke-width='6'%3E%3Cline x1='-8' y1='267' x2='808' y2='1083'/%3E%3Cline x1='-8' y1='517' x2='808' y2='1333'/%3E%3Cline x1='-8' y1='-533' x2='808' y2='283'/%3E%3Cline x1='-8' y1='-283' x2='808' y2='533'/%3E%3C/g%3E%3Cg stroke='%233f1200' stroke-width='5'%3E%3Cline x1='-8' y1='292' x2='808' y2='1108'/%3E%3Cline x1='-8' y1='492' x2='808' y2='1308'/%3E%3Cline x1='-8' y1='-308' x2='808' y2='508'/%3E%3Cline x1='-8' y1='-508' x2='808' y2='308'/%3E%3C/g%3E%3Cg stroke='%233c1300' stroke-width='4'%3E%3Cline x1='-8' y1='467' x2='808' y2='1283'/%3E%3Cline x1='-8' y1='317' x2='808' y2='1133'/%3E%3Cline x1='-8' y1='-333' x2='808' y2='483'/%3E%3Cline x1='-8' y1='-483' x2='808' y2='333'/%3E%3C/g%3E%3Cg stroke='%23391300' stroke-width='3'%3E%3Cline x1='-8' y1='342' x2='808' y2='1158'/%3E%3Cline x1='-8' y1='442' x2='808' y2='1258'/%3E%3Cline x1='-8' y1='-458' x2='808' y2='358'/%3E%3Cline x1='-8' y1='-358' x2='808' y2='458'/%3E%3C/g%3E%3Cg stroke='%23361300' stroke-width='2'%3E%3Cline x1='-8' y1='367' x2='808' y2='1183'/%3E%3Cline x1='-8' y1='417' x2='808' y2='1233'/%3E%3Cline x1='-8' y1='-433' x2='808' y2='383'/%3E%3Cline x1='-8' y1='-383' x2='808' y2='433'/%3E%3C/g%3E%3Cg stroke='%23331300' stroke-width='1'%3E%3Cline x1='-8' y1='392' x2='808' y2='1208'/%3E%3Cline x1='-8' y1='-408' x2='808' y2='408'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
    }
    body.dark-mode svg {
        stroke: #b2b2b2;
        fill: #b2b2b2;
    }
    body.dark-mode button {
        color: #b2b2b2;
        background: #220c00 !important;
    }
    body.dark-mode .mobile > * {
        background: #220c00 !important;
    }
    body.dark-mode .cell {
        background: #220c00 !important;
    }
    body.dark-mode .selected {
        background: #a13300 !important;
    }
    body.dark-mode .mobile>.selected {
        background: #a13300 !important;
    }
    body.dark-mode .highlight {
        background: #a17300 !important;
        color: #000000;
    }
    body.dark-mode .user {
        color: #938231;
    }
    body.dark-mode .error {
        color: #ff0000;
    }
  </style>
</svelte:head>

<style>
  :root {
      --lg: #d5d5d5;
      --blue: #6ca2ff;
      --dark: #220c00;
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

  .settings {
      padding: 1rem 3rem;
      gap: 2rem;
  }
  .settings > h2 {
      padding: 0;
      margin: 0;
  }

  :global(section) {
      display: flex;
      justify-content: center;
      margin-bottom: 1rem;
  }

  :global(.board) {
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
  :global(.row) {
      display: grid;
      grid-gap: 1px;
      grid-template-columns: 1fr 1fr 1fr;
      background: var(--lg);
  }
  :global(.cell) {
      position: relative;
      box-sizing: border-box;
      background: white;
      font-size: 2.5rem;
      cursor: pointer;
  }
  :global(.cell:before) {
      content: '';
      display: block;
      padding-top: 100%;;
  }
  :global(.cell > *) {
      position: absolute;
      top: 0;
      left: 0;
      height: 100%;
      width: 100%;

      display: flex;
      align-items: center;
      justify-content: center;
  }
  :global(.candidates) {
      display: grid;
      grid-template-columns: 1fr 1fr 1fr;
      font-size: .9rem;
      pointer-events: none;
  }
  :global(.candidates *) {
      pointer-events: none;
      display: flex;
      align-items: center;
      justify-content: center;
  }
  .selected, .mobile>.selected {
      background: var(--blue);
  }
  .highlight {
      background: #ffb460;
  }
  :global(.user) {
      color: #2979fb;
  }
  :global(.error) {
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
  aside.dark-mode {
      background: var(--dark);
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
  fieldset {
      border-radius: 5px;
      border: 1px solid var(--lg);
  }
</style>
