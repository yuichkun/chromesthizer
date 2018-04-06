class AudioManager {
    constructor() {
        this.audioContext = new AudioContext();
        this.sampleRate = 44000;

        const downloadButton = document.getElementById("download");
        downloadButton.onclick = () => {
            this.saveFile(this);
        };

    }
    saveFile() {
        console.log("saving file", this);
        const blob = new Blob(this.audioSource.buffer, { type: "audio/wave" });
        // console.log('b', blob);
        // const url = window.URL.createObjectURL(blob);
        // const url = window.URL.createObjectURL(this.audioSource.buffer);
        // downloadButton.href = url;
    }
    init(pixels) {
        const buffer = this.convertImageToSound(pixels);
        this.audioSource = this.createAudioSource(buffer);
    }
    playSound(loop) {
        this.audioSource.loop = loop;
        this.audioSource.start(this.audioContext.currentTime);
    }
    stopSound() {
        const { audioContext, audioSource, gainNode } = this;
        if (audioSource) {
            gainNode.gain.setValueAtTime(0, audioContext.currentTime + 0.1);
        }
    }
    createGain() {
        const gainNode = this.audioContext.createGain();
        this.gainNode = gainNode;
        return gainNode;
    }
    createAudioSource(buffer) {
        const { audioContext } = this;
        const audioSource = audioContext.createBufferSource();
        audioSource.buffer = buffer;
        const gainNode = this.createGain();
        gainNode.gain.value = 0.1;
        audioSource.connect(gainNode);
        gainNode.connect(audioContext.destination);
        return audioSource;
    }
    convertImageToSound(pixels) {
        const { audioContext } = this;
        const buffer = audioContext.createBuffer(2, pixels.length*2, this.sampleRate);
        for (let ch = 0; ch < 2; ch++) {
            let data = buffer.getChannelData(ch);
            this.genSamples(data, pixels);
            console.log(ch, data, data.length);
        }
        return buffer;
    }
    genSamples(data, pixels) {
        function limiter(source) {
            return Math.max(-1.0, Math.min(1.0, source));
        }
        function normalize(sample) { 
            return (sample * 2.0) - 1.0;
        }
        const bufferSize = 1200;
        for (let i = 0; i < pixels.length; i++) { 
            const pixel = pixels[i]
            const [h, s, l] = pixel;
            const brightness = normalize(l); 
            let saturation = 0.0;
            let sample = brightness + saturation;
            sample = limiter(sample);
            data[2 * i] = sample;
            data[(2 * i) + 1] = sample * -1;
        }
    }
}