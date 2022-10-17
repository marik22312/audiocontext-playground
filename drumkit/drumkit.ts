import { KickNode, SnareNode } from "../src/helpers/Drum";
import "./drumkit.scss";

const startButton = document.querySelector("#start") as HTMLButtonElement;
const kickButton = document.querySelector("#kick") as HTMLButtonElement;
const snareButton = document.querySelector("#snare") as HTMLButtonElement;

let audioContext: AudioContext;

const playKick = () => {
  const KickDrum = new KickNode(audioContext);
  KickDrum.trigger(audioContext.currentTime);
};
const playSnare = () => {
  const snareDrum = new SnareNode(audioContext);
  snareDrum.trigger(audioContext.currentTime);
};

document.addEventListener(
  "keydown",
  (event) => {
    switch (event.code) {
      case "KeyS":
        playSnare();
        break;
      case "KeyK":
        playKick();
        break;

      default:
        break;
    }
  },
  false
);

startButton.addEventListener("click", () => {
  audioContext = new AudioContext();
  kickButton.disabled = false;
  snareButton.disabled = false;
  startButton.disabled = true;
});

kickButton.addEventListener("click", () => {
  playKick();
});
snareButton.addEventListener("click", () => {
  playSnare();
});
