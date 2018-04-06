class UIManager {
    constructor(config) {
        this.config = config;
        this.sliders = ["blur", "sampleRate", "brightness", "contrast", "saturation", "hue"];
        this.sliders.forEach(this.createSlider.bind(this));

        this.jiggling = null;
    }

    createSlider(name) {
        const slider = document.getElementById(name);
        const { config } = this;
        slider.oninput = (e) => { 
            this.setValue(name, e.target.value);
        };
    }

    setRandomValue(name) { 
        const slider = document.getElementById(name);
        const { max, min } = slider;
        const val = (Math.random() * (max - min)) + min;
        slider.value = val;
        this.setValue(name, val);
    }

    setValue(name, value) { 
        const { config } = this;
        config[name] = value;
    }
    randomize() { 
        this.sliders.forEach(this.setRandomValue.bind(this));
    }

    jiggle(time) { 
        this.jiggling = setInterval(this.randomize.bind(this), time);
    }

}