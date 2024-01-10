class Actor {
    constructor(name, sprite, context){
        this.name = name;
        // sprite is a reference to any class with a render function
        this.sprite = sprite;
        this.pos = {x: 0, y: 0};
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
        if(actorsCollides(this, cam)){
            this.culled = false;
            this.sprite.render(this.ctx, VecSub(this.pos, cam.pos));
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
