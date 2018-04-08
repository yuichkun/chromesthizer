function toRGB(pixels, width, height) {
  let ret = [];
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const b = y * (width * 4);
      const isEvenRow = y % 2 === 0;
      const _x = isEvenRow ? x : (width - x) - 1;
      const pos = 4 * _x + b;
      for (let i = 0; i < 4; i++) {
        const isAlpha = i % 4 === 3;
        if (!isAlpha) {
          const index = pos + i;
          ret.push(pixels[index]);
        }
      }
    }
  }
  return ret;
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