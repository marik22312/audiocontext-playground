const T=(r,e,n)=>{const t=n.getContext("2d"),o=new AnalyserNode(e,{fftSize:2048});if(!t)return console.error("Could not get canvas context"),{analyser:o};r.connect(o);var c=new Uint8Array(o.fftSize);return t.clearRect(0,0,500,150),H(n,o,c,o.fftSize),{analyser:o}};let a,f;const d=()=>{a&&cancelAnimationFrame(a),f&&cancelAnimationFrame(f)},H=(r,e,n,t)=>{a=requestAnimationFrame(()=>H(r,e,n,e.fftSize)),e.getByteTimeDomainData(n),g(r,t,n)};function g(r,e,n){const t=r.getContext("2d");if(!t)return console.error("Could not get canvas context"),alert("Could not get canvas context");t.fillStyle="#222",t.fillRect(0,0,500,150),t.lineWidth=2,t.strokeStyle="#fff",t.beginPath();for(var o=500*1/e,c=0,l=0;l<e;l++){var i=n[l]/128,s=i*150/2;l===0?t.moveTo(c,s):t.lineTo(c,s),c+=o}t.lineTo(r.width,r.height/2),t.stroke()}const m=(r,e,n)=>{const t=n.getContext("2d"),o=new AnalyserNode(r,{fftSize:256});if(e.connect(o),!t)return console.error("Could not get canvas context"),alert("Could not get canvas context");const c=new Uint8Array(o.frequencyBinCount);t.clearRect(0,0,500,150),u(o,t,c)},u=(r,e,n)=>{const t=r.frequencyBinCount;r.getByteFrequencyData(n),f=requestAnimationFrame(()=>u(r,e,n)),e.fillStyle="rgb(0, 0, 0)",e.fillRect(0,0,500,150);const o=500/t*2.5;let c,l=0;console.log(n.toString(),n.length);for(let i=0;i<t;i++){c=n[i]/2,e.fillStyle=`rgb(${c+100}, 50, 50)`;const s=150-c/2;e.fillRect(l,s,o,c/2),l+=o+1}};export{T as c,m as d,d as s};