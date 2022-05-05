class Play extends Phaser.Scene {
    constructor() {
        super('playScene');
    }
    
    create() {
        // variables and settings
        this.ACCELERATION = 700;
        this.MAX_X_VEL = 500;   // pixels/second
        this.MAX_Y_VEL = 5000;
        this.DRAG = 1000;    // DRAG < ACCELERATION = icy slide
        this.MAX_JUMPS = 1; // change for double/triple/etc. jumps 
        this.JUMP_VELOCITY = -600;
        currentScene = 3;
        this.physics.world.gravity.y = 2600;

        this.jumpFX = this.sound.add('jump2', {loop: false, volume: 1});
        this.lightningFX = this.sound.add('lightningFX', {loop: false, volume: 1});
        this.pianoFX = this.sound.add('pianoFX', {loop: false, volume: 1});
        this.bananaFX = this.sound.add('bananaFX', {loop: false, volume: 1});


        this.game.sound.stopAll();
        //play level soundtrack
        this.levelSoundtrack = this.sound.add('levelMusic', {loop: true, volume: 1});
        this.levelSoundtrack.play();

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
        this.anims.create({
            key: 'hands',
            frames: this.anims.generateFrameNumbers('god', {start: 0, end: 1, first: 0}),
            frameRate: 5
        });
        this.god01 = new God(this, game.config.width - 32, 32, 'god');
        this.god02 = new God(this, game.config.width - 32, 32*5, 'god');
        this.god03 = new God(this, game.config.width - 32, 32*10, 'god');


        //add banana
        this.bananatest = this.physics.add.sprite(game.config.width, 32, 'banana');
        this.bananatest.visible = false;
        this.physics.add.collider(this.bananatest, this.ground);
        this.physics.add.collider(this.bananatest, this.baby);

        //add lightning
        this.lightning = this.physics.add.sprite(game.config.width, 32, 'lightning');
        this.lightning.visible = false;
        this.physics.add.collider(this.lightning, this.ground, function(){
            explode = true;
        });
        this.physics.add.collider(this.lightning, this.baby);

        /*this.anims.create({
            key: 'dissipate',
            frames: this.anims.generateFrameNumbers('flash', {start: 0, end: 5, first: 0}),
            frameRate: 5
        });*/

        //add piano
        this.piano = this.physics.add.sprite(game.config.width, 32, 'piano');
        this.piano.visible = false;
        this.physics.add.collider(this.piano, this.ground, function(){
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
        this.anims.create({
            key: 'slow',
            frames: this.anims.generateFrameNumbers('elder', {start: 0, end: 7, first: 0}),
            frameRate: 15
        })

        //background grass
        this.background1_5 = this.add.tileSprite(175,481, game.config.width, 0, 'background_Grass').setOrigin(0,0);

        // set up Phaser-provided cursor key input
        cursors = this.input.keyboard.createCursorKeys();
        spacebar = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        rkey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);

        // add physics collider
        this.physics.add.collider(this.baby, this.ground);

        //add speeds
        this.bspeed = 3;
        this.lspeed = 7;
        this.pspeed = 13;

        this.tempChoose = 0;
        this.toss1 = false;
        this.toss2 = false;
        this.toss3 = false;

        this.bdifficulty = 60;
        this.ldifficulty = 85;
        this.pdifficulty = 95;
        this.doubledifficulty = 98;
        this.tripledifficulty = 99;

        this.scoreIncrement = 25;
        this.level = 1;
        choose = 20;

        //timer
        //this.levelUpText;
        this.clocktest = this.time.addEvent({
            delay: 20000,                // level up every 20 seconds
            callback: this.timerEvent,
            callbackScope: this,
            loop: true
        });
        this.scoreClock = this.time.addEvent({
            delay: 5000,                // increase score every 5 seconds
            callback: () => {
                if(!this.gameOver){
                    score += this.scoreIncrement;
                    this.progresstext.destroy();
                    this.progresstext = this.add.text(game.config.width/2, 30, 'Level ' + this.level + ' Score: ' + score, { font: '30px Futura', fill: '#000000' }).setOrigin(0.5);
                }
            },
            callbackScope: this,
            loop: true
        });

        // print Level name
        this.progresstext = this.add.text(game.config.width/2, 30, 'Level ' + this.level + ' Score: ' + score, { font: '30px Futura', fill: '#000000' }).setOrigin(0.5);
    
        //add gameover text
        this.gameOverText = this.add.image(game.config.width * 2, 0, 'gameover');

        //add tombstone
        this.tombstone = this.add.image(game.config.width, 0, 'tombstone');

        this.difficultyIncrease = false;

        
    }
    timerEvent() {
        if(!this.gameOver){
            //this.levelUpText = this.add.text(game.config.width/2, 70, 'LEVEL UP!',  { font: '45px Futura', fill: '#EE4B2B' }).setOrigin(0.5);
            this.level += 1;
            this.progresstext.destroy();
            this.progresstext = this.add.text(game.config.width/2, 30, 'Level ' + this.level + ' Score: ' + score, { font: '30px Futura', fill: '#000000' }).setOrigin(0.5);
            this.scoreIncrement += 10;
            this.difficultyIncrease = true;
            // Create your new object here.
        }
    }

    update() {
        if(!this.gameOver){
            var laneb = Phaser.Math.Between(1,3);
            var lanel = Phaser.Math.Between(1,3);
            var lanep = Phaser.Math.Between(1,3);
            console.log(choose);
            if(choose <= this.bdifficulty || choose >= this.doubledifficulty){
                if(choose != this.tempChoose){
                    if(laneb == 1){
                        this.toss1 = true;
                        this.bananatest.y = 32;
                    } else if(laneb == 2){
                        this.toss2 = true;
                        this.bananatest.y = 150;
                    } else if(laneb == 3){
                        this.toss3 = true;
                        this.bananatest.y = 300;
                    }
                    this.bananaFX.play();
                    this.bananatest.visible = true;
                    this.bspeed = 3;
                }

                //if banana hits player
                this.physics.overlap(this.bananatest, this.baby, function(){
                    isBananaColliding = true;
                });
                this.bananatest.x -= this.bspeed;
            }
            if((choose > this.bdifficulty && choose <= this.ldifficulty) || choose >= this.doubledifficulty){
                if(choose != this.tempChoose){
                    if(lanel == 1){
                        this.lightning.y = 32;
                        this.lspeed = 18;
                    } else if(lanel == 2){
                        this.lightning.y = 150;
                        this.lspeed = 15;
                    } else if(lanel == 3){
                        this.lightning.y = 300;
                        this.lspeed = 10;
                    }
                    this.lightningFX.play();
                    this.lightning.visible = true;
                    explode = false;
                }

                //if lightning hits player
                this.physics.overlap(this.lightning, this.baby, function(){
                    isLightningColliding = true;
                })
                this.lightning.x -= this.lspeed;
            }   else {
                explode = false;
            }
            if((choose > this.ldifficulty && choose <= this.pdifficulty) || choose > this.tripledifficulty){
                if(choose != this.tempChoose){
                    if(lanep == 1){
                        this.piano.y = 32;
                        this.pspeed = 18;
                    } else if(lanep == 2){
                        this.piano.y = 150;
                        this.pspeed = 15;
                    } else if(lanep == 3){
                        this.piano.y = 300;
                        this.pspeed = 10;
                    }
                    this.pianoFX.play();
                    this.piano.visible = true;
                    crash = false;
                }

                //if piano hits player
                this.physics.overlap(this.piano, this.baby, function(){
                    isPianoColliding = true;
                })

                this.piano.x -= this.pspeed;
            } else {
                crash = false;
            }
            this.bananatest.velocity = 5;
            this.lightning.velocity = 5;
            this.piano.velocity = 5;

            //animate floor
            this.ground.anims.play('floor', true);

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
                this.bananatest.visible = false;
                isBananaColliding = false;
            }
            if(isLightningColliding || explode){
                //this.lightning.anims.play('dissipate', 6);
                //this.lspeed = 0;
                //this.lightning.on('animationcomplete', ()=>{
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
                    this.lightning.visible = false;
                    isLightningColliding = false;
                    explode = false;
                //});
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
                this.piano.visible = false;
                isPianoColliding = false;
                crash = false;
            }
            if((this.bananatest.x == game.config.width) && (this.lightning.x == game.config.width) && (this.piano.x == game.config.width)){
                if(this.difficultyIncrease){
                    this.difficultyIncrease = false;
                    this.bdifficulty -= 10;
                    this.ldifficulty -= 8;
                    this.pdifficulty -= 6;
                    this.doubledifficulty -= 4;
                    this.tripledifficulty -= 2;
                }
                choose = Phaser.Math.Between(1, speed);
            } else {
                this.tempChoose = choose;
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
            if(this.toss1){
                this.god01.anims.play('hands', 2);
                this.god01.on('animationcomplete', ()=>{
                    this.toss1 = false;
                });
            }
            if(this.toss2){
                this.god02.anims.play('hands', 2);
                this.god02.on('animationcomplete', ()=>{
                    this.toss2 = false;
                });
            }
            if(this.toss3){
                this.god03.anims.play('hands', 2);
                this.god03.on('animationcomplete', ()=>{
                    this.toss3 = false;
                });
            }
            //make background scroll
            this.background.tilePositionX += 1;
            this.background1_2.tilePositionX += 0.5;
            this.background1_3.tilePositionX += 0.3;
            this.background1_4.tilePositionX += 0.5;
            this.background1_5.tilePositionX += 0.9;

            
            // check keyboard input
            if(cursors.left.isDown) {
                this.baby.body.setAccelerationX(-this.ACCELERATION);
                this.baby.setFlip(true, false);
                // see: https://photonstorm.github.io/phaser3-docs/Phaser.GameObjects.Components.Animation.html#play__anchor
                // play(key [, ignoreIfPlaying] [, startFrame])
                if(this.level < 5){
                    this.baby.anims.play('walk', true);
                } else {
                    this.baby.anims.play('slow', true);
                }
                //this.leftKey.tint = 0xFACADE;   // tint key
            } else if(cursors.right.isDown) {
                this.baby.body.setAccelerationX(this.ACCELERATION);
                this.baby.resetFlip();
                if(this.level < 5){
                    this.baby.anims.play('walk', true);
                } else {
                    this.baby.anims.play('slow', true);
                }
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
                this.jumpFX.play();
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
            score = 0;
            this.scene.restart();
        }
    }
    loseLives(heart){
            heart.destroy();
            this.lives -= 1;
            this.sound.play('crush'); 
    }
    endGame(){
        this.gameOver = true;
        this.bananatest.x = game.config.width + 64;
        this.lightning.x = game.config.width + 64;
        this.piano.x = game.config.width + 64;
        this.sound.play('deathFX');
        this.gameOverText.x = game.config.width/2;
        this.gameOverText.y = 525/2;
        this.tombstone.x = this.baby.x;
        this.tombstone.y = 475;
        this.baby.visible = false;
        //this.add.text(game.config.width/2, game.config.height/2, 'GAME OVER', { font: '90px Futura', fill: '#FFFFFF' }).setOrigin(0.5);
        //this.add.text(game.config.width/2, game.config.height/2 + 80, 'Press R to restart', { font: '50px Futura', fill: '#FFFFFF' }).setOrigin(0.5);
    }
}

