// get canvas=2draw
const canvas = document.querySelector("#game");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
const ctx = canvas.getContext("2d");

const i = new InputController()

let drawing = false;
var filling = false;
var points = [];
const game = new Game(canvas, ctx, i);
game.backgroundColor = "black";
const camera = game.camera;
const player = game.addActor("player", new BoxGeometry(50))
player.sprite.color = "red";
const ray = game.addActor("ray", new Line(500, 10));
const wallColors = ["red", "green", "yellow", "orange", "black", "purple"];
let mapPolygon = [];
let currTri = [];
// each item has three points that get drawn as a red triangle
let lightPolygon = []
let walls = []
ray.rot = 0;
ray.sprite.color = "red";


//cast rays to points
function visibilityCalc(){
    const playerCenter = {pos:{x: player.pos.x + player.scale.x/2, y: player.pos.y + player.scale.y/2}};
    const res = [];
    walls.forEach((wall, i) => {
        const w = wall[0];

    });
    console.log(points)
    const poly = mapPolygon.flat(1);
    poly.forEach(p => {
        console.log(p);
        res.push(sendRay(p, playerCenter, 0.0001));
        res.push(sendRay(rayAtDir(playerCenter, getAngle(playerCenter.pos, p.pos) + 0.01), playerCenter));
        res.push(sendRay(rayAtDir(playerCenter, getAngle(playerCenter.pos, p.pos) - 0.01), playerCenter));
    })

    res.forEach((p) => {
        ctx.save();
        added = true;
        ctx.fillStyle = "green";
        ctx.fillRect(p.x, p.y, 10, 10);
        ctx.restore();
    })
    return res;
}

function rayAtDir(start, dir){
    const len = 10000;
    const end = structuredClone(start);
    end.pos.x += len * Math.cos(dir);
    end.pos.y += len * Math.sin(dir);
    console.log(end);
    ctx.beginPath();
    ctx.moveTo(start.pos.x, start.pos.y);
    ctx.lineTo(end.pos.x, end.pos.y);
    ctx.closePath();
    ctx.stroke();
    return end;
}

function getAngle(a, b){
    return Math.atan2(b.y - a.y, b.x - a.x)
}

function sendRay(point, start){

    let bestDist = dist(start.pos, point.pos)
    let bestPoint = point.pos;
    let added = false;
    walls.forEach((checkwall, index) => {
        const intersection = getIntersection(start.pos, point.pos, checkwall[0].pos, checkwall[1].pos);
        if(intersection){
            ctx.fillRect(intersection.x, intersection.y, 10, 10);
            const d = dist(start.pos, intersection);
            if(d < bestDist){
                ctx.save();d
                added = true;
                bestDist = d;
                bestPoint = intersection;
            }
        }
    });

    return bestPoint;
}

// ray.onUpdate = function(){
//     ray.pos.x = player.pos.x + player.scale.x/2;
//     ray.pos.y = player.pos.y + player.scale.y/2;
//     if(drawing && ray.sprite.rot < 360){
//         game.getGroup("points").forEach(point => {
//             console.log(point)
//             if(pointOnLine(ray.sprite, point)){
//                 currTri.push(point.pos);
//                 if(currTri.length == 2){
//                     currTri.push(player.pos);
//                     lightPolygon.push(currTri);
//                     currTri = [];
//                 }
//             }
//         })
//         ray.sprite.rot += 0.5;
//     }

// }


player.pos = {x: canvas.width/2, y: canvas.height/2};

function getDistance(a, b){
    return (b.y - a.y)/(b.x - a.x);
}

function dist(a, b){
    return Math.hypot(a.x-b.x, a.y-b.y);
}

function pointOnLine(line, point){
    let lineDist = getDistance(line.start, point.pos) + getDistance(line.end, point.pos);
    let lineLen = getDistance(line.start, line.end);
    const buffer = 1;
    if (lineDist >= lineLen-buffer && lineDist <= lineLen+buffer) {
        return true;
    }
    return false;
}

i.onMouseDown(function (e) {
    points.push(game.addStaticActor(Math.random(), new BoxGeometry(10), i.mouse, {group: "points"}));
})

i.onKeyPressed("space", function(){
    drawing = true;
    const newP = jarvisSort(points);
    mapPolygon.push(newP);
    genWalls(newP);
    points = [];
})

i.onKeyPressed(";", function(){
    drawing = true;
    mapPolygon.push(points);
    genWalls(points);
    points = [];
})

i.onKeyPressedRepeat("a", function() {
    player.pos.x -= 8;
})

i.onKeyPressedRepeat("d", function() {
    player.pos.x +=8;
})

i.onKeyPressedRepeat("w", function() {
    player.pos.y -=8;
})

i.onKeyPressedRepeat("s", function() {
    player.pos.y +=8;
})

i.onKeyPressed("f", () => {

    filling = !filling;
})

function isCounterclockwise(a, b, c){
    return (c.pos.y - b.pos.y) * (b.pos.x - a.pos.x) - (b.pos.y - a.pos.y) * (c.pos.x - b.pos.x) < 0;
}

function jarvisSort(points){
    let res = [];
    // get leftmost point to start by sorting by x then getting the leftmost point
    points.sort((a, b) => a.pos.x - b.pos.x);
    let onShape = points[0];
    while(true){
        res.push(onShape);
        let nextPoint = points[0];
        for(const point of points){
            if(isCounterclockwise(onShape, point, nextPoint) || nextPoint.name == onShape.name){
                nextPoint = point;
            }
        }
        onShape = nextPoint;
        if(onShape.name == points[0].name){
            break;
        }
    }

    return res;
}

function drawWall(a, b, cIndex){
    ctx.beginPath();
    ctx.moveTo(a.pos.x, a.pos.y)
    ctx.strokeStyle = wallColors[cIndex];
    ctx.lineTo(b.pos.x, b.pos.y);
    ctx.stroke();
    ctx.closePath();
}

function genWalls(points){
    if(points.length == 0) return;
    points.forEach((p, i) => {
        if(i == 0){return;}
        walls.push([points[i - 1], p])
    })
    walls.push([points[points.length - 1], points[0]]);

}

function drawPolygon(points){
    if(points.length == 0) return;
    ctx.save();
    ctx.strokeStyle = "red";
    ctx.moveTo(points[0].pos.x, points[0].pos.y);
    points.forEach((p, i) => {
        if(i == 0){return;}
        //drawWall(points[i - 1], p, i - 1);
        ctx.lineTo(p.pos.x, p.pos.y);
    })
    ctx.lineTo(points[0].pos.x, points[0].pos.y);
    ctx.stroke();
    ctx.closePath();
    ctx.restore();
}

function getIntersection(a,b,c,d){
    const top = (d.x-c.x)*(a.y-c.y)-(d.y-c.y)*(a.x-c.x);
    const uTop = (c.y-a.y)*(a.x-b.x)-(c.x-a.x)*(a.y-b.y);
    const bottom = (d.y-c.y)*(b.x-a.x)-(d.x-c.x)*(b.y-a.y);
    if(bottom != 0){
        const t = top/bottom;
        const u = uTop/bottom;
        if(t >= 0 && t<=1 && u >= 0 && u<=1){ 
            return {x:lerp(a.x,b.x,t), y:lerp(a.y,b.y,t)}
        }
    }
    return null;
}

function drawTri(a,b,c){
    ctx.beginPath();  // Start a new path
    ctx.moveTo(a.x, a.y);  // Move to point a
    ctx.lineTo(b.x, b.y);  // Draw a line to point b
    ctx.lineTo(c.x, c.y);  // Draw a line to point c
    ctx.closePath();  // Close the path to create a triangle
}

function drawLight(origin, points){
    if(points.length == 0) return;
    points = points.sort((a, b) => getAngle(a, origin) - getAngle(b, origin));
    ctx.save()
    ctx.fillStyle = "yellow";
    ctx.strokeStyle= "purple";
    points.forEach((p, i) => { 
        ctx.fillStyle = "black";
        ctx.fillText(i, p.x, p.y);
        if(i == 0){
            return
        }
        ctx.fillStyle = "yellow";
        drawTri(origin, points[i - 1], p);
        if(filling){
            ctx.fill();
        }
        ctx.stroke();
    });
    drawTri(origin, points[0], points[points.length - 1]);
    if(filling){
        ctx.fill();
    }
    ctx.stroke();
    ctx.restore();

}


function update(){
    game.update();

    if(drawing){
        mapPolygon.forEach(p => {
            drawPolygon(p);
        })

        drawLight({x: player.pos.x + player.scale.x/2, y: player.pos.y + player.scale.y/2}, visibilityCalc());
    }
    window.requestAnimationFrame(update);
}

update();