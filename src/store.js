import {writable} from "svelte/store";

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
}

export const autoPencil = writable(false);
export const darkMode = writable(false);
export const showErrors = writable(false);
export const difficulty = writable('hard');
