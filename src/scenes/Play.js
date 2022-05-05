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
        this.background1_4 = this.add.tileSprite(0,0, game.config.width, game.config.height, 'background1_4').setOrigin(0,0);
        this.background1_3 = this.add.tileSprite(0,0, game.config.width, game.config.height, 'background1_3').setOrigin(0,0);
        this.background1_2 = this.add.tileSprite(0,0, game.config.width, game.config.height, 'background1_2').setOrigin(0,0);
        this.background = this.add.tileSprite(0,0, game.config.width, game.config.height, 'background1_1').setOrigin(0,0);

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
        this.bananatest = this.physics.add.sprite(game.config.width + 50, 32, 'banana');
        this.physics.add.collider(this.bananatest, this.ground);
        this.physics.add.collider(this.bananatest, this.baby);
        this.bspeed = 5;

        //add lightning
        this.lightning = this.physics.add.sprite(game.config.width + 50, 32, 'lightning');
        this.physics.add.collider(this.lightning, this.ground, function() {
            explode = true;
        });
        this.physics.add.collider(this.lightning, this.baby);

        //add piano
        this.piano = this.physics.add.sprite(game.config.width + 50, 32, 'piano');
        this.physics.add.collider(this.piano, this.ground, function() {
            crash = true;
        });
        this.physics.add.collider(this.piano, this.baby);

        //add hearts
        this.heart1 = this.add.image(50, 40, 'heart');
        this.heart2 = this.add.image(125, 40, 'heart');
        this.heart3 = this.add.image(200, 40, 'heart');
        this.lives = 3;
        this.gameOver = false;

        // set up baby 
        this.baby = this.physics.add.sprite(game.config.width/2, game.config.height/2, 'baby').setScale(SCALE);
        this.baby.setCollideWorldBounds(true);
        this.baby.setMaxVelocity(this.MAX_X_VEL, this.MAX_Y_VEL);
        this.anims.create({
            key: 'walk',
            frames: this.anims.generateFrameNumbers('baby', {start: 0, end: 7, first: 0}),
            frameRate: 15
        });

        //background grass
        this.background1_5 = this.add.tileSprite(175,481, game.config.width, 0, 'background_Grass').setOrigin(0,0);

        // set up Phaser-provided cursor key input
        cursors = this.input.keyboard.createCursorKeys();
        spacebar = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        rkey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);

        // add physics collider
        this.physics.add.collider(this.baby, this.ground);

        // print Level name
        //this.add.text(game.config.width/2, 30, 'Level 1: Baby', { font: '40px Futura', fill: '#000000' }).setOrigin(0.5);
    }

    update() {
        if(!this.gameOver){
            var lane = Phaser.Math.Between(1,3);
            this.bspeed = 5;
            console.log(choose);
            if(choose == 1){
                if(counter == 0){
                    if(lane == 1){
                        this.bananatest.y = 32;
                        this.bspeed = 3;
                    } else if(lane == 2){
                        this.bananatest.y = 150;
                        this.bspeed = 3;
                    } else if(lane == 3){
                        this.bananatest.y = 300;
                        this.bspeed = 3;
                    }
                }
                this.bananatest.x -= this.bspeed;
                counter++;
            }
            if(choose == 2){
                if(counter == 0){
                    if(lane == 1){
                        this.lightning.y = 32;
                    } else if(lane == 2){
                        this.lightning.y = 150;
                    } else if(lane == 3){
                        this.lightning.y = 300;
                    }
                }
                this.lightning.x -= 7;
                counter++;
            }
            if(choose == 3){
                if(counter == 0){
                    if(lane == 1){
                        this.piano.y = 32;
                    } else if(lane == 2){
                        this.piano.y = 150;
                    } else if(lane == 3){
                        this.piano.y = 300;
                    }
                }
                this.piano.x -= 10;
                counter++;
            }
            if(choose > 3){
                this.bananatest.x = game.config.width;
                this.bananatest.y = 32;
                choose = Phaser.Math.Between(1,speed);
                counter = 0;
            }
            //makes sure lightning doesn't constantly "explode" when falling off screen
            if(choose != 2){
                explode = false;
            }
            if(choose !=3){
                crash = false;
            }
            this.bananatest.velocity = 5;
            this.lightning.velocity = 200;
            this.piano.velocity = 500;

            //animate floor
            this.ground.anims.play('floor', true);

            //if banana hits player
            this.physics.overlap(this.bananatest, this.baby, function(){
                isBananaColliding = true;
            });

            //if lightning hits player
            this.physics.overlap(this.lightning, this.baby, function(){
                isLightningColliding = true;
            })

            //if piano hits player
            this.physics.overlap(this.piano, this.baby, function(){
                isPianoColliding = true;
            })

                if(isBananaColliding || this.bananatest.x <= 180){
                    this.bananatest.x = game.config.width;
                    if(isBananaColliding){
                        if(this.lives == 3){
                        this.loseLives(this.heart1);
                        } else if(this.lives == 2){
                        this.loseLives(this.heart2);
                        } else if(this.lives == 1){
                            this.loseLives(this.heart3);
                            this.endGame();
                        }
                    }
                    choose = Phaser.Math.Between(1,speed);
                    counter = 0;
                    isBananaColliding = false;
                }
                if(isLightningColliding || explode){
                    this.lightning.x = game.config.width;
                    if(isLightningColliding){
                        if(this.lives == 3){
                            this.loseLives(this.heart1);
                        } else if(this.lives == 2){
                            this.loseLives(this.heart2);
                        } else if(this.lives == 1){
                            this.loseLives(this.heart3);
                            this.endGame();
                        }
                    }
                    choose = Phaser.Math.Between(1,speed);
                    counter = 0;
                    isLightningColliding = false;
                    explode = false;
                }
                if(isPianoColliding || crash){
                    this.piano.x = game.config.width;
                    if(isPianoColliding){
                        if(this.lives == 3){
                            this.loseLives(this.heart1);
                        } else if(this.lives == 2){
                            this.loseLives(this.heart2);
                        } else if(this.lives == 1){
                            this.loseLives(this.heart3);
                            this.endGame();
                        }
                    }
                    choose = Phaser.Math.Between(1,speed);
                    counter = 0;
                    isPianoColliding = false;
                    crash = false;
                }
            if(this.baby.x <= 180 && this.baby.y == 458){
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
                this.endGame();
            }
            //hands
            this.god01.update();
            this.god02.update();
            this.god03.update();
            //make background scroll
            this.background.tilePositionX += 1;
            this.background1_2.tilePositionX += 0.5;
            this.background1_3.tilePositionX += 0.3;
            this.background1_4.tilePositionX += 0.5;
            this.background1_5.tilePositionX += 0.9;
            
            // wrap physics object(s) .wrap(gameObject, padding)
            /*this.physics.world.wrap(this.cloud01, this.cloud01.width/2);
            this.physics.world.wrap(this.cloud02, this.cloud02.width/2);*/

            
            // check keyboard input
            if(cursors.left.isDown) {
                this.baby.body.setAccelerationX(-this.ACCELERATION);
                this.baby.setFlip(true, false);
                // see: https://photonstorm.github.io/phaser3-docs/Phaser.GameObjects.Components.Animation.html#play__anchor
                // play(key [, ignoreIfPlaying] [, startFrame])
                this.baby.anims.play('walk', true);
                //this.leftKey.tint = 0xFACADE;   // tint key
            } else if(cursors.right.isDown) {
                this.baby.body.setAccelerationX(this.ACCELERATION);
                this.baby.resetFlip();
                this.baby.anims.play('walk', true);
                //this.rightKey.tint = 0xFACADE;  // tint key
            } else {
                // set acceleration to 0 so DRAG will take over
                this.baby.body.setAccelerationX(0);
                this.baby.body.setDragX(this.DRAG);
                //this.baby.anims.play('walk', true);
                this.baby.body.x -= 2;
                //this.leftKey.tint = 0xFFFFFF;   // un-tint keys
                //this.rightKey.tint = 0xFFFFFF;  
            }

		    // check if baby is grounded
	        this.baby.isGrounded = this.baby.body.touching.down;
	        // if so, we have jumps to spare 
	        if(this.baby.isGrounded) {
	    	    this.jumps = this.MAX_JUMPS;
	    	    this.jumping = false;
	        } else {
	    	    //this.baby.anims.play('jump');
	        }
            // allow steady velocity change up to a certain key down duration
            // see: https://photonstorm.github.io/phaser3-docs/Phaser.Input.Keyboard.html#.DownDuration__anchor
	        if(this.jumps > 0 && Phaser.Input.Keyboard.DownDuration(cursors.up, 150)) {
	            this.baby.body.velocity.y = this.JUMP_VELOCITY;
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
    endGame(){
        this.gameOver = true;
        this.bananatest.x = game.config.width + 64;
        this.lightning.x = game.config.width + 64;
        this.piano.x = game.config.width + 64;
        this.add.text(game.config.width/2, game.config.height/2, 'GAME OVER', { font: '90px Futura', fill: '#FFFFFF' }).setOrigin(0.5);
        this.add.text(game.config.width/2, game.config.height/2 + 80, 'Press R to restart', { font: '50px Futura', fill: '#FFFFFF' }).setOrigin(0.5);
    }
}
