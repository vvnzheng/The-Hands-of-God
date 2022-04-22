// Rocket prefab
class Rocket extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, texture, frame) {
      super(scene, x, y, texture, frame);
  
      // add object to existing scene
      scene.add.existing(this);
      //firing status
      this.isFiring = false;
      //pixels per frame
      this.moveSpeed = 2;
      //firing sound
      this.sfxRocket = scene.sound.add('sfx_rocket');
    }
    update(){
        //left/right
        if(!this.isFiring){
            if(keyLEFT.isDown && this.x >= borderUISize + this.width){
                this.x -= this.moveSpeed;
            } else if (keyRIGHT.isDown && this.x <= game.config.width - borderUISize - this.width){
                this.x += this.moveSpeed;
            }
            if(keyUP.isDown && this.y == 0){
                while(this.y != 10){
                    this.y += this.moveSpeed;
                }
                while(this.y != 0){
                    this.y -= this.moveSpeed;
                }
            }
        }
        //fire
        if(Phaser.Input.Keyboard.JustDown(keyF)){
            this.isFiring = true;
            this.sfxRocket.play();
        }
        //if fired, move up
        if(this.isFiring && this.y >= borderUISize * 3 + borderPadding){
            this.y -= this.moveSpeed;
        }
        //reset on miss
        if(this.y <= borderUISize * 3 + borderPadding){
            this.reset();
        }
    }
    reset(){
        this.isFiring = false;
        this.y = game.config.height - borderUISize - borderPadding;
    }
  }