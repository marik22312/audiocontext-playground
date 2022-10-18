import"./modulepreload-polyfill.b7f2da20.js";import{c as d,d as m,s as l}from"./waveform.f9b347fa.js";var f=[{id:"C4",name:"C | Do",frequency:261.63},{id:"C4#",name:"C#",frequency:277.18},{id:"D4",name:"D | R\xE9",frequency:293.66},{id:"D4#",name:"D#",frequency:311.13},{id:"E4",name:"E | Mi",frequency:329.63},{id:"F4",name:"F | Fa",frequency:349.23},{id:"F4#",name:"F#",frequency:369.99},{id:"G4",name:"G | Sol",frequency:392},{id:"G4#",name:"G#",frequency:415.3},{id:"A4",name:"A | La",frequency:440},{id:"A4#",name:"A#",frequency:466.16},{id:"B4",name:"B | Si",frequency:493.88},{id:"C5",name:"C | Do",frequency:523.25}];const o=document.querySelector("#visualizer"),c=document.querySelector("#barChart"),n=new AudioContext;f.forEach(a=>{const r=document.getElementById(`${a.id}`);if(!r){console.error(`Couldn't find note with id ${a.id}`);return}r.addEventListener("click",()=>{n.resume().then(()=>{const e=new OscillatorNode(n,{type:"square",frequency:a.frequency}),t=E(n,e),i=new BiquadFilterNode(n,{type:"lowpass",frequency:440});t.connect(i),o&&d(i,n,o),c&&m(n,i,c),i.connect(n.destination),e.start(),e.stop(n.currentTime+2),e.addEventListener("ended",()=>{l()})})})});const u=.2,y=.3,s=.7,q=.2,E=(a,r)=>{const e=new GainNode(a),t=a.currentTime;return e.gain.setValueAtTime(0,0),e.gain.linearRampToValueAtTime(1,t+u),e.gain.linearRampToValueAtTime(s,t+u+y),e.gain.setValueAtTime(s,t+1-q),e.gain.linearRampToValueAtTime(0,t+1),r.connect(e)};
