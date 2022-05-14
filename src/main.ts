import "./style.css";
import {} from "./visualizer"

const app = document.querySelector<HTMLDivElement>("#app")!;
const pianoDiv = document.querySelector<HTMLDivElement>("#piano")!;
const button = document.querySelector<HTMLButtonElement>("#play");
const kickButton = document.querySelector<HTMLButtonElement>("#kick");
const snareButton = document.querySelector<HTMLButtonElement>("#snare");
const canvasDiv = document.querySelector<HTMLCanvasElement>("#canvas")!;
const canvasContext = canvasDiv.getContext("2d");

import notesChart from './notes.json'

app.innerHTML = `
  <h1>Playground</h1>
`;

const audioContext = new AudioContext();
const audioAnalyzer = audioContext.createAnalyser();

const TRACK_LENGTH_SECONDS = 0.2;
const buffer = audioContext.createBuffer(
  1,
  audioContext.sampleRate * TRACK_LENGTH_SECONDS,
  audioContext.sampleRate
);

const channelData = buffer.getChannelData(0);

for (let i = 0; i < buffer.length; i++) {
  channelData[i] = Math.random() * 2 - 1;
}

const primaryGainNode = audioContext.createGain();
primaryGainNode.connect(audioContext.destination);

button?.addEventListener("click", () => {
  const whitenoiseSource = audioContext.createBufferSource();
  whitenoiseSource.buffer = buffer;
  whitenoiseSource.connect(primaryGainNode);
  console.log("Clicked");
  whitenoiseSource.start();
});

const snareFilter = audioContext.createBiquadFilter();
snareFilter.type = "highpass";
snareFilter.frequency.value = 1500;
snareFilter.connect(primaryGainNode);

snareButton?.addEventListener("click", () => {
  const whitenoiseSource = audioContext.createBufferSource();
  whitenoiseSource.buffer = buffer;
  whitenoiseSource.connect(snareFilter);
  whitenoiseSource.start();
});



kickButton?.addEventListener("click", () => {
  const kickOsc = audioContext.createOscillator();
  kickOsc.frequency.setValueAtTime(150, 0);
  kickOsc.frequency.exponentialRampToValueAtTime(
    0.001,
    audioContext.currentTime + 0.5
  );

  const kickGain = audioContext.createGain();
  kickGain.gain.setValueAtTime(1, 0);
  kickGain.gain.exponentialRampToValueAtTime(
    0.001,
    audioContext.currentTime + 0.5
  );

  kickOsc.connect(audioAnalyzer)
  kickOsc.connect(kickGain);
  kickGain.connect(primaryGainNode);
  kickOsc.start();
  kickOsc.stop(audioContext.currentTime + 0.3);

});

const NOTE_ATTACK_TIME = 0.2;
const NOTE_DECAY_TIME = 0.3;
const NOTE_SUSTAIN_LEVEL = 0.7;
const NOTE_RELEASE_TIME = 0.2;

notesChart.forEach((note) => {
  const button = document.createElement("button");
  button.innerText = note.name;
  button.addEventListener("click", () => {
    const now = audioContext.currentTime;

    const oscilator = audioContext.createOscillator();
    const noteGain = audioContext.createGain();
    noteGain.gain.setValueAtTime(0, 0);
    noteGain.gain.linearRampToValueAtTime(0.5, now + NOTE_ATTACK_TIME);
	noteGain.gain.linearRampToValueAtTime(NOTE_SUSTAIN_LEVEL, now + NOTE_ATTACK_TIME + NOTE_DECAY_TIME);
	noteGain.gain.setValueAtTime(NOTE_SUSTAIN_LEVEL, now + 1 - NOTE_RELEASE_TIME)
	noteGain.gain.linearRampToValueAtTime(0, now + 1);
    
	oscilator.type = "square";
    oscilator.frequency.setValueAtTime(note.frequency, 0);
	oscilator.connect(noteGain);
    noteGain.connect(primaryGainNode);
    oscilator.start();
    oscilator.stop(audioContext.currentTime + 1);
  });

  pianoDiv.appendChild(button);
});
