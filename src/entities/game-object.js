class GameObject {
    constructor() {
        this.x = 0;
        this.y = 0;
        this.rotation = 0;
        this.parent = null;
        this.side = 'left';
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
            const side = this.parent?.side || this.side;
            this.game.context.save();
            this.game.context.translate(x + imageWidth, y + imageHeight);
            this.game.context.rotate(rotation * Math.PI / 180);
            this.game.context.translate(-imageWidth, -imageHeight);
            
            if (side === 'right') {
                this.game.context.translate(imageWidth * 2, 0);
                this.game.context.scale(-1, 1);
            }

            this.game.context.drawImage(this.image, 0, 0);
            this.game.context.restore();
        }
    }
}