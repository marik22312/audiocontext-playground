
import {getMediaStreamSourceFromMicrophone} from './helpers/microphone'

const startButton = document.querySelector('#start');
const pannerSlider = document.querySelector<HTMLInputElement>('#panner');
const enablePannerButton = document.querySelector<HTMLInputElement>('#enablePanner');

const onStartMicrophone = async () => {
	const audioContext = new AudioContext()
	const {source} = await getMediaStreamSourceFromMicrophone(audioContext);
	source.connect(audioContext.destination);

	const delay = new DelayNode(audioContext, {delayTime: 0.3});
	
	enablePannerButton?.addEventListener('change', (e) => {
		if (e.target.checked) {
			return source.connect(delay).connect(audioContext.destination);
		}
		else {
			delay.disconnect();
		}
	})
}


startButton?.addEventListener('click', onStartMicrophone)