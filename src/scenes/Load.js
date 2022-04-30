class Load extends Phaser.Scene {
    constructor() {
        super('loadScene');
    }

    preload() {
        // set load path
        this.load.path = 'assets/';
        // take care of all of our asset loading now
        this.load.atlas('platformer_atlas', 'kenny_sheet.png', 'kenny_sheet.json');
        this.load.image('arrowKey', 'arrowKey.png');
        this.load.image('talltrees', 'talltrees.png');
        this.load.image('groundScroll', 'ground.png');
        this.load.atlasXML('shooter_atlas', 'shooter_sheet.png', 'shooter_sheet.xml');
        this.load.image('banana', 'bananaoutlined.png');
        this.load.image('god', 'temp_god.png');
        this.load.image('heart', 'temp_heart.png');
        this.load.image('lightning', 'temp_lightning.png');
        this.load.spritesheet('ground', 'fallingground.png', {frameWidth: 840, frameHeight: 35, startFrame:0, endFrame: 2});
        this.load.spritesheet('baby', 'pinkchild-Sheet.png', {frameWidth: 64, frameHeight: 128, startFrame:0, endFrame: 7});
    }

    create() {
        // ...and pass to the next Scene
        this.scene.start('variableJumpScene');
    }
}