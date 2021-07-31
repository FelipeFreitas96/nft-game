class Cache {
    constructor(images) {
        this.cache = {};
        this.cacheImages(images);
    }

    async cacheImages(images) {
        for (const key in images) {
            for (const url of images[key]) {
                await this.add(url);
            }
        }
    }

    async createImage(path, callback) {
        return new Promise((resolve) => {
            const image = new Image();
            image.src = path;
            image.crossOrigin = 'Anonymous';
            image.onload = async () => {
                const response = await callback(image);
                resolve(response);
            }
        });        
    }
        
    async paintImage(img, colors) {
        return new Promise((resolve) => {
            const responseImage = new Image();
            const tempCanvas = document.createElement('canvas');
            const tempCtx = tempCanvas.getContext('2d');
            const w = img.width, h = img.height;
            tempCanvas.width = w;
            tempCanvas.height = h;
            tempCtx.drawImage(img, 0, 0, w, h);

            const imageData = tempCtx.getImageData(0, 0, w, h);
            const pixel = imageData.data;
            
            for (let i = 0; i < imageData.data.length; i += 4) {
                const r=i+0, g=i+1, b=i+2, a=i+3;
                if (pixel[r] === 255 && pixel[g] === 255 && pixel[b] === 255) {
                    imageData.data[r] = colors.r;
                    imageData.data[g] = colors.g;
                    imageData.data[b] = colors.b;
                }
            }

            tempCtx.putImageData(imageData, 0, 0);
            responseImage.src = tempCanvas.toDataURL();
            responseImage.onload = () => {
                resolve(responseImage);
            }
        });
    }

    async add(path, colors = { r: 0, g: 0, b: 0 }) {
        if (!this.cache[path]) {
            this.cache[path] = await this.createImage(path, async (image) => image);
        }

        const pathPromise = this.cache[path];
        const tempCanvas = document.createElement('canvas');
        const tempCtx = tempCanvas.getContext('2d');
        const w = pathPromise.width, h = pathPromise.height;
        tempCanvas.width = w;
        tempCanvas.height = h;
        tempCtx.drawImage(pathPromise, 0, 0, w, h);

        const imageData = tempCtx.getImageData(0, 0, w, h);
        const pixel = imageData.data;
        for (let i = 0; i < imageData.data.length; i += 4) {
            const r=i+0, g=i+1, b=i+2;
            if (pixel[r] === 255 && pixel[g] === 255 && pixel[b] === 255) {
                imageData.data[r] = colors.r;
                imageData.data[g] = colors.g;
                imageData.data[b] = colors.b;
            }
        }

        tempCtx.putImageData(imageData, 0, 0);
        return await this.createImage(tempCanvas.toDataURL(), (image2) => image2);
    }
}