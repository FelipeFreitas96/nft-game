class GameObject {
    constructor() {
        this._x = 0;
        this._y = 0;
        this._width = 0;
        this._height = 0;
        this._size = 1;
        this._opacity = 1;
        this._rotation = 0;
        this._parent = null;
        this._side = 'left';
    }

    get x() { return this._x + (this._parent?.x || 0); }
    set x(value) { this._x = value; }

    get y() { return this._y + (this._parent?.y || 0); }
    set y(value) { this._y = value; }

    get width() { return this._width; }
    set width(value) { this._width = value; }

    get height() { return this._height; }
    set height(value) { this._height = value; }

    get size() { return this._size; }
    set size(value) { this._size = value; }

    get opacity() { return this._parent?._opacity || this._opacity; }
    set opacity(value) { this._opacity = value; }

    get rotation() { return this._rotation + (this._parent?.rotation || 0); }
    set rotation(value) { this._rotation = value; }

    get side() { return this._parent?._side || this._side; }
    set side(value) { this._side = value; }

    get parent() { return this._parent; }
    set parent(value) { this._parent = value; }

    get image() { return this._image; }
    set image(image) {
        this._width = image.width;
        this._height = image.height;
        this._image = image;
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
            size: this.size,
            rotation: this.rotation,
            x: this.x,
            y: this.y,
            opacity: this.opacity,
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

            this.game.animationHandler.emit('draw');
        }

        step();
    }

    render() {
        if (this.image) {
            const width = this.width / 2;
            const height = this.height / 2;

            this.game.context.save();
            this.game.context.translate(this.x + width, this.y + height);
            this.game.context.rotate(this.rotation * Math.PI / 180); 
            this.game.context.translate(-width, -height);

            if (this.side === 'right') {
                this.game.context.translate(this.width, 0);
                this.game.context.scale(-1, 1);
            }
           
            this.game.context.globalAlpha = this.opacity;
            this.game.context.drawImage(this.image, 0, 0, this.width * this.size, this.height * this.size);
            this.game.context.restore();
            
            if (this.draw) {
                this.draw();
            }
        }
    }
}