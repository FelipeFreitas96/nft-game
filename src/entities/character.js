class Object {
    constructor() {
        this.x = 0;
        this.y = 0;
        this.side = 'left';
        this.parent = null;
    }
    draw() {
        if (this.image) {
            if (this.parent) {
                this.game.context.drawImage(this.image, this.parent.x + this.x, this.parent.y + this.y, this.image.width, this.image.height);
            } else {
                this.game.context.drawImage(this.image, this.x, this.y, this.image.width, this.image.height);
            }
        }
    }
}

class Cache {
    constructor() {
        this.cache = {};
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

class Game {
    constructor(canvas, cache) {
        this.cache = cache;
        this.canvas = canvas;
        this.context = canvas.getContext('2d');
        this.objects = [];
        setInterval(() => this.loopEvent(), 1000);
    }
    async createImageFromCache(path, colors) {
        return await this.cache.add(path, colors);
    }
    createObject() {
        const object = new Object();
        object.game = this;

        this.objects.push(object);
        return object;
    }
    createCharacter() {
        const character = new Character();
        character.game = this;

        this.objects.push(character);
        return character;
    }
    loopEvent() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        for (let obj of this.objects) {
            obj.draw();
        }
    }
}

class Character extends Object {
    constructor() {
        super();
        this.parts = {};
    }
    async setParts(parts) {
        if (parts.body) {
            this.parts.body = this.game.createObject();
            this.parts.body.image = await this.game.createImageFromCache(parts.body.src, parts.body.color);
            this.parts.body.parent = this;
        } if (parts.eyes) {
            this.parts.eyes = this.game.createObject();
            this.parts.eyes.image = await this.game.createImageFromCache(parts.eyes.src, parts.eyes.color);
            this.parts.eyes.parent = this;
        } if (parts.weapon) {
            this.parts.weapon = this.game.createObject();
            this.parts.weapon.image = await this.game.createImageFromCache(parts.weapon.src, parts.weapon.color);
            this.parts.weapon.parent = this;
        } if (parts.mouth) {
            this.parts.mouth = this.game.createObject();
            this.parts.mouth.image = await this.game.createImageFromCache(parts.mouth.src, parts.mouth.color);
            this.parts.mouth.parent = this;
        } if (parts.hat) {
            this.parts.hat = this.game.createObject();
            this.parts.hat.image = await this.game.createImageFromCache(parts.hat.src, parts.hat.color);
            this.parts.hat.parent = this;
        }
    }
}
