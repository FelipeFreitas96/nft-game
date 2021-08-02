class Creature extends GameObject {
    constructor() {
        super();
        this.parts = {};
    }
    async basic_attack_hitted() {
        const animations = [{
            animation: { y: this.y-40, opacity: this.opacity / 2 },
            duration: 100,
            delay: 225,
            opacity: 0.5,
        }, {
            animation: { y: this.y, opacity: this.opacity },
            duration: 100,
            delay: 375,
        }];
        this.animateCompose(animations);
    }
    async basic_attack({ toPos }) {
        const animations = [{
            animation: { rotation: 45, x: toPos },
            duration: 250,
            delay: 0,
        }, {
            animation: { rotation: 0, x: this.x },
            duration: 250,
            delay: 250,
        }];
        this.animateCompose(animations);
    }
    async set_parts(parts) {
        for (const partName of Object.keys(parts)) {
            this.parts[partName] = this.game.createObject();
            this.parts[partName].image = await this.game.createImageFromCache(parts[partName].src, parts[partName].color);
            this.parts[partName].width = this.parts[partName].image.width;
            this.parts[partName].height = this.parts[partName].image.height;

            if (partName === 'body') {
                this.width = this.parts[partName].width;
                this.height = this.parts[partName].height;
            }
            
            this.parts[partName].parent = this;
        }
    }
}