class GameObject {
    constructor() {
        this.x = 0;
        this.y = 0;
        this.rotation = 0;
        this.parent = null;
    }
    
    animateCompose(animations) {
        animations.forEach(animation => {
            setTimeout(() => {
                this.animate(animation.animation, animation.duration);
            }, animation.delay);
        });
    }

    animate(params, duration) {       
        let startTime;
        let startParam = {
            rotation: this.rotation,
            x: this.x,
            y: this.y,
        }

        const step = () => {
            if (!startTime) {
                startTime = Date.now();
            }

            const elapsed = Date.now() - startTime;
            const percent = elapsed / duration;

            if (percent < 1.0) {
                requestAnimationFrame(step);
            }

            Object.keys(params).forEach((key) => {
                this[key] = startParam[key] + (params[key] - startParam[key]) * Math.min(percent, 1);
            });
        }

        step();
    }

    draw() {
        if (this.image) {
            const parentX = this.parent?.x || 0;
            const parentY = this.parent?.y || 0;
            const imageWidth = this.image.width / 2;
            const imageHeight = this.image.height / 2;
            const x = this.x + parentX;
            const y = this.y + parentY;
            const rotation = this.parent?.rotation || this.rotation;

            this.game.context.save();
            this.game.context.translate(x + imageWidth, y + imageHeight);
            this.game.context.rotate(rotation * Math.PI / 180);
            this.game.context.translate(-imageWidth, -imageHeight);
            this.game.context.drawImage(this.image, 0, 0);
            this.game.context.restore();
        }
    }
}

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

class Game {
    constructor(canvas, cache, FPS = 60) {
        this.cache = cache;
        this.canvas = canvas;
        this.context = canvas.getContext('2d');
        this.objects = [];
        setInterval(() => this.loopEvent(), 1000 / FPS);
    }
    async createImageFromCache(path, colors) {
        return await this.cache.add(path, colors);
    }
    createObject() {
        const gameObject = new GameObject();
        gameObject.game = this;

        this.objects.push(gameObject);
        return gameObject;
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

class Character extends GameObject {
    constructor() {
        super();
        this.parts = {};
    }
    async attack() {
        const animations = [{
            animation: { rotation: 45, x: 500 },
            duration: 250,
            delay: 0,
        }, {
            animation: { rotation: 0, x: 0 },
            duration: 250,
            delay: 250,
        }];
        this.animateCompose(animations);
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
