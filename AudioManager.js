class AudioManager {
    constructor() {
        this.audioContext = new AudioContext();
        this.sampleRate = 44000;

        const downloadButton = document.getElementById("download");
        downloadButton.onclick = () => {
            this.saveFile(downloadButton);
        };

    }
    saveFile(downloadButton) {
        console.log("Saving file");
        const { buffer } = this.audioSource; 
        const wav = audioBufferToWav(buffer);
        const blob = new Blob([new DataView(wav)], {
            type: "audio/wav"
        });
        const url = window.URL.createObjectURL(blob);
        downloadButton.href = url;
        downloadButton.download = "audio.wav";
        downloadButton.click();
        // window.URL.revokeObjectURL(url)
    }
    init(pixels) {
        const buffer = this.convertImageToSound(pixels);
        this.audioSource = this.createAudioSource(buffer);
    }
    playSound(loop) {
        console.log(this.audioSource);
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
        const buffer = audioContext.createBuffer(2, pixels.length, this.sampleRate);
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
            return ((sample / 255) * 2) - 1.0;
        }
        for (let i = 0; i < pixels.length; i++) { 
            let sample = pixels[i]; 
            data[i] = normalize(sample);
        }
    }
}