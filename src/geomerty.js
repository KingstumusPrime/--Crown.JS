class BoxGeometry {
    constructor(scale, color="black"){
        this.loaded = true;
        this.opacity = 1;
        this.scale = {x: scale, y:scale};
        this.color = color;
    }

    render(ctx, pos){
        ctx.save();
        ctx.fillStyle = this.color;
        ctx.globalAlpha = this.opacity;
        ctx.fillRect(pos.x, pos.y, this.scale.x, this.scale.y);
        ctx.restore();
    }
}

class RectGeometry {
    constructor(x, y, color="black"){
        this.loaded = true;
        this.opacity = 1;
        this.scale = {x: x, y:y};
        this.rot = 0;
        this.color = color;
    }

    render(ctx, pos){
        ctx.save();
        ctx.globalAlpha = this.opacity;
        ctx.fillStyle = this.color;
        ctx.translate( pos.x , pos.y);
        ctx.rotate(this.rot*Math.PI/180);
        ctx.fillRect(0, 0, this.scale.x, this.scale.y);
        ctx.globalAlpha = 1;
        ctx.restore();
    }
}

class Line{
    constructor(length, width){
        this.length = length;
        this.width = width;
        this.loaded = true;
        this.opacity = 1;
        this.scale = {x: length, y:width};
        this.rot = 0;
        this.start  = {x: 0, y: 0};
        this.end  = {x: 0, y: 0};
        this.color = "black";
    }

    render(ctx, pos){
        ctx.save();
        ctx.globalAlpha = this.opacity;
        ctx.fillStyle = this.color;
        ctx.beginPath();
        console.log(this.rot);
        const angle = this.rot*Math.PI/180;
        this.start = pos;
        this.end = {x: pos.x + this.length * Math.cos(angle), y: pos.y + this.length * Math.sin(angle)}
        ctx.lineTo(this.end.x, this.end.y);
        ctx.stroke();
        ctx.restore();
    }
}
class CircleGeometry {
    constructor(scale, color="black"){
        this.loaded = true;
        this.opacity = 1;
        this.scale = {x: scale, y:scale};
        this.color = color;
    }

    render(ctx, pos){
        
        ctx.save();
        ctx.globalAlpha = this.opacity;
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.translate(pos.x + this.scale.x/2, pos.y + this.scale.y/2);
        ctx.arc(0, 0, this.scale.x/2, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
        ctx.restore();
    }
}


class Sprite {
    constructor(src, scale={x:0,y:0}){
        this.img = new Image();
        this.img.src = src;
        this.scale = scale;
        this.opacity = 1;
        this.rot = 0;
        this.loaded = false;
        this.img.addEventListener('load', () => {
            if(this.scale.x == 0 || this.scale.y == 0){
                this.scale.x = this.img.width;
                this.scale.y = this.img.height;
            }
            this.loaded = true;
            this.onload();
        });
    }

    render(ctx, pos){
        ctx.save();
        ctx.globalAlpha = this.opacity;
        ctx.fillStyle = this.color;
    
        // Translate to the center of the image
        ctx.translate(pos.x + this.scale.x / 2, pos.y + this.scale.y / 2);
    
        // Rotate around the center
        ctx.rotate(this.rot * Math.PI / 180);
    
        // Draw the image, offsetting by half the width and height
        ctx.drawImage(this.img, -this.scale.x / 2, -this.scale.y / 2, this.scale.x, this.scale.y);
    
        ctx.globalAlpha = 1;
        ctx.restore();
    }

    // used to update actors when the image loads
    onload(){}
}
