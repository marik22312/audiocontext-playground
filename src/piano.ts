import { connectWaveformVisualizer, stopWaveform, drawFrequencyBarChart } from './helpers/waveform';
import notesChart from "./notes.json";

const visualizerCanvas = document.querySelector<HTMLCanvasElement>('#visualizer');
const barChartCanvas = document.querySelector<HTMLCanvasElement>('#barChart');

const audioContext = new AudioContext();

notesChart.forEach((note) => {
  const noteButton = document.getElementById(`${note.id}`);

  if (!noteButton) {
    console.error(`Couldn't find note with id ${note.id}`);
    return;
  }

  noteButton.addEventListener("click", () => {
	audioContext.resume().then(() => {
		const oscillator = new OscillatorNode(audioContext, {
		  type: "square",
		  frequency: note.frequency,
		});
		const envelope = applyEnvelope(audioContext, oscillator);
		const filter = new BiquadFilterNode(audioContext, {
			type: "lowpass",
			frequency: 440,
		})
		envelope.connect(filter);
		visualizerCanvas && connectWaveformVisualizer(filter, audioContext, visualizerCanvas)
		barChartCanvas && drawFrequencyBarChart(audioContext, filter, barChartCanvas);
		filter.connect(audioContext.destination);
		oscillator.start();
		oscillator.stop(audioContext.currentTime + 2);
		oscillator.addEventListener('ended', () => {
			stopWaveform();
		})
	  });

	})
});

const NOTE_ATTACK_TIME = 0.2;
const NOTE_DECAY_TIME = 0.3;
const NOTE_SUSTAIN_LEVEL = 0.7;
const NOTE_RELEASE_TIME = 0.2;
const applyEnvelope = (audioContext: AudioContext, source: AudioNode) => {
  const noteGain = new GainNode(audioContext);
  const now = audioContext.currentTime;

  noteGain.gain.setValueAtTime(0, 0);
  noteGain.gain.linearRampToValueAtTime(1, now + NOTE_ATTACK_TIME);
  noteGain.gain.linearRampToValueAtTime(
    NOTE_SUSTAIN_LEVEL,
    now + NOTE_ATTACK_TIME + NOTE_DECAY_TIME
  );
  noteGain.gain.setValueAtTime(NOTE_SUSTAIN_LEVEL, now + 1 - NOTE_RELEASE_TIME);
  noteGain.gain.linearRampToValueAtTime(0, now + 1);
  return source.connect(noteGain);
};

export interface EnvelopeNodeOptions {
  attackTime: number;
  decayTime: number;
  sustainLevel: number;
  releaseTime: number;
}
export class EnvelopeNode extends AudioNode {
  private gainNode: GainNode;

  constructor(audioContext: AudioContext, options: {}) {
    super();
    this.gainNode = new GainNode(audioContext);
    const now = audioContext.currentTime;

    this.gainNode.gain.setValueAtTime(0, 0);
    this.gainNode.gain.linearRampToValueAtTime(1, now + NOTE_ATTACK_TIME);
    this.gainNode.gain.linearRampToValueAtTime(
      NOTE_SUSTAIN_LEVEL,
      now + NOTE_ATTACK_TIME + NOTE_DECAY_TIME
    );
    this.gainNode.gain.setValueAtTime(
      NOTE_SUSTAIN_LEVEL,
      now + 1 - NOTE_RELEASE_TIME
    );
    this.gainNode.gain.linearRampToValueAtTime(0, now + 1);
  }

  public connect(destinationNode: AudioNode, output?: number, input?: number): AudioNode;
  public connect(destinationParam: AudioParam, output?: number): void;
  public connect(destinationNode: any, output?: any, input?: any): void | AudioNode {
	  
  }
}
