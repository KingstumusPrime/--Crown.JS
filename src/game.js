class Game {
    constructor(canvas, ctx, input){
        this.canvas = canvas;
        this.ctx = ctx;
        // a lookup of all of the objects internal use only
        this.objMap = {};
        // keeps hold of all groups
        this.groupMap = {};
        // all updatable object internal use only
        this.updaters = [];
        // stores all paused actors by name
        this.pauseList = {};
        // tween list
        this.tweenList = [];
        // background color
        this.backgroundColor = "white";
        // optimzed off screen canvas
        this.offScreenCanvas = document.createElement("canvas");
        this.offScreenCanvas.width = canvas.width;
        this.offScreenCanvas.height = canvas.height;
        this.offCtx = this.offScreenCanvas.getContext("2d");
        this.input = input;
        // camera a 0, 0
        this.camera = new Camera(0, 0, canvas);
    }

    addActor(name, sprite, params={}){
        const act = new Actor(name, sprite, this.ctx);
        if("bottom" in params && params["bottom"] == true){
            this.updaters.unshift(act);
        }else{
            this.updaters.push(act);
        }

        this.objMap[name] = act;
        if("group" in params){
            this.addToGroup(params["group"], act);
        }
        return act;
    }

    addStaticActor(name, sprite, pos, params={}){
        
        const act = new Actor(name, sprite, this.ctx);
        act.pos = pos;
        this.objMap[name] = act;

        if(sprite.img !== undefined && sprite.loaded == false){
            let prev = sprite.img.onload;
            sprite.img.onload = () => {
                if(prev){
                    prev();
                }
                
                act.sprite.render(this.offCtx, act.pos, act.scale);
            }
        }else{
            act.sprite.render(this.offCtx, act.pos, act.scale);
        }

        if("group" in params){
            this.addToGroup(params["group"], act);
        }
        return act;
    }

    findActor(name){
        return this.objMap[name];
    }

    update(){
        // clear screen
        this.ctx.save();
        this.ctx.fillStyle = this.backgroundColor;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.restore();
        // update the input controller
        this.input.update();
        // update the camera
        this.camera.update();
        this.ctx.drawImage(this.offScreenCanvas, -this.camera.pos.x, -this.camera.pos.y);
        // render all the static objects
        this.tweenList.forEach((tween, i) => {
            tween.step();
            if(tween.finished == true){
                delete this.tweenList[i];
            }
        }) 

        this.updaters.forEach((updater => {
            if(updater.sprite.loaded != false){
                updater.update(this.camera);
            }
        }))
    }

    destroy(obj){
        this.updaters = this.updaters.filter((updater) => {
            return updater.name != obj.name;
        });
        delete this.objMap[obj.name];
    }
    
    pauseInput(){
        this.input.paused = true;
    }

    resumeInput(){
        this.input.paused = false;
    }


    destroyGroup(name){
        this.groupMap[name].forEach(item => {
            this.destroy(item)
        })
        this.groupMap[name] = [];
    }

    addToGroup(g, item){
        if(!(g in this.groupMap)){
            this.groupMap[g] = [];
        }
        this.groupMap[g].push(item);
    }

    getGroup(name){
        return this.groupMap[name] != undefined ? this.groupMap[name] : [];
    }
    
    addTween(start, end, func, algo, endfunc, speed){
        this.tweenList.push(new TWEEN(start, end, func, algo, endfunc, speed));
    }
}
