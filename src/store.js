import {writable, get} from "svelte/store";
import {
  clearSuperfluousPencilMarks,
  displayToGrid,
  doAutoPencil,
  getRandomInt,
  setErrors,
  stringToGrid
} from "$lib/sudoku.js";
import {easyGames, hardGames, mediumGames} from "$lib/games.js";
import {Sudoku} from '@brunoccc/sudokujs'

// should be called once onMount since localStorage won't exist until then
export function loadFromLocalStorage() {
  autoPencil.set(localStorage.getItem('autoPencil') === 'true')
  autoPencil.subscribe(v => localStorage.setItem('autoPencil', v.toString()))

  darkMode.set(localStorage.getItem('dark-mode') === 'true')
  darkMode.subscribe(v => localStorage.setItem('dark-mode', v.toString()))

  showErrors.set(localStorage.getItem('showErrors') === 'true')
  showErrors.subscribe(v => localStorage.setItem('showErrors', v.toString()))

  difficulty.set(localStorage.getItem('difficulty') ?? 'hard')
  difficulty.subscribe(v => localStorage.setItem('difficulty', v))

  const str = localStorage.getItem('history')
  try {
    if (str) {
      history.set(JSON.parse(str))
    }
  } catch (e) {
    console.log("failed to load history:", e)
  }
  history.subscribe(v => localStorage.setItem('history', JSON.stringify(v)))

  if (get(history).length > 0) {
    displayGrid.set(history.latest())
    gridGrid.set(displayToGrid(get(displayGrid)))
    if (localStorage.getItem('seconds')) {
      seconds.set(Number(localStorage.getItem('seconds')))
    }
    generateSolution()
  } else {
    newGame()
  }
}

export const selected = writable(null);
export const target = writable(null);
export const usingPencil = writable(false);
export const end = writable(false);
export const showSettings = writable(false);
export const autoPencil = writable(false);
export const darkMode = writable(false);
export const showErrors = writable(false);
export const difficulty = writable('hard');

function copy(v) {
  return JSON.parse(JSON.stringify(v))
}

function createHistory() {
  const {update, set, subscribe} = writable([])

  return {
    subscribe,
    set,
    // returns a copy of the last move
    latest: () => {
      const v = get(history)
      return copy(v[v.length-1])
    },
    push: (newValue) => {
      return update(history => [...history, copy(newValue)])
    },
    pop: () => update(v => v.pop() && v)
  }
}
export const history = createHistory()

// timer logic
export const paused = writable(true);
export const seconds = writable(0);
let tick = null
paused.subscribe(v => {
  if (!v) {
    tick = setInterval(() => {
      seconds.update(v => v + 1)
    }, 1000)
  } else {
    clearInterval(tick)
  }
})
paused.set(false);

export const displayGrid = writable(stringToGrid('000000000000000000000000000000000000000000000000000000000000000000000000000000000'))
export const gridGrid = writable(displayToGrid(get(displayGrid)))
export const solution = writable(undefined)

// starts a new game
export function newGame() {
  seconds.set(0)
  end.set(false)
  paused.set(false)
  showSettings.set(false)
  let games
  switch (get(difficulty)) {
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
      difficulty.set('hard')
      games = hardGames
  }
  displayGrid.set(stringToGrid(games[getRandomInt(0, games.length)]))
  gridGrid.set(displayToGrid(get(displayGrid)))
  if (get(autoPencil)) {
    doAutoPencil(get(displayGrid), get(gridGrid))
  }
  history.set([JSON.parse(JSON.stringify(get(displayGrid)))])

  generateSolution()
}

// sets $solution so that showErrors works
function generateSolution() {
  const input = []
  for (let row of get(gridGrid)) {
    input.push(row.map(i => i.user ? 0 : Number(i.digit)))
  }
  const s = new Sudoku(input)
  if (!s.solve()) {
    // this should never happen
    console.error('not solvable')
  }
  const c = s.grid.map(row => row.map(cell => cell.toString())).flat().join('')
  solution.set(stringToGrid(c))
}

// pick called when a user clicks a digit on the popup dialog picker
export function pick(digit) {
  if (get(paused)) {
    return
  }
  const sel = get(selected)
  if (!sel) {
    return
  }

  if (get(usingPencil)) {
    if (sel.pencil.includes(digit)) {
      // remove the digit from pencil
      sel.pencil = sel.pencil.filter(v => v !== digit)
      selected.set(sel)
    } else {
      // add the digit to pencil
      sel.pencil.push(digit)
      selected.set(sel)
    }
  } else {
    sel.digit = digit
    selected.set(sel)
    setErrors(get(displayGrid), get(gridGrid))
    clearSuperfluousPencilMarks(sel, get(displayGrid), get(gridGrid))
    selected.set(null)
  }
  // detect the mutations above
  displayGrid.update(v => v)
  gridGrid.update(v => v)
  history.push(get(displayGrid))

  // check for win condition
  for (let row of get(displayGrid)) {
    if (row.some(v => v.digit === '0' || v.error)) {
      return
    }
  }
  end.set(true)
  paused.set(true)
}
