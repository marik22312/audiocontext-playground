const leftBtn = document.querySelector('#left');
const centerBtn = document.querySelector('#center');
const rightBtn = document.querySelector('#right');

leftBtn?.addEventListener('click', () => {
	console.log('Click')
	const ac = new AudioContext();
	const splitter = ac.createChannelSplitter(2);
	const oscilator = ac.createOscillator();
	const merger = ac.createChannelMerger(2);
	oscilator.frequency.value = 440;
	
	const gainNode = ac.createGain();

	// connect oscilator to splitter channel
	oscilator.connect(splitter);

	gainNode.gain.setValueAtTime(0.5, ac.currentTime);
	splitter.connect(gainNode, 0);
	gainNode.connect(merger, 0, 0);
	merger.connect(ac.destination);

 	oscilator.start(0);
 	oscilator.stop(1);
})
rightBtn?.addEventListener('click', () => {
	console.log('Click Right')
	const ac = new AudioContext();
	const splitter = ac.createChannelSplitter(2);
	const oscilator = ac.createOscillator();
	const merger = ac.createChannelMerger(2);
	oscilator.frequency.value = 440;
	
	const gainNode = ac.createGain();

	// connect oscilator to splitter channel
	oscilator.connect(splitter);

	gainNode.gain.setValueAtTime(0.5, ac.currentTime);
	splitter.connect(gainNode, 0);
	gainNode.connect(merger, 0, 1);
	merger.connect(ac.destination);

 	oscilator.start(0);
 	oscilator.stop(1);
})

centerBtn?.addEventListener('click', () => {
	console.log('Click center')
	const ac = new AudioContext();
	const splitter = ac.createChannelSplitter(6);
	const oscilator = ac.createOscillator();
	const merger = ac.createChannelMerger(6);
	oscilator.frequency.value = 440;
	
	const gainNode = ac.createGain();

	// connect oscilator to splitter channel
	oscilator.connect(splitter);

	gainNode.gain.setValueAtTime(0.5, ac.currentTime);
	splitter.connect(gainNode, 0);
	gainNode.connect(merger, 0, 4);
	merger.connect(ac.destination);

 	oscilator.start(0);
 	oscilator.stop(1);
})

export {}