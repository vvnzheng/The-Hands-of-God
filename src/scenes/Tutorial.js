class Tutorial extends Phaser.Scene {
    constructor(){
        super("tutorial");
    }

    create() {
        tkey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.T);

        //title screen
        this.anims.create({
            key: 'tutorialScreen',
            frames: this.anims.generateFrameNumbers('tutorial', {start: 0, end: 2, first: 0}),
            frameRate:10,
            repeat: -1
        })

        this.tutorialScreen = this.add.sprite(0, 0, 'tutorial').setOrigin(0,0);

        this.tutorialScreen.anims.play('tutorialScreen');

        cursors = this.input.keyboard.createCursorKeys();
    }

    update() {
        if(cursors.space.isDown){
            this.sound.play('menuSelect'); 
            this.scene.start('loadScene');
        }
    }

}
