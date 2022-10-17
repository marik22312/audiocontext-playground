export class KickNode {
	private oscillator?: OscillatorNode;
	private gain?: GainNode;
	constructor(public audioContext: AudioContext) {}
  
	private setup() {
	  this.oscillator = new OscillatorNode(this.audioContext);
	  this.gain = new GainNode(this.audioContext);
	  this.oscillator.connect(this.gain);
	  this.gain.connect(this.audioContext.destination);
	}
  
	public trigger(time: number) {
	  this.setup();
  
	  if (!this.oscillator || !this.gain) {
		return;
	  }
  
	  this.oscillator.frequency.setValueAtTime(150, time);
	  this.gain.gain.setValueAtTime(1, time);
  
	  this.oscillator.frequency.exponentialRampToValueAtTime(0.01, time + 0.5);
	  this.gain.gain.exponentialRampToValueAtTime(0.01, time + 0.5);
  
	  this.oscillator.start(time);
  
	  this.oscillator.stop(time + 0.5);
	}
  }
  
  export class SnareNode {
	private noiseBuffer;
	private noise?: AudioBufferSourceNode;
	private noiseEnvelope?: GainNode;
	private oscillator?: OscillatorNode;
	private oscEnvelope?: GainNode;
	constructor(public audioContext: AudioContext) {
	  let bufferSize = this.audioContext.sampleRate;

	  const buffer = new AudioBuffer({
		numberOfChannels: 1,
		length: bufferSize,
		sampleRate: this.audioContext.sampleRate,
	  })
	  let output = buffer.getChannelData(0);
  
	  for (let i = 0; i < bufferSize; i++) {
		output[i] = Math.random() * 2 - 1;
	  }
  
	  this.noiseBuffer = buffer;
	}
  
	private setup() {
	  this.noise = new AudioBufferSourceNode(this.audioContext, {buffer: this.noiseBuffer});
	  let noiseFilter = new BiquadFilterNode(this.audioContext, {
		type: 'highpass',
		frequency: 1000,
	  });
	  this.noise.connect(noiseFilter);
  
	  this.noiseEnvelope = new GainNode(this.audioContext);
	  noiseFilter.connect(this.noiseEnvelope);
  
	  this.noiseEnvelope.connect(this.audioContext.destination);
  
	  this.oscillator = new OscillatorNode(this.audioContext, {type: 'triangle'});
  
	  this.oscEnvelope = new GainNode(this.audioContext);
	  this.oscillator.connect(this.oscEnvelope);
	  this.oscEnvelope.connect(this.audioContext.destination);
	}
  
	public trigger(time: number) {
	  this.setup();
  
	  this.noiseEnvelope!.gain.setValueAtTime(1, time);
	  this.noiseEnvelope!.gain.exponentialRampToValueAtTime(0.01, time + 0.2);
	  this.noise!.start(time)
  
	  this.oscillator!.frequency.setValueAtTime(100, time);
	  this.oscEnvelope!.gain.setValueAtTime(0.7, time);
	  this.oscEnvelope!.gain.exponentialRampToValueAtTime(0.01, time + 0.1);
	  this.oscillator!.start(time)
  
	  this.oscillator!.stop(time + 0.2);
	  this.noise!.stop(time + 0.2);
	}
  }
  