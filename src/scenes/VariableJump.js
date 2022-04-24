class VariableJump extends Phaser.Scene {
    constructor() {
        super('variableJumpScene');
    }
    create() {
        // variables and settings
        this.ACCELERATION = 1500;
        this.MAX_X_VEL = 500;   // pixels/second
        this.MAX_Y_VEL = 5000;
        this.DRAG = 600;    // DRAG < ACCELERATION = icy slide
        this.MAX_JUMPS = 2; // change for double/triple/etc. jumps 🤾‍♀️
        this.JUMP_VELOCITY = -700;
        currentScene = 3;
        this.physics.world.gravity.y = 2600;

        // set bg color
        this.cameras.main.setBackgroundColor('#223344');

        // draw grid lines for jump height reference
        let graphics = this.add.graphics();
        graphics.lineStyle(2, 0xFFFFFF, 0.1);
	    for(let y = game.config.height-70; y >= 35; y -= 35) {
            graphics.lineBetween(0, y, game.config.width, y);
        }

        // print Scene name
        this.add.text(game.config.width/2, 30, 'Level 1: Baby', { font: '20px Futura', fill: '#FFFFFF' }).setOrigin(0.5);
        
        // add some physics clouds
        /*this.cloud01 = this.physics.add.sprite(600, 100, 'platformer_atlas', 'cloud_1');
        this.cloud01.body.setAllowGravity(false).setVelocityX(25);
        this.cloud02 = this.physics.add.sprite(200, 200, 'platformer_atlas', 'cloud_2');
        this.cloud02.body.setAllowGravity(false).setVelocityX(45);*/

        // make ground tiles group
        this.ground = this.add.group();
        for(let i = 0; i < game.config.width; i += tileSize) {
            let groundTile = this.physics.add.sprite(i, game.config.height - tileSize, 'platformer_atlas', 'block').setScale(SCALE).setOrigin(0);
            groundTile.body.immovable = true;
            groundTile.body.allowGravity = false;
            this.ground.add(groundTile);
        }
        for(let i = tileSize*2; i < game.config.width-tileSize*13; i += tileSize) {
            let groundTile = this.physics.add.sprite(i, game.config.height - tileSize*9, 'platformer_atlas', 'block').setScale(SCALE).setOrigin(0);
            groundTile.body.immovable = true;
            groundTile.body.allowGravity = false;
            this.ground.add(groundTile);
        }

        //add god hands
        this.god01 = new God(this, game.config.width, 32, 'god');
        this.god02 = new God(this, game.config.width, 32*5, 'god');
        this.god03 = new God(this, game.config.width, 32*10, 'god');

        //add banana
        this.banana = new Banana(this, game.config.width, 32, 'banana');
        this.bananatest = this.physics.add.sprite(game.config.width, 32, 'banana');
        this.physics.add.collider(this.bananatest, this.ground);
        this.physics.add.collider(this.bananatest, this.alien);
        //makes sure banana and ground collide and not go through each other
        this.physics.add.collider(this.banana, this.ground);

        //add hearts
        this.heart1 = this.add.image(150, 75, 'heart');
        this.heart2 = this.add.image(150 + 75, 75, 'heart');
        this.heart3 = this.add.image(300, 75, 'heart');
        this.lives = 3;
        this.gameOver = false;

        // set up my alien son 👽
        this.alien = this.physics.add.sprite(game.config.width/2, game.config.height/2, 'platformer_atlas', 'front').setScale(SCALE);
        this.alien.setCollideWorldBounds(true);
        this.alien.setMaxVelocity(this.MAX_X_VEL, this.MAX_Y_VEL);

        //add collider between banana and player
        this.physics.add.collider(this.banana, this.alien);
        // add arrow key graphics as UI
        this.upKey = this.add.sprite(64, 32, 'arrowKey');
		this.leftKey = this.add.sprite(32, 64, 'arrowKey');
		this.downKey = this.add.sprite(64, 64, 'arrowKey');
		this.rightKey = this.add.sprite(96, 64, 'arrowKey');
		this.leftKey.rotation = Math.PI/2*3;
		this.downKey.rotation = Math.PI;
        this.rightKey.rotation = Math.PI/2;
        this.downKey.tint = 0x333333;

        // set up Phaser-provided cursor key input
        cursors = this.input.keyboard.createCursorKeys();
        spacebar = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

        // add physics collider
        this.physics.add.collider(this.alien, this.ground);

        // set up Scene switcher
        /*this.input.keyboard.on('keydown', (event) => {
            //console.log(event);
            switch(event.key) {
                case '1':
                    this.scene.start('velocityScene');
                    break;
                case '2':
                    this.scene.start('accelerationScene');
                    break;
                case '3':
                    this.scene.start('fixedJumpScene');
                    break;
                case '4':
                    this.scene.start('variableJumpScene');
                    break;
                case '5':
                    this.scene.start('runnerScene');
                    break;
                case '6':
                    this.scene.start('pogoScene');
                    break;
                case '7':
                    this.scene.start('asteroidsScene');
                    break;
                default:
                    break;
            }
        });*/
    }

    update() {
        // check keyboard input
        if(cursors.left.isDown) {
            this.alien.body.setAccelerationX(-this.ACCELERATION);
            this.alien.setFlip(true, false);
            // see: https://photonstorm.github.io/phaser3-docs/Phaser.GameObjects.Components.Animation.html#play__anchor
            // play(key [, ignoreIfPlaying] [, startFrame])
            //this.alien.anims.play('walk', true);
            this.leftKey.tint = 0xFACADE;   // tint key
        } else if(cursors.right.isDown) {
            this.alien.body.setAccelerationX(this.ACCELERATION);
            this.alien.resetFlip();
            //this.alien.anims.play('walk', true);
            this.rightKey.tint = 0xFACADE;  // tint key
        } else {
            // set acceleration to 0 so DRAG will take over
            this.alien.body.setAccelerationX(0);
            this.alien.body.setDragX(this.DRAG);
            //this.alien.anims.play('idle');
            this.leftKey.tint = 0xFFFFFF;   // un-tint keys
            this.rightKey.tint = 0xFFFFFF;  
        }

		// check if alien is grounded
	    this.alien.isGrounded = this.alien.body.touching.down;
	    // if so, we have jumps to spare 
	    if(this.alien.isGrounded) {
	    	this.jumps = this.MAX_JUMPS;
	    	this.jumping = false;
	    } else {
	    	//this.alien.anims.play('jump');
	    }
        // allow steady velocity change up to a certain key down duration
        // see: https://photonstorm.github.io/phaser3-docs/Phaser.Input.Keyboard.html#.DownDuration__anchor
	    if(this.jumps > 0 && Phaser.Input.Keyboard.DownDuration(cursors.up, 150)) {
	        this.alien.body.velocity.y = this.JUMP_VELOCITY;
	        this.jumping = true;
	        this.upKey.tint = 0xFACADE;
	    } else {
	    	this.upKey.tint = 0xFFFFFF;
	    }
        // finally, letting go of the UP key subtracts a jump
        // see: https://photonstorm.github.io/phaser3-docs/Phaser.Input.Keyboard.html#.UpDuration__anchor
	    if(this.jumping && Phaser.Input.Keyboard.UpDuration(cursors.up)) {
	    	this.jumps--;
	    	this.jumping = false;
	    }
        
        //banana trajectory
        /*this.physics.overlap(this.banana, this.alien, function(){
            isBananaColliding = true;
        });
        this.banana.update();*/

        //tester
        //new banana temp

        //console.log(this.bananatest.x);
        var bananaToss = false;
        if(Phaser.Input.Keyboard.JustDown(spacebar)){
            console.log('space!');
            bananaToss = true;
            //while(this.bananatest.x > 0-this.bananatest.width || !isBananaColliding){
                this.bananatest.x = game.config.width;
                this.bananatest.y = 32;
            //}
        }
        this.physics.overlap(this.bananatest, this.alien, function(){
            isBananaColliding = true;
        });
        if(isBananaColliding || this.bananatest.x <= 0 - this.bananatest.width){
            this.bananatest.x = game.config.width;
            this.bananatest.y = 32;
            if(isBananaColliding){
                if(this.lives == 3){
                    this.loseLives(this.heart1);
                } else if(this.lives == 2){
                    this.loseLives(this.heart2);
                } else if(this.lives == 1){
                    this.loseLives(this.heart3);
                    
                }
            }
            //this.bananatest.destroy;
            isBananaColliding = false;
            bananaToss = false;
        } else {
            this.bananatest.x -= 10;
        }

        console.log(this.bananatest.x);

        //hands
        this.god01.update();
        this.god02.update();
        this.god03.update();

        // wrap physics object(s) .wrap(gameObject, padding)
        /*this.physics.world.wrap(this.cloud01, this.cloud01.width/2);
        this.physics.world.wrap(this.cloud02, this.cloud02.width/2);*/
    }
    loseLives(heart){
        console.log('Uhoh');
            heart.destroy();
            this.lives -= 1;
    }
}