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