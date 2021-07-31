class Character extends Creature {
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
}
