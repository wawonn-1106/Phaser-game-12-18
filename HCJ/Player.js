export class Player extends Phaser.Physics.Arcade.Sprite{
    constructor(scene,x,y,texture){
        super(scene,x,y,texture);

        scene.physics.world.enable(this);
        scene.add.existing(this);
        
        this.play('idle');
        this.setScale(5);
        this.setCollideWorldBounds(true);

        this.SPEED=200;
        this.JUMP=-300;

        this.cursors=scene.cursors;
    }
    update(){
        if(!this.active) return;

        let targetVelocityX=0;
        const isRightDown=this.cursors.right.isDown;
        const isLeftDown=this.cursors.left.isDown;
        const isUpDown=this.cursors.up.isDown;

        if(isRightDown){
            targetVelocityX=this.SPEED;
            if (targetVelocityX !== 0) {
                this.play('runRight', true);
            } else {
                this.play('idle', true);
            }
        }
        else if(isLeftDown){
            targetVelocityX=-this.SPEED;
            if (targetVelocityX !== 0) {
                this.play('runLeft', true);
            } else {
                this.play('idle', true);
            }
        }
        this.setVelocityX(targetVelocityX);

        if(isUpDown && this.body.onFloor()){
            this.setVelocityY(this.JUMP);
        }
    }
}