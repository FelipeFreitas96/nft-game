class Creature extends GameObject {
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