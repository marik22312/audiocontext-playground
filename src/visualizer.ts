import { connectWaveformVisualizer } from './helpers/waveform';
import notesChart from "./notes.json";

const startButton = document.querySelector<HTMLButtonElement>("#start");
const canvas = document.querySelector<HTMLCanvasElement>("#canvas");
const staticCanvas = document.querySelector<HTMLCanvasElement>("#staticCanvas");
const audioElement = document.querySelector<HTMLAudioElement>("#audioOutput");
const delayRange = document.querySelector<HTMLInputElement>("#delayRange");
const delayValue = document.querySelector("#delayValue");

if (!canvas || !startButton || !audioElement || !delayRange || !delayValue || !staticCanvas) {
  throw new Error("Canvas not found");
}

const staticCtx = staticCanvas.getContext("2d")!;
const audioContext = new AudioContext();
const primaryGainNode = audioContext.createGain();
primaryGainNode.connect(audioContext.destination);

let animationFrameRequest: number;

let audioStream: MediaStream;



const destination = audioContext.createMediaStreamDestination();
const mediaRecorder = new MediaRecorder(destination.stream);
const chunks: Blob[] = [];

mediaRecorder.addEventListener("dataavailable", (e) => {
  console.log("Data available");
  chunks.push(e.data);
});

mediaRecorder.addEventListener("stop", async (e) => {
  const blob = new Blob(chunks, { type: "audio/ogg; codecs=opus" });
  const arrayBuffer = await new Response(blob).arrayBuffer();
  const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);

  const filteredData = filterAudioBufferData(audioBuffer);
  console.log("filter audio buffer", filteredData);
  const normalData = normalizeData(filteredData);
  console.log("normalized data", normalData);
  drawWaveform(normalData);
  const source = audioContext.createBufferSource();
  source.buffer = audioBuffer;

  const url = URL.createObjectURL(blob);
  audioElement.src = url;
  audioElement.controls = true;
});

const drawWaveform = (data: number[]) => {
	const dpr = window.devicePixelRatio || 1;
  const padding = 20;
  staticCanvas.width = staticCanvas.offsetWidth * dpr;
  staticCanvas.height = (staticCanvas.offsetHeight + padding * 2) * dpr;
  staticCtx.scale(dpr, dpr);
  staticCtx.translate(0, staticCanvas.offsetHeight / 2 + padding);

  const width = staticCanvas.offsetWidth / data.length;
  for (let i = 0; i < data.length; i++) {
    const x = width * i;
    let height = data[i] * staticCanvas.offsetHeight - padding;
    if (height < 0) {
        height = 0;
    } else if (height > staticCanvas.offsetHeight / 2) {
        height = staticCanvas.offsetHeight / 2;
    }
    drawLineSegment(staticCtx, x, height, width, (i + 1) % 2);
  }
}

const drawLineSegment = (ctx: CanvasRenderingContext2D, x: number, y: number, width: number, isEven: any) => {
	ctx.lineWidth = 1; // how thick the line is
	ctx.strokeStyle = "#000"; // what color our line is
	ctx.beginPath();
	y = isEven ? y : -y;
	ctx.moveTo(x, 0);
	ctx.lineTo(x, y);
	ctx.arc(x + width / 2, y, width / 2, Math.PI, 0, isEven);
	ctx.lineTo(x + width, 0);
	ctx.stroke();
  };
  
const filterAudioBufferData = (buffer: AudioBuffer) => {
  const rawData = buffer.getChannelData(0); // We only need to work with one channel of data
  const samples = 140; // Number of samples we want to have in our final data set
  const blockSize = Math.floor(rawData.length / samples); // Number of samples in each subdivision
  const filteredData = [];
  for (let i = 0; i < samples; i++) {
    let blockStart = blockSize * i; // the location of the first sample in the block
    let sum = 0;
    for (let j = 0; j < blockSize; j++) {
      sum = sum + Math.abs(rawData[blockStart + j]) // find the sum of all the samples in the block
    }
    filteredData.push(sum / blockSize); // divide the sum by the block size to get the average
  }
  return filteredData;
};

const normalizeData = (filteredData: number[]) => {
	const multiplier = Math.pow(Math.max(...filteredData), -1);
	return filteredData.map(n => n * multiplier);
  }

const connectVisualizer = async () => {
  console.log("Start visualizer");
  audioStream = await navigator.mediaDevices.getUserMedia({ audio: true });

  const source = audioContext.createMediaStreamSource(audioStream);
  const gainNode = audioContext.createGain();
  const delayNode = audioContext.createDelay();
  delayNode.delayTime.value = 1;
  gainNode.gain.setValueAtTime(1, 0);

  // source -> delay -> gain -> out
  // Connect to delay
//   source.connect(delayNode);
  // Connect delay to gain
  source.connect(gainNode);
  // Connect gain to output
  gainNode.connect(audioContext.destination);

  gainNode.connect(destination);
  mediaRecorder.start();

  delayRange.addEventListener("input", (e) => {
    // @ts-expect-error
    delayNode.delayTime.value = e.target?.value;
    // @ts-expect-error
    delayValue.innerText = e.target?.value;
  });
  connectWaveformVisualizer(gainNode, audioContext, canvas);
};

const stopVisualizer = () => {
  animationFrameRequest && cancelAnimationFrame(animationFrameRequest);
  audioStream.getTracks().forEach((t) => t.stop());
  mediaRecorder.stop();
};

startButton.addEventListener("click", () => {
  if (startButton.innerText === "Start") {
    startButton.innerText = "Stop";
    startButton.classList.add("active");
    connectVisualizer();
  } else {
    startButton.innerText = "Start";
    startButton.classList.remove("active");
    stopVisualizer();
  }
});

export {};
