class Converter {
    constructor() {
        this.config = {};
        this.initialConfig = {
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
        this.uiManager = new UIManager();
    }
    proxifyConfig() {
        return new Proxy(this.config, {
            set: (obj, prop, value) => { 
                this.init();
                // console.log("change value ", obj);
                return Reflect.set(obj, prop, value);
            }
        });
    }
    async init() {
        const { config, audioManager, canvasManager } = this;
        // console.log("init ", config);
        this.uiManager.setConfig(this.proxifyConfig());
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
                const imgPath = e2.target.result;
                const base = JSON.parse(JSON.stringify(this.initialConfig));
                this.config = Object.assign(base, {imgPath});
                this.init();
            };
        }
    }
    onDrag(e){
        e.preventDefault();
    }
}

const converter = new Converter();

