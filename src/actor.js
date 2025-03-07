let CROWN_DISABLE_INPUT = false;
class Actor {
    constructor(name, sprite, context){
        this.name = name;
        // sprite is a reference to any class with a render function
        this.sprite = sprite;
        this.pos = {x: 0, y: 0};
        this.sprSz = {x: 1, y: 1};
        // how many degrees of rotation
        this.rot = 0;
        this.scale = this.sprite.scale;
        this.ctx = context;
        this.culled = false;
 
        // update scale wih loaded sprite
        this.sprite.onload = () => {
            this.scale = this.sprite.scale;
            this.onSpriteLoaded();
        }
    }


    // for the user to fill out
    update(cam){
        if(actorsCollides(this, cam) || (cam.culling == false)){
            this.culled = false;
            this.ctx.save();
            this.ctx.setTransform(this.sprSz.x, 0, 0, this.sprSz.y, ((this.pos.x - cam.pos.x)+ this.scale.x/2) * (1 - this.sprSz.x), ((this.pos.y - cam.pos.y) + this.scale.y/2) * (1 - this.sprSz.y));
            this.sprite.render(this.ctx, VecSub(this.pos, cam.pos));
            this.ctx.restore();
        }else{
            this.culled = true;
        }
        
        this.onUpdate();
    };

    // scale it and its sprite
    scaleBy(num){
        this.sprite.scale.x =  this.sprite.scale.x * num;
        this.sprite.scale.y =  this.sprite.scale.y * num;
        this.scale.x = this.scale.x * num;
        this.scale.y = this.scale.y * num;
    }
    
    onUpdate(){};
    onSpriteLoaded(){};
    onCreate(func){func()};
}
