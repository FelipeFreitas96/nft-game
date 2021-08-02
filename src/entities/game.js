class Game {
    constructor(canvas, cache, animationHandler = null, FPS = 60) {
        this.cache = cache;
        this.canvas = canvas;
        this.context = canvas.getContext('2d');
        this.objects = [];
        this.animationHandler = animationHandler;
        this.animationHandler.on('draw', this.loopEvent.bind(this));
    
        // When mouse hover over the canvas
        this.canvas.addEventListener('mousemove', (evt) => {
            const mouseX = evt.clientX;
            const mouseY = evt.clientY;
            for (const object of this.objects) {
                if (object.x < mouseX &&
                    object.x + object.width > mouseX &&
                    object.y < mouseY &&
                    object.y + object.height > mouseY) {
                    if (object.hover && !object.hovered) {
                        object.hovered = true;
                        object.hover(object.hovered);
                    }
                } else {
                    if (object.hover && object.hovered) {
                        object.hovered = false;
                        object.hover(object.hovered);
                    }
                }
            }
        });
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
    createCard() {
        const card = new Card();
        card.game = this;
        
        this.objects.push(card);
        return card;
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
            obj.render();
        }
    }
}