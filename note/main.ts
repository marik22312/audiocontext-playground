import "./style.scss";
const button = document.querySelector<HTMLButtonElement>("#play");

(() => {
  if (!button) {
    console.error("Couldnt find button");
	return;
  }

  button.addEventListener("click", () => {
    button.disabled = true;
    const ctx = new AudioContext();
    const osc = new OscillatorNode(ctx, { frequency: 440 });

    const gain = new GainNode(ctx, { gain: 0.5 });

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 1);
    osc.addEventListener("ended", () => {
      button.disabled = false;
    });
  });
})();
