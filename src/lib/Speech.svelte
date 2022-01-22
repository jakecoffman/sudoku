<script>
  import {onMount} from "svelte";

  let recognition

  onMount(() => {
    let SpeechRecognition = window.webkitSpeechRecognition
    let SpeechGrammarList = window.webkitSpeechGrammarList

    let groups = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I']
    let cells = ['1', '2', '3', '4', '5', '6', '7', '8', '9']
    let commands = ['play', 'clear', 'pencil']

    // after writing this I found it is not being used...
    let grammar = `#JSGF V1.0;
grammar sudoku;
<action> = ${commands.join(' | ')};
<group> = ${groups.join(' | ')};
<cell> = ${cells.join(' | ')};
<entry> = ${cells.join(' | ')};
public <command> = <action> <group> <cell> <entry>;
`

    recognition = new SpeechRecognition();
    let speechRecognitionList = new SpeechGrammarList();
    speechRecognitionList.addFromString(grammar, 1);
    recognition.grammars = speechRecognitionList;
    recognition.continuous = false;
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

// document.body.onclick = function() {
//   recognition.start();
//   console.log('Ready to receive a color command.');
// }

    recognition.onresult = function(event) {
      // The SpeechRecognitionEvent results property returns a SpeechRecognitionResultList object
      // The SpeechRecognitionResultList object contains SpeechRecognitionResult objects.
      // It has a getter so it can be accessed like an array
      // The first [0] returns the SpeechRecognitionResult at the last position.
      // Each SpeechRecognitionResult object contains SpeechRecognitionAlternative objects that contain individual results.
      // These also have getters so they can be accessed like arrays.
      // The second [0] returns the SpeechRecognitionAlternative at position 0.
      // We then return the transcript property of the SpeechRecognitionAlternative object
      let color = event.results[0][0].transcript;
      console.log(event.results)
      console.log('Result received: ' + color + '.')
      console.log('Confidence: ' + event.results[0][0].confidence);
    }

    recognition.onspeechend = function() {
      //recognition.stop();
      useVoice = false
    }

    recognition.onnomatch = function(event) {
      console.log("I didn't recognise that color.")
    }

    recognition.onerror = function(event) {
      console.log('Error occurred in recognition: ' + event.error)
    }

  })

  let useVoice = false
</script>

<label>
  <input bind:checked={useVoice} on:click={recognition.start()} type="checkbox">
  <span>Voice commands</span>
</label>
