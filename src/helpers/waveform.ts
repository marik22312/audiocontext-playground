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
  canvas: HTMLCanvasElement,
) => {
  const ctx = canvas.getContext("2d");
  const analyser = audioCtx.createAnalyser();

  if (!ctx) {
    console.error("Could not get canvas context");
    return {
		analyser
	};
  }
  source.connect(analyser);
  analyser.fftSize = 2048;
  var bufferLength = analyser.frequencyBinCount;
  var dataArray = new Uint8Array(bufferLength);

  ctx.clearRect(0, 0, WIDTH, HEIGHT);

  drawOscillator(canvas, analyser, dataArray, bufferLength);

  return {
	  analyser
  }
};

let animationFrameRequest: any;
const drawOscillator = (
  canvas: HTMLCanvasElement,
  analyser: AnalyserNode,
  dataArray: any,
  bufferLength: any
) => {
  const ctx = canvas.getContext("2d");

  if (!ctx) {
    console.error("Could not get canvas context");
    return;
  }

  animationFrameRequest = requestAnimationFrame(() =>
    drawOscillator(canvas, analyser, dataArray, bufferLength)
  );
  analyser.getByteTimeDomainData(dataArray);
  ctx.fillStyle = "rgb(200, 200, 200)";
  ctx.fillRect(0, 0, WIDTH, HEIGHT);
  ctx.lineWidth = 2;
  ctx.strokeStyle = "rgb(0, 0, 0)";
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
};
