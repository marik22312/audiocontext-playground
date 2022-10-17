const WIDTH = 500;
const HEIGHT = 150;

export const drawWaveform = (canvas: HTMLCanvasElement, data: number[]) => {
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    console.error("Could not get canvas context");
    return;
  }
  const dpr = window.devicePixelRatio || 1;
  const padding = 20;
  canvas.width = canvas.offsetWidth * dpr;
  canvas.height = (canvas.offsetHeight + padding * 2) * dpr;
  ctx.scale(dpr, dpr);
  ctx.translate(0, canvas.offsetHeight / 2 + padding);

  const width = canvas.offsetWidth / data.length;
  for (let i = 0; i < data.length; i++) {
    const x = width * i;
    let height = data[i] * canvas.offsetHeight - padding;
    if (height < 0) {
      height = 0;
    } else if (height > canvas.offsetHeight / 2) {
      height = canvas.offsetHeight / 2;
    }
    drawLineSegment(ctx, x, height, width, (i + 1) % 2);
  }
};

export const drawLineSegment = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  isEven: any
) => {
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

export const connectWaveformVisualizer = (
  source: AudioNode,
  audioCtx: AudioContext,
  canvas: HTMLCanvasElement
) => {
  const ctx = canvas.getContext("2d");
  const analyser = new AnalyserNode(audioCtx, { fftSize: 2048 });

  if (!ctx) {
    console.error("Could not get canvas context");
    return {
      analyser,
    };
  }
  source.connect(analyser);
  var dataArray = new Uint8Array(analyser.fftSize);

  ctx.clearRect(0, 0, WIDTH, HEIGHT);

  drawOscillator(canvas, analyser, dataArray, analyser.fftSize);

  return {
    analyser,
  };
};

let animationFrameRequest: any;
let drawVisual: any;
export const stopWaveform = () => {
  animationFrameRequest && cancelAnimationFrame(animationFrameRequest);
  drawVisual && cancelAnimationFrame(drawVisual);
};

const drawOscillator = (
  canvas: HTMLCanvasElement,
  analyser: AnalyserNode,
  dataArray: Uint8Array,
  bufferLength: number
) => {
  animationFrameRequest = requestAnimationFrame(() =>
    drawOscillator(canvas, analyser, dataArray, analyser.fftSize)
  );
  analyser.getByteTimeDomainData(dataArray);
  draw(canvas, bufferLength, dataArray);
};

function draw(
  canvas: HTMLCanvasElement,
  bufferLength: any,
  dataArray: Uint8Array
) {
  const ctx = canvas.getContext("2d");

  if (!ctx) {
    console.error("Could not get canvas context");
    return alert("Could not get canvas context");
  }
  ctx.fillStyle = "#222";
  ctx.fillRect(0, 0, WIDTH, HEIGHT);
  ctx.lineWidth = 2;
  ctx.strokeStyle = "#fff";
  ctx.beginPath();
  var sliceWidth = (WIDTH * 1.0) / bufferLength;
  var x = 0;

  for (var i = 0; i < bufferLength; i++) {
    var v = dataArray[i] / 128.0;
    var y = (v * HEIGHT) / 2;

    if (i === 0) {
      ctx.moveTo(x, y);
    } else {
      ctx.lineTo(x, y);
    }

    x += sliceWidth;
  }
  ctx.lineTo(canvas.width, canvas.height / 2);
  ctx.stroke();
}

export const drawFrequencyBarChart = (
  audioContext: AudioContext,
  source: AudioNode,
  canvas: HTMLCanvasElement
) => {
  const canvasContext = canvas.getContext("2d");
  const analyser = new AnalyserNode(audioContext, { fftSize: 256 });
  source.connect(analyser);
  if (!canvasContext) {
    console.error("Could not get canvas context");
    return alert("Could not get canvas context");
  }
  
  const dataArray = new Uint8Array(analyser.frequencyBinCount);
  
  canvasContext.clearRect(0, 0, WIDTH, HEIGHT);
  drawBarChart(analyser, canvasContext, dataArray);
};

const drawBarChart = (
  analyser: AnalyserNode,
  canvasContext: CanvasRenderingContext2D,
  dataArray: Uint8Array
) => {
  const bufferLength = analyser.frequencyBinCount;
  analyser.getByteFrequencyData(dataArray);
  drawVisual = requestAnimationFrame(() =>
    drawBarChart(analyser, canvasContext, dataArray)
  );

  canvasContext.fillStyle = "rgb(0, 0, 0)";
  canvasContext.fillRect(0, 0, WIDTH, HEIGHT);
  const barWidth = (WIDTH / bufferLength) * 2.5;
  let barHeight;
  let x = 0;
  console.log(dataArray.toString(), dataArray.length);
  for (let i = 0; i < bufferLength; i++) {
    barHeight = dataArray[i] / 2;

    canvasContext.fillStyle = `rgb(${barHeight + 100}, 50, 50)`;
	const y = HEIGHT - barHeight / 2;
    canvasContext.fillRect(x, y, barWidth, barHeight / 2);

    x += barWidth + 1;
  }
};
