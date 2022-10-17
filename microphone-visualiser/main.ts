import './style.scss';
import { getMediaStreamSourceFromMicrophone } from '../src/helpers/microphone';
import {
  connectWaveformVisualizer,
  stopWaveform,
  drawFrequencyBarChart,
} from '../src/helpers/waveform';

const startButton = document.querySelector<HTMLButtonElement>("#start");
const canvas = document.querySelector<HTMLCanvasElement>("#canvas");
const barCanvas = document.querySelector<HTMLCanvasElement>("#barCanvas");

if (!canvas || !startButton || !barCanvas) {
  throw new Error("Canvas not found");
}

let audioContext: AudioContext;

let audioStream: MediaStream;



const connectMicAndVisualize = async () => {
  audioContext = new AudioContext();
  const {source, mediaStream} = await getMediaStreamSourceFromMicrophone(audioContext);
  audioStream = mediaStream;
  const gainNode = new GainNode(audioContext, { gain: 1 });
  source.connect(gainNode);
  connectWaveformVisualizer(gainNode, audioContext, canvas);
  drawFrequencyBarChart(audioContext, gainNode, barCanvas);
};

const stopVisualizer = () => {
  stopWaveform();
  audioStream.getTracks().forEach((t) => t.stop());
};

startButton.addEventListener("click", () => {
  if (startButton.innerText === "Start") {
    startButton.innerText = "Stop";
    startButton.classList.add("active");
    connectMicAndVisualize();
  } else {
    startButton.innerText = "Start";
    startButton.classList.remove("active");
    stopVisualizer();
  }
});

export {};
