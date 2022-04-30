class Menu extends Phaser.Scene {
    constructor(){
        super("menuScene");
    }

    preload() {
        //load audio
        this.load.audio('menuMusic', './assets/menuMusic.mp3');
    }

    create() {
        let menuConfig = {
            fontFamily: 'Verdana',
            fontSize: '60px',
            fontStyle: 'bold',
            backgroundColor: '#000000',
            color: '#FFFFFF',
            align: 'right',
            padding: {
                top:5,
                bottom: 5,
            },
            fixedWidth: 0
        }

        this.game.sound.stopAll();
        //play menu soundtrack
        //this.soundtrack = this.sound.play('menuMusic', {loop: true, volume: 0.4});

        //show menu text
        this.add.text(game.config.width/2, game.config.height/2.7, 'ONLY GOD JUDGES', menuConfig).setOrigin(0.5);
        menuConfig.fontSize = '18px';
        this.add.text(game.config.width/2, game.config.height/2.5, 'Use ← → arrows to move &  ↑ to jump', menuConfig).setOrigin(0.5,-1.5);
        this.add.text(game.config.width/2, game.config.height/2, 'Dodge the obstacles and do not fall into hell', menuConfig).setOrigin(0.5,-1.5);
        menuConfig.fontStyle = 'bold';
        menuConfig.backgroundColor = '#fbf236';
        menuConfig.fontSize = '22px';
        menuConfig.color = '#000000';
        this.add.text(game.config.width/2, game.config.height/1.5, '[SPACE] to start', menuConfig).setOrigin(0.5,-1.5);

        cursors = this.input.keyboard.createCursorKeys();
    }

    update() {
        if(cursors.space.isDown){
            //this.sound.play('insertFXhere');
            this.scene.start('loadScene');
        }
    }
}
