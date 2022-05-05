class Menu extends Phaser.Scene {
    constructor(){
        super("menuScene");
    }

    preload() {
        //load audio
        this.load.audio('menuMusic', './assets/menuMusic.mp3');
        this.load.audio('levelMusic', './assets/levelMusic.mp3');
        this.load.audio('jump2', './assets/jump2.wav');
        this.load.audio('crush', './assets/crush.wav');
        this.load.audio('menuSelect', './assets/menuSelect.wav');
        this.load.audio('pianoFX', './assets/pianoSound.mp3');
        this.load.audio('lightningFX', './assets/lightningSound.mp3');
        this.load.audio('bananaFX', './assets/bananaSlip.wav');
        this.load.audio('deathFX', './assets/deathSound_FX.wav');
        //menu screen
        this.load.spritesheet('titleScreen1', 'assets/titleScreen.png', {frameWidth: 840, frameHeight: 525, startFrame:0, endFrame: 2});
        this.load.spritesheet('pressStart', 'assets/pressStart.png', {frameWidth: 840, frameHeight: 525, startFrame:0, endFrame: 2});
        this.load.spritesheet('tutorial', 'assets/tutorial.png', {frameWidth: 840, frameHeight: 525, startFrame:0, endFrame: 2});
        this.load.image('titleScreen2', 'assets/titleScreen2.png');
        this.load.spritesheet('baby', 'assets/pinkchild-Sheet.png', {frameWidth: 64, frameHeight: 128, startFrame:0, endFrame: 7});
    }

    create() {
        //this.game.sound.stopAll();
        //play menu soundtrack
        this.soundtrack = this.sound.add('menuMusic', {loop: true, volume: 1});
        this.soundtrack.play();


        //title screen
        this.anims.create({
            key: 'titleScreen',
            frames: this.anims.generateFrameNumbers('titleScreen1', {start: 0, end: 2, first: 0}),
            frameRate:10,
            repeat: -1
        })

        this.anims.create({
            key: 'babywalking',
            frames: this.anims.generateFrameNumbers('baby', {start: 0, end: 2, first: 0}),
            frameRate:15,
            repeat: -1
        })

        this.anims.create({
            key: 'pressStartAnim',
            frames: this.anims.generateFrameNumbers('pressStart', {start: 0, end: 2, first: 0}),
            frameRate:2,
            repeat: -1
        })

        this.titleScreen2 = this.add.sprite(0, 0, 'titleScreen2').setOrigin(0,0);
        this.babyWalking = this.add.sprite(0, game.config.height/2.25, 'baby').setOrigin(0,0).setScale(.7);
        let titleScreen = this.add.sprite(0, 0, 'titleScreen1').setOrigin(0,0);
        this.titleScreen3 = this.add.sprite(0, 0, 'pressStart').setOrigin(0,0);

        titleScreen.anims.play('titleScreen');
        this.titleScreen3.anims.play('pressStartAnim');
        this.babyWalking.anims.play('babywalking');

        cursors = this.input.keyboard.createCursorKeys();

    }

    update() {
        if(cursors.space.isDown){
            //this.sound.play('insertFXhere');
            this.scene.start('tutorial');
            this.sound.play('menuSelect'); 
        }

        this.babyWalking.x += 1;
        if(this.babyWalking.x >= game.config.width * 2)
            this.babyWalking.x = 0;
    }

}
