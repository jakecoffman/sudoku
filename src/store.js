import {writable, get} from "svelte/store";

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
}

export const autoPencil = writable(false);
export const darkMode = writable(false);
export const showErrors = writable(false);
export const difficulty = writable('hard');

function createHistory() {
  const {update, set, subscribe} = writable([])

  return {
    subscribe,
    set,
    // returns a copy of the last move
    latest: () => {
      const v = get(history)
      return JSON.parse(JSON.stringify(v[v.length-1]))
    },
    push: (newValue) => {
      return update(history => [...history, JSON.parse(JSON.stringify(newValue))])
    },
    pop: () => update(v => v.pop() && v)
  }
}
export const history = createHistory()
