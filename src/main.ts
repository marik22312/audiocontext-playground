import "./style.css";
import { connectWaveformVisualizer, stopWaveform } from "./helpers/waveform";
import {KickNode, SnareNode} from './helpers/Drum'

const button = document.querySelector<HTMLButtonElement>("#play");
const filterWhiteNoiseButton =
  document.querySelector<HTMLButtonElement>("#filteredNoise");
const kickButton = document.querySelector<HTMLButtonElement>("#kick");
const snareButton = document.querySelector<HTMLButtonElement>("#snare");
const highHat = document.querySelector<HTMLButtonElement>("#highHat");
const NoEnvelopeButton =
  document.querySelector<HTMLButtonElement>("#A4NoEnvelope");
const EnvelopeButton = document.querySelector<HTMLButtonElement>("#A4Envelope");
const fourFourtyDemo =
  document.querySelector<HTMLButtonElement>("#fourFourtyDemo");
const canvasDiv = document.querySelector<HTMLCanvasElement>("#canvas")!;

const audioContext = new AudioContext();
const audioAnalyzer = audioContext.createAnalyser();

fourFourtyDemo?.addEventListener("click", () => {
  audioContext.resume().then(() => {
    const oscilator = new OscillatorNode(audioContext, {
      type: "sine",
      frequency: 440,
    });
    oscilator.connect(audioContext.destination);
    oscilator.start();
    oscilator.stop(audioContext.currentTime + 1);
  });
});

const primaryGainNode = audioContext.createGain();
primaryGainNode.connect(audioContext.destination);

button?.addEventListener("click", () => {
  const TRACK_LENGTH_SECONDS = 2;
  const buffer = audioContext.createBuffer(
    1,
    audioContext.sampleRate * TRACK_LENGTH_SECONDS,
    audioContext.sampleRate
  );

  const channelData = buffer.getChannelData(0);

  for (let i = 0; i < buffer.length; i++) {
    channelData[i] = Math.random() * 2 - 1;
  }

  const whitenoiseSource = audioContext.createBufferSource();
  whitenoiseSource.buffer = buffer;
  whitenoiseSource.connect(audioContext.destination);
  whitenoiseSource.start();
});
filterWhiteNoiseButton?.addEventListener("click", () => {
  const TRACK_LENGTH_SECONDS = 2;
  const buffer = audioContext.createBuffer(
    1,
    audioContext.sampleRate * TRACK_LENGTH_SECONDS,
    audioContext.sampleRate
  );

  const channelData = buffer.getChannelData(0);

  for (let i = 0; i < buffer.length; i++) {
    channelData[i] = Math.random() * 2 - 1;
  }

  const whitenoiseSource = audioContext.createBufferSource();
  whitenoiseSource.buffer = buffer;
  const lowpassFilter = new BiquadFilterNode(audioContext, {
    type: "lowpass",
    frequency: 1500,
  });
  whitenoiseSource.connect(lowpassFilter);
  lowpassFilter.connect(primaryGainNode);
  whitenoiseSource.start();
});

snareButton?.addEventListener("click", () => {
  const snareNode = new SnareNode(audioContext);
  snareNode.trigger(audioContext.currentTime)
});

highHat?.addEventListener("click", () => {
  const snareGain = new GainNode(audioContext);
  const ATTACK = 0.02;
  snareGain.gain.value = 0;
  snareGain.gain.linearRampToValueAtTime(1, audioContext.currentTime + ATTACK);
  snareGain.gain.linearRampToValueAtTime(
    0,
    audioContext.currentTime + ATTACK + 0.08
  );
  const snareFilter = audioContext.createBiquadFilter();
  snareFilter.type = "highpass";
  snareFilter.frequency.value = 4000;
  snareFilter.connect(snareGain);
  snareGain.connect(audioContext.destination);
  const TRACK_LENGTH_SECONDS = 0.1;
  const buffer = audioContext.createBuffer(
    1,
    audioContext.sampleRate * TRACK_LENGTH_SECONDS,
    audioContext.sampleRate
  );

  const channelData = buffer.getChannelData(0);

  for (let i = 0; i < buffer.length; i++) {
    channelData[i] = Math.random() * 2 - 1;
  }

  const whitenoiseSource = audioContext.createBufferSource();
  whitenoiseSource.buffer = buffer;
  whitenoiseSource.connect(snareFilter);
  const { analyser } = connectWaveformVisualizer(
    whitenoiseSource,
    audioContext,
    canvasDiv
  );

  whitenoiseSource.start();
});

kickButton?.addEventListener("click", () => {
  const kickNode = new KickNode(audioContext);
  kickNode.trigger(audioContext.currentTime);
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

NoEnvelopeButton?.addEventListener("click", () => {
  audioContext.resume().then(() => {
    const oscillator = new OscillatorNode(audioContext, {
      frequency: 440,
      type: "square",
    });

    oscillator.connect(audioContext.destination);
    oscillator.start();
    oscillator.stop(audioContext.currentTime + 1);
  });
});
EnvelopeButton?.addEventListener("click", () => {
  audioContext.resume().then(() => {
    const oscillator = new OscillatorNode(audioContext, {
      frequency: 440,
      type: "square",
    });
    const envelope = applyEnvelope(audioContext, oscillator);
    envelope.connect(audioContext.destination);

    oscillator.start();
    oscillator.stop(audioContext.currentTime + 1);
  });
});

