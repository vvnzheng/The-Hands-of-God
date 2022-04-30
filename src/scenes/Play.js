class VariableJump extends Phaser.Scene {
    constructor() {
        super('variableJumpScene');
    }
    
    create() {
        // variables and settings
        this.ACCELERATION = 700;
        this.MAX_X_VEL = 500;   // pixels/second
        this.MAX_Y_VEL = 5000;
        this.DRAG = 1000;    // DRAG < ACCELERATION = icy slide
        this.MAX_JUMPS = 1; // change for double/triple/etc. jumps 🤾‍♀️
        this.JUMP_VELOCITY = -600;
        currentScene = 3;
        this.physics.world.gravity.y = 2600;

        //background
        this.background = this.add.tileSprite(0,0, game.config.width, game.config.height, 'talltrees').setOrigin(0,0);

        // ground 
        this.ground = this.physics.add.sprite(0, game.config.height - tileSize, 'ground').setOrigin(0);
        this.anims.create({
            key: 'floor',
            frames:this.anims.generateFrameNumbers('ground',{start: 0, end: 2, first: 0}),
            frameRate: 8
        })
        this.ground.body.immovable = true;
        this.ground.body.allowGravity = false;

        //add god hands
        this.god01 = new God(this, game.config.width, 32, 'god');
        this.god02 = new God(this, game.config.width, 32*5, 'god');
        this.god03 = new God(this, game.config.width, 32*10, 'god');

        //add banana
        this.bananatest = this.physics.add.sprite(game.config.width, 32, 'banana');
        this.physics.add.collider(this.bananatest, this.ground);
        this.physics.add.collider(this.bananatest, this.alien);
        this.bspeed = 5;

        //add lightning
        this.lightning = this.physics.add.sprite(game.config.width, 200, 'lightning');
        this.physics.add.collider(this.lightning, this.ground, function() {
            explode = true;
        });
        this.physics.add.collider(this.lightning, this.alien);

        //add hearts
        this.heart1 = this.add.image(150, 75, 'heart');
        this.heart2 = this.add.image(150 + 75, 75, 'heart');
        this.heart3 = this.add.image(300, 75, 'heart');
        this.lives = 3;
        this.gameOver = false;

        // set up my alien son 👽
        this.alien = this.physics.add.sprite(game.config.width/2, game.config.height/2, 'baby').setScale(SCALE);
        this.alien.setCollideWorldBounds(true);
        this.alien.setMaxVelocity(this.MAX_X_VEL, this.MAX_Y_VEL);
        this.anims.create({
            key: 'walk',
            frames: this.anims.generateFrameNumbers('baby', {start: 0, end: 7, first: 0}),
            frameRate: 15
        });

        // add arrow key graphics as UI
        this.upKey = this.add.sprite(64, 32, 'arrowKey');
		this.leftKey = this.add.sprite(32, 64, 'arrowKey');
		this.downKey = this.add.sprite(64, 64, 'arrowKey');
		this.rightKey = this.add.sprite(96, 64, 'arrowKey');
		this.leftKey.rotation = Math.PI/2*3;
		this.downKey.rotation = Math.PI;
        this.rightKey.rotation = Math.PI/2;
        //this.downKey.tint = 0x333333;

        // set up Phaser-provided cursor key input
        cursors = this.input.keyboard.createCursorKeys();
        spacebar = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        rkey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);

        // add physics collider
        this.physics.add.collider(this.alien, this.ground);

        // print Level name
        //this.add.text(game.config.width/2, 30, 'Level 1: Baby', { font: '40px Futura', fill: '#000000' }).setOrigin(0.5);
    }

    update() {
        if(!this.gameOver){
            var random = Phaser.Math.Between(1, 3);
            this.bananatest.velocity = 5;
            this.bananatest.x -= this.bspeed;
            this.lightning.velocity = 200;
            this.lightning.x -= 15;
            this.ground.anims.play('floor', true);

            
            // check keyboard input
            if(cursors.left.isDown) {
                this.alien.body.setAccelerationX(-this.ACCELERATION);
                this.alien.setFlip(true, false);
                // see: https://photonstorm.github.io/phaser3-docs/Phaser.GameObjects.Components.Animation.html#play__anchor
                // play(key [, ignoreIfPlaying] [, startFrame])
                this.alien.anims.play('walk', true);
                //this.leftKey.tint = 0xFACADE;   // tint key
            } else if(cursors.right.isDown) {
                this.alien.body.setAccelerationX(this.ACCELERATION);
                this.alien.resetFlip();
                this.alien.anims.play('walk', true);
                //this.rightKey.tint = 0xFACADE;  // tint key
            } else {
                // set acceleration to 0 so DRAG will take over
                this.alien.body.setAccelerationX(0);
                this.alien.body.setDragX(this.DRAG);
                //this.alien.anims.play('walk', true);
                this.alien.body.x -= 2;
                //this.leftKey.tint = 0xFFFFFF;   // un-tint keys
                //this.rightKey.tint = 0xFFFFFF;  
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
	            //this.upKey.tint = 0xFACADE;
	        } else {
	    	    //this.upKey.tint = 0xFFFFFF;
	        }
            // finally, letting go of the UP key subtracts a jump
            // see: https://photonstorm.github.io/phaser3-docs/Phaser.Input.Keyboard.html#.UpDuration__anchor
	        if(this.jumping && Phaser.Input.Keyboard.UpDuration(cursors.up)) {
	    	    this.jumps--;
	    	    this.jumping = false;
	        }

            //var bananaToss = false;
            /*if(Phaser.Input.Keyboard.JustDown(spacebar)){
                console.log('space!');
                bananaToss = true;
                this.bananatest.x = game.config.width;
                this.bananatest.y = 32;
            }*/
            this.physics.overlap(this.bananatest, this.alien, function(){
                isBananaColliding = true;
            });
            this.physics.overlap(this.lightning, this.alien, function(){
                isLightningColliding = true;
            })
            if(isBananaColliding || this.bananatest.x <= 0 - this.bananatest.width){
                console.log(this.bananatest.x <= 0 - this.bananatest.width);
                this.bananatest.x = game.config.width;
                if(random == 1){
                    this.bananatest.y = 32;
                    this.bspeed = 10;
                } else if(random == 2){
                    this.bananatest.y = 150;
                    this.bspeed = 7;
                } else if(random == 3){
                    this.bananatest.y = 300;
                    this.bspeed = 5;
                }
                if(isBananaColliding){
                    if(this.lives == 3){
                    this.loseLives(this.heart1);
                    } else if(this.lives == 2){
                    this.loseLives(this.heart2);
                    } else if(this.lives == 1){
                        this.loseLives(this.heart3);
                        this.gameOver = true;
                        this.bananatest.x = game.config.width + 64;
                        this.lightning.x = game.config.width + 64;
                        this.jumping = false;
                        this.add.text(game.config.width/2, game.config.height/2, 'GAME OVER', { font: '90px Futura', fill: '#00008b' }).setOrigin(0.5);
                        this.add.text(game.config.width/2, game.config.height/2 + 80, 'Press R to restart', { font: '50px Futura', fill: '#00008b' }).setOrigin(0.5);
                    }
                }
                isBananaColliding = false;
                //bananaToss = false;
            }
            if(isLightningColliding || explode){
                this.lightning.x = game.config.width;
                if(random == 1){
                    this.lightning.y = 32;
                } else if(random == 2){
                    this.lightning.y = 150;
                } else if(random == 3){
                    this.lightning.y = 300;
                }
                if(isLightningColliding){
                    if(this.lives == 3){
                        this.loseLives(this.heart1);
                    } else if(this.lives == 2){
                        this.loseLives(this.heart2);
                    } else if(this.lives == 1){
                        this.loseLives(this.heart3);
                        this.gameOver = true;
                        this.bananatest.x = game.config.width + 64;
                        this.lightning.x = game.config.width + 64;
                        this.jumping = false;
                        this.add.text(game.config.width/2, game.config.height/2, 'GAME OVER', { font: '90px Futura', fill: '#00008b' }).setOrigin(0.5);
                        this.add.text(game.config.width/2, game.config.height/2 + 80, 'Press R to restart', { font: '50px Futura', fill: '#00008b' }).setOrigin(0.5);
                    }
                }
                isLightningColliding = false;
                explode = false;
            }
            if(this.alien.x <= 180 && this.alien.y == 458){
                if(this.lives == 3){
                    this.loseLives(this.heart1);
                    this.loseLives(this.heart2);
                    this.loseLives(this.heart3);
                } else if(this.lives == 2){
                    this.loseLives(this.heart2);
                    this.loseLives(this.heart3);
                } else if(this.lives == 1){
                    this.loseLives(this.heart3);
                }
                this.gameOver = true;
                this.bananatest.x = game.config.width + 64;
                this.lightning.x = game.config.width + 64;
                this.jumping = false;
                this.add.text(game.config.width/2, game.config.height/2, 'GAME OVER', { font: '90px Futura', fill: '#00008b' }).setOrigin(0.5);
                this.add.text(game.config.width/2, game.config.height/2 + 80, 'Press R to restart', { font: '50px Futura', fill: '#00008b' }).setOrigin(0.5);
            }
            //hands
                this.god01.update();
                this.god02.update();
                this.god03.update();
                //make background scroll
                this.background.tilePositionX += 1;
            
            // wrap physics object(s) .wrap(gameObject, padding)
            /*this.physics.world.wrap(this.cloud01, this.cloud01.width/2);
            this.physics.world.wrap(this.cloud02, this.cloud02.width/2);*/
        }
        if(this.gameOver && Phaser.Input.Keyboard.JustDown(rkey)) {
            console.log("restart");
            this.scene.restart();
        }
    }
    loseLives(heart){
            heart.destroy();
            this.lives -= 1;
    }
}
