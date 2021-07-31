const makeEnemy = async (game) => {
    const character = game.createCharacter();
    const parts = {
        body: {
            src: 'https://i.imgur.com/LNQjoM9.png',
            color: { r: 21, g: 43, b: 125},
        },
        eyes: {
            src: 'https://i.imgur.com/PzXmp0J.png',
            color: { r: 75, g: 35, b: 142},
        },
        weapon: {
            src: 'https://i.imgur.com/B5C1bAx.png',
            color: { r: 247, g: 123, b: 132},
        },
        mouth: {
            src: 'https://i.imgur.com/8OfScDO.png',
            color: { r: 255, g: 147, b: 4},
        },
        hat: {
            src: 'https://i.imgur.com/uZrYVhI.png',
            color: { r: 64, g: 54, b: 458},
        },
    }
    await character.setParts(parts);
    return character;
}