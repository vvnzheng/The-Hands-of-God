// Banana prefab
class Banana extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, texture, frame) {
      super(scene, x, y, texture, frame);
  
      // add object to existing scene
      scene.physics.add.existing(this);

      this.isBananaThrown = false;
    }
    update(){
        /*if(Phaser.Input.Keyboard.JustDown(spacebar)){
            console.log('throw');
            this.isBananaThrown = true;
        }*/
        //if(this.isBananaThrown){
            //while(this.x > 0 - this.width){
                //left
                this.x -= 10;
                //wrap
                console.log(isBananaColliding);
                if(isBananaColliding || this.x <= 0 - this.width){
                    console.log('uhoh');
                    this.reset();
                }
            //}
            //this.reset();
        //}
    }
    reset(){
        this.x = game.config.width;
        this.y = 32;
        this.isBananaThrown = false;
        isBananaColliding = false;
    }
}