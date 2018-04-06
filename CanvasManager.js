class CanvasManager {
    constructor() {
        this.canvas = document.getElementById('canvas');
        this.context = canvas.getContext('2d');

        this.baseImage = null;
        this.config = {};
    }
    updateConfig(config) {
        this.config = config;
    }
    render() { 
        const { context, canvas, baseImage } = this;
        const filter = this.composeFilter();
        console.log(filter);
        context.filter = filter;
        context.drawImage(baseImage, 0, 0, canvas.width, canvas.height);
        const rawPixels = context.getImageData(0, 0, canvas.width, canvas.height).data;
        const pixels = toRGB(rawPixels).map(toHSL);

        return pixels;
    }

    composeFilter() { 
        const { config } = this;
        const { blur, brightness, contrast, hue, saturation } = config;
        const blurFilter = `blur(${blur}px)`;
        const brightnessFilter = `brightness(${brightness}%)`;
        const contrastFilter = `contrast(${contrast}%)`;
        const hueFilter = `hue-rotate(${hue}deg)`;
        const saturationFilter = `saturate(${saturation}%)`;
        return `${blurFilter} ${brightnessFilter} ${contrastFilter} ${hueFilter} ${saturationFilter}`;
    }

    extractPixels() {
        const { config, canvas, context } = this;
        return new Promise((resolve, reject) => {
            const baseImage = new Image();
            this.baseImage = baseImage;
            baseImage.src = config.imgPath;
            baseImage.onload =  () => {
                this.resizeCanvas();
                const pixels = this.render();
                console.log("Pixels", pixels);
                resolve(pixels);
            };
            baseImage.onerror = reject;
        });
    }
    resizeCanvas() {
        const { canvas, baseImage } = this;
        canvas.height = baseImage.height * (canvas.width / baseImage.width);
    }
}
