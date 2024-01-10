class InputController {
    constructor(){
        this.keyRepeatListeners = {};
        this.keyListeners = {};
        this.keys = {};
        this.mouse = {x: 0, y: 0};
        this.mousePrev;
        this.prevKeys = null;
        this.paused = false;
        document.addEventListener("keydown", (e) => this.onkeyDown(e), false);
        document.addEventListener("keyup", (e) => this.onkeyUp(e), false);
        document.addEventListener("mousemove", (e) => {
            this.mouse = {x: e.clientX, y: e.clientY};
            this.onMouseMove();
        });

    }

    onMouseDown(func){
        document.body.onmousedown = func;
    };

    onMouseMove(){};

    onKeyPressed(key, func){
        if(key == "space"){
            key = " ";
        }
        const e = new CustomEvent(key);
        document.addEventListener(key,func)
        this.keyListeners[key] = e;
    }

    onKeyPressedRepeat(key, func){
        if(key == "space"){
            key = " ";
        }
        const e = new CustomEvent(key);
        document.addEventListener(key,func)
        this.keyRepeatListeners[key] = e;
    }

    onkeyUp(e){
        this.keys[e.key] = false;
    }

    onkeyDown(e){
        this.keys[e.key] = true;
        if(this.keys[e.key] && !this.prevKeys[e.key] && !this.paused){
            if(this.keyListeners[e.key] != null){
                document.dispatchEvent(this.keyListeners[e.key]);
            }
        }
    }

    update(){
        this.prevKeys = {...this.keys};
        this.mousePrev = {...this.mouse};
        Object.keys(this.keyRepeatListeners).forEach(key => {
            // fire repeat events
            if(this.keyRepeatListeners[key] != null && this.keys[key] && !this.paused){
                document.dispatchEvent(this.keyRepeatListeners[key]);
            }
        })
    }

}