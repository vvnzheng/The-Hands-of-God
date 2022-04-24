// God prefab
class God extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, texture, frame) {
      super(scene, x, y, texture, frame);
  
      // add object to existing scene
      //scene.physics.add.existing(this, 0);
      scene.add.existing(this);
    }
    update(){
        /*if(Phaser.Input.Keyboard.JustDown(spacebar)){
            console.log('throw');
            this.isBananaThrown = true;
        }*/
        //if(this.isBananaThrown){
            //while(this.x > 0 - this.width){
                //left
                if(this.x >= game.config.width - this.width ){
                    this.x -= 3;
                } else {
                    this.reset();
                }
            //}
            //this.reset();
        //}
    }
    reset(){
        this.x = game.config.width;
    }
}