// Spaceship prefab
class Spaceship extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, texture, frame, pointValue) {
      super(scene, x, y, texture, frame);
  
      // add object to existing scene
      scene.add.existing(this);
      //point status
      this.points = pointValue;
      //pixels per frame
      this.moveSpeed = game.settings.spaceshipSpeed;
    }
    update(){
        //left
        this.x -= this.moveSpeed;
        //wrap
        if(this.x <= 0 - this.width){
            this.reset();
        }
    }
    reset(){
        this.x = game.config.width;
    }
}