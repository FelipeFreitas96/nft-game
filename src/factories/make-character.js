const make_character = async (game) => {
    const character = game.createCharacter();
    const parts = {
        body: {
            src: 'https://i.imgur.com/LNQjoM9.png',
            color: { r: 250, g: 0, b: 0},
        },
        eyes: {
            src: 'https://i.imgur.com/PzXmp0J.png',
            color: { r: 0, g: 250, b: 0},
        },
        weapon: {
            src: 'https://i.imgur.com/B5C1bAx.png',
            color: { r: 100, g: 0, b: 100},
        },
        mouth: {
            src: 'https://i.imgur.com/8OfScDO.png',
            color: { r: 0, g: 100, b: 0},
        },
        hat: {
            src: 'https://i.imgur.com/uZrYVhI.png',
            color: { r: 100, g: 100, b: 0},
        },
    }
    await character.set_parts(parts);
    return character;
}