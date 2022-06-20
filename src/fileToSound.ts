import {connectWaveformVisualizer} from "./helpers/waveform"

const fileInput = document.querySelector<HTMLInputElement>('#fileInput');
const audioElement = document.querySelector<HTMLAudioElement>('#audioPlayer');
const convertBtn = document.querySelector<HTMLButtonElement>('#convert');
const canvas = document.querySelector<HTMLCanvasElement>('#canvas');

let audioContext: AudioContext;

fileInput?.addEventListener('change', (e) => {
	const input = e.target as HTMLInputElement;
	if (input.files?.length) {
		const url = URL.createObjectURL(input.files[0]);
		console.log('url', url)
		audioElement!.src = url;
		audioElement!.controls = true;
	}
})

convertBtn?.addEventListener('click', () => {
	if (!audioContext) {
		audioContext = new AudioContext();
	}

	if (!audioElement || !canvas) {
		return;
	}

	const source = audioContext.createMediaElementSource(audioElement);
	const {analyser} = connectWaveformVisualizer(source, audioContext, canvas);
	analyser.connect(audioContext.destination);
})
export {}