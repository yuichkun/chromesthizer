function toRGB(pixels) {
    let rgbPixels = [];
    for (let i = 0; i < pixels.length; i += 4) {
        const pixel = pixels.subarray(i, i + 3);
        rgbPixels.push(pixel);
    }
    return rgbPixels;
}

function toHSL(pixel) {
    let [r, g, b] = pixel; 

    r /= 255, g /= 255, b /= 255;

    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;
  
    if (max == min) {
      h = s = 0; // achromatic
    } else {
      let d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
  
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
      }
  
      h /= 6;
    }
  
    return [ h, s, l ];
  }