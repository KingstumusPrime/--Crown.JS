class Camera {
    constructor(x, y, canvas){
        this.pos = {x: x, y: y};
        this.scale = {x: canvas.width,y: canvas.height}
        this.canvas = canvas; 
        this.shakeStrength = 0;
        this.dampening = 3;
        this.target = {x: 0, y: 0};
        this.excel = {x: 0, y: 0};
        this.drag = 0.3;
    }

    update(){
        
        this.excel.x = (this.target.x - this.pos.x) * this.drag;
        this.excel.y = (this.target.y - this.pos.y) * this.drag;

        if(this.shakeStrength > 0){
            // get a random amount to add to exceleration
            const randX = Math.random() * 2 * this.shakeStrength - this.shakeStrength;
            const randY = Math.random() * 2 * this.shakeStrength - this.shakeStrength;
            this.excel.x += randX;
            this.excel.y += randY;
            this.shakeStrength -= this.dampening;
        }


       this.pos.x += this.excel.x;
       this.pos.y += this.excel.y;


    }

    shake(amount) {
        this.shakeStrength = amount;    
    }
}