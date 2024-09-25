export class Filter {
    constructor(ctx){
        this.ctx = ctx
    }

    /** obtener datos del canvas */
    getImageData(){
        let imageData = this.ctx.getImageData(0, 0, this.ctx.canvas.width, this.ctx.canvas.height)
        let height = imageData.height
        let width = imageData.width
        let data = imageData.data
        return {imageData, height, width, data}
    }

    /** aplicar los cambios en el canvas */
    putChanges(imageData){
        this.ctx.putImageData(imageData, 0, 0)
    }

    greyScale(){
        let {imageData, height, width, data} = this.getImageData()
        
        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                
                let index = (x + (y * width)) * 4
                let red = data[index]
                let green = data[index + 1]
                let blue = data[index + 2]

                let promedio = (red + green + blue) / 3

                data[index] = promedio
                data[index + 1] = promedio
                data[index + 2] = promedio
                
            }
        }
        this.putChanges(imageData)
    }

    blur(){
        let {imageData, height, width, data} = this.getImageData()

        let kernel = []
        let kernelSize = 5

        for (let i = 0; i < kernelSize; i++) {
            kernel[i] = []
            for (let j = 0; j < kernelSize; j++) {
                kernel[i][j] = 1
            }
        }

        for (let y = 1; y < height-1; y++) {
            for (let x = 1; x < width-1; x++) {

                let sumRed = 0
                let sumGreen = 0
                let sumBlue = 0
                let cont = 0

                for (let i = 0; i < kernelSize; i++) {
                    for (let j = 0; j < kernelSize; j++) {
                        let offsetX = x + i - Math.floor(kernelSize/2)
                        let offsetY = y + j - Math.floor(kernelSize/2)

                        if (offsetX >=0 && offsetX < width && offsetY >=0 && offsetY < height){
                            
                            cont++
                            let index = (offsetX + (offsetY * width)) * 4
                            let kernelValue = kernel[i][j]
                            
                            sumRed += data[index] * kernelValue
                            sumGreen += data[index+1] * kernelValue
                            sumBlue += data[index+2] * kernelValue
                        }
                    }
                    
                }
                
                let newIndex = (x + (y * width)) * 4

                data[newIndex] = sumRed/cont
                data[newIndex+1] = sumGreen/cont
                data[newIndex+2] = sumBlue/cont
            }
        }

        this.putChanges(imageData)
    }

    negative(){
        let {imageData, height, width, data} = this.getImageData()

        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                
                let index = (x + (y * width)) * 4
                let red = data[index]
                let green = data[index + 1]
                let blue = data[index + 2]

                data[index] = 255 - red
                data[index + 1] = 255 - green
                data[index + 2] = 255 - blue
                
            }
        }

        this.putChanges(imageData)
    }

    binarize(){
        let {imageData, data, height, width} = this.getImageData() 

        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                
                let index = (x + (y * width)) * 4
                let red = data[index]
                let green = data[index + 1]
                let blue = data[index + 2]

                let promedio = (red + green + blue) / 3

                if(promedio<128){
                    data[index] = 0
                    data[index + 1] = 0
                    data[index + 2] = 0
                } else {
                    data[index] = 255
                    data[index + 1] = 255
                    data[index + 2] = 255
                }
                
            }
        }
        this.putChanges(imageData)
    }

    sepia(){
        let {imageData, data, width, height} = this.getImageData()

        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                
                let index = (x + (y * width)) * 4
                let red = data[index]
                let green = data[index + 1]
                let blue = data[index + 2]

                data[index] = 0.393 * red + 0.769 * green + 0.189 * blue
                data[index + 1] = 0.349 * red + 0.686 * green + 0.168 * blue
                data[index + 2] = 0.272 * red + 0.534 * green + 0.131 * blue        
            }
        }
        this.putChanges(imageData)
    }

    bright(){
        let {imageData, data, width, height} = this.getImageData()

        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                let index = (x + (y * width)) * 4
                let red = data[index]
                let green = data[index + 1]
                let blue = data[index + 2]

                data[index] = red + red/2
                data[index + 1] = green + green/2
                data[index + 2] = blue + blue/2
            }
        }
        this.putChanges(imageData)
    }

    edgeDetection() {
        let {height, width, data} = this.getImageData()
        let pixels = data
    
        // Crear una copia del array de píxeles
        const output = new Uint8ClampedArray(pixels.length);
    
        // Kernel de Sobel para detección de bordes en X y Y
        const kernelX = [
            [-1, 0, 1],
            [-2, 0, 2],
            [-1, 0, 1]
        ];
    
        const kernelY = [
            [-1, -2, -1],
            [0,  0,  0],
            [1,  2,  1]
        ];
    
        function getPixel(x, y, channel) {
            const index = (y * width + x) * 4 + channel;
            return pixels[index];
        }
    
        function setPixel(x, y, r, g, b, a = 255) {
            const index = (y * width + x) * 4;
            output[index] = r;
            output[index + 1] = g;
            output[index + 2] = b;
            output[index + 3] = a;
        }
    
        // Aplicar convolución
        for (let y = 1; y < height - 1; y++) {
            for (let x = 1; x < width - 1; x++) {
                let sumX_r = 0, sumX_g = 0, sumX_b = 0;
                let sumY_r = 0, sumY_g = 0, sumY_b = 0;
    
                // Aplicar el kernel sobre los píxeles vecinos
                for (let ky = -1; ky <= 1; ky++) {
                    for (let kx = -1; kx <= 1; kx++) {
                        const r = getPixel(x + kx, y + ky, 0);
                        const g = getPixel(x + kx, y + ky, 1);
                        const b = getPixel(x + kx, y + ky, 2);
    
                        const kernelValX = kernelX[ky + 1][kx + 1];
                        const kernelValY = kernelY[ky + 1][kx + 1];
    
                        sumX_r += r * kernelValX;
                        sumX_g += g * kernelValX;
                        sumX_b += b * kernelValX;
    
                        sumY_r += r * kernelValY;
                        sumY_g += g * kernelValY;
                        sumY_b += b * kernelValY;
                    }
                }
    
                // Calcular la magnitud de los gradientes
                const magnitude_r = Math.sqrt(sumX_r ** 2 + sumY_r ** 2);
                const magnitude_g = Math.sqrt(sumX_g ** 2 + sumY_g ** 2);
                const magnitude_b = Math.sqrt(sumX_b ** 2 + sumY_b ** 2);
    
                // Asignar el valor al píxel de salida
                const magnitude = Math.max(magnitude_r, magnitude_g, magnitude_b);
                setPixel(x, y, magnitude, magnitude, magnitude);
            }
        }
    
        // Crear una nueva ImageData a partir del array de salida
        const filteredData = new ImageData(output, width, height);
    
        // Aplicar los cambios en el canvas
        this.putChanges(filteredData)
    }

    saturation() {
        const {imageData, data} = this.getImageData()
        const pixels = data
        const factor = 4
    
        for (let i = 0; i < pixels.length; i += 4) {
            let r = pixels[i]
            let g = pixels[i + 1]
            let b = pixels[i + 2]
    
            // Convertir RGB a HSL
            let [h, s, l] = this.rgbToHsl(r, g, b)
    
            // Ajustar la saturación
            s *= factor
            if (s > 1) {
                s = 1
            }
            if (s < 0) {
                s = 0
            }
    
            // Convertir de vuelta a RGB
            [r, g, b] = this.hslToRgb(h, s, l)
    
            // Asignar los nuevos valores al píxel
            pixels[i] = r
            pixels[i + 1] = g
            pixels[i + 2] = b
        }
    
        this.putChanges(imageData);
    }
    
    /** convertir de RGB a HSL para la saturacion */
    rgbToHsl(r, g, b) {
        r /= 255
        g /= 255
        b /= 255
        
        const max = Math.max(r, g, b)
        const min = Math.min(r, g, b)
        let h, s, l = (max + min) / 2
    
        if (max === min) {
            h = s = 0
        } else {
            const d = max - min
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
    
            switch (max) {
                case r: h = (g - b) / d + (g < b ? 6 : 0)
                    break
                case g: h = (b - r) / d + 2
                    break
                case b: h = (r - g) / d + 4
                    break
            }
    
            h /= 6
        }
    
        return [h, s, l]
    }
    
    /** convertir de HSL a RGB para la saturacion */
    hslToRgb(h, s, l) {
        let r, g, b
    
        if (s === 0) {
            r = g = b = l
        } else {
            const hue2rgb = (p, q, t) => {
                if (t < 0) {
                    t += 1
                }
                if (t > 1) {
                    t -= 1
                }
                if (t < 1 / 6) {
                    return p + (q - p) * 6 * t
                }
                if (t < 1 / 3) {
                    return q
                }
                if (t < 1 / 2) {
                    return p + (q - p) * (2 / 3 - t) * 6
                }
                return p
            }
    
            const q = l < 0.5 ? l * (1 + s) : l + s - l * s
            const p = 2 * l - q
    
            r = hue2rgb(p, q, h + 1 / 3)
            g = hue2rgb(p, q, h)
            b = hue2rgb(p, q, h - 1 / 3)
        }
    
        return [r * 255, g * 255, b * 255]
    }

}
