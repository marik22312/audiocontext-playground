export const getMediaStreamSourceFromMicrophone = async (
	audioContext: AudioContext
  ) => {
	const mediaStream = await navigator.mediaDevices.getUserMedia({
	  audio: true,
	});
	const source = new MediaStreamAudioSourceNode(audioContext, { mediaStream });
	return {source, mediaStream};
  };