class Converter {
    constructor() {
        this.config = {
            imgPath: "",
            blur: 0,
            brightness: 100,
            hue: 0,
            saturation: 100,
            contrast: 100,
            sampleRate: 44000
        }
        this.audioManager = new AudioManager();
        this.canvasManager = new CanvasManager();
        const proxyConfig = new Proxy(this.config, {
            set: (obj, prop, value) => { 
                this.init();
                console.log(obj);
                return Reflect.set(obj, prop, value);
            }
        });
        this.uiManager = new UIManager(proxyConfig);
    }
    async init() {
        const { config, audioManager, canvasManager } = this;
        canvasManager.updateConfig(config);
        const pixels = await canvasManager.extractPixels(config);
        audioManager.stopSound();
        audioManager.sampleRate = config.sampleRate;
        audioManager.init(pixels);
        audioManager.playSound(true);
    }
    onDrop(e){ 
        e.preventDefault();
        const { items } = e.dataTransfer;
        const item = items[0];
        const data = e.dataTransfer.getData('image/jpeg');
        if (item.kind === 'file') {
            const file = item.getAsFile();
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = (e2) => {
                const img = e2.target.result;
                const { config } = this;
                config.imgPath = img;
                this.init();
            };
        }
    }
    onDrag(e){
        e.preventDefault();
    }
}

const converter = new Converter();

