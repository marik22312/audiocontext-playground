const startButton = document.querySelector<HTMLButtonElement>("#start");
const canvas = document.querySelector<HTMLCanvasElement>("#canvas");
const audioElement = document.querySelector<HTMLAudioElement>("#audioOutput");

if (!canvas || !startButton || !audioElement) {
  throw new Error("Canvas not found");
}

const WIDTH = 500;
const HEIGHT = 150;
const ctx = canvas.getContext("2d")!;
const audioContext = new AudioContext();
const analyzer = audioContext.createAnalyser();

let animationFrameRequest: number;

let audioStream: MediaStream;

const connectVisualizer = async () => {
  console.log("Start visualizer");
  audioStream = await navigator.mediaDevices.getUserMedia({ audio: true });
  audioElement.srcObject = audioStream;
  audioElement.play();

  const source = audioContext.createMediaStreamSource(audioStream);
  const gainNode = audioContext.createBiquadFilter();
  gainNode.type = "highpass";
  gainNode.frequency.value = 15000;
  gainNode.gain.value = 0.5;

  source.connect(gainNode);
  source.connect(analyzer);
  analyzer.connect(gainNode);
  gainNode.connect(audioContext.destination);

  analyzer.fftSize = 2048;
  analyzer.fftSize = 2048;
  var bufferLength = analyzer.frequencyBinCount;
  var dataArray = new Uint8Array(bufferLength);

  ctx.clearRect(0, 0, WIDTH, HEIGHT);

  const draw = () => {
	  console.log('Draw')
    animationFrameRequest = requestAnimationFrame(draw);
    analyzer.getByteTimeDomainData(dataArray);
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
	draw();
};

const stopVisualizer = () => {
animationFrameRequest && cancelAnimationFrame(animationFrameRequest);
  audioStream.getTracks().forEach((t) => t.stop());
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
