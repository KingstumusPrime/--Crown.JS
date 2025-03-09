// TODO
// apply some sort of static over the screen to make it look SPOOKY

// how to play:
// click to create points
// space : create the most optimized shape given points
// q : creaes polygon in order points where placed
// f : starts game
// click : spawn points and kill zombies

// get canvas=2draw
const canvas = document.querySelector("#game");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
const ctx = canvas.getContext("2d");

const i = new InputController()

let drawing = true;
var filling = false;
var points = [];
const game = new Game(canvas, ctx, i);
game.backgroundColor = "black";
const camera = game.camera;
const player = game.addActor("player", new polygon([{x: 0, y: 0}, {x: 50, y: 0}, {x: 50, y: 50}, {x: 0, y: 50}], "orange"));
player.sprite.color = "red";
player.canHit = false;
const wallColors = ["red", "green", "yellow", "orange", "black", "purple"];
let mapPolygon = [];
let currTri = [];
// each item has three points that get drawn as a red triangle
let lightPolygon = [];
let walls = [];

let bloodWells = [];
spawnWell({x: 100, y: 100}, 10);
spawnWell({x: canvas.width, y: 100}, 10);

function spawnWell(pos, max){
    const well = game.addActor("bw1", new ProgressBox(100, max, 0, "orange", "red"));
    well.pos = pos;
    bloodWells.push(well);
}

player.canHit = true;
player.onUpdate = function() {

    const playerCenter = {pos:{x: player.pos.x + player.scale.x/2, y: player.pos.y + player.scale.y/2}};
    camera.target.x = player.pos.x - camera.scale.x/2;
    camera.target.y= player.pos.y- camera.scale.y/2;
    player.vel = checkInput();
    for(let i = 0; i <= 1; i++){
        const offSet = {x: 0, y: 0};
        if(i == 0){
            offSet.x = player.vel.x;
        }else{
            offSet.y = player.vel.y;
        }
        player.sprite.walls.forEach(pwall => {
            const wTest = [{pos: {x: pwall[0].pos.x + player.pos.x + offSet.x, y: pwall[0].pos.y + player.pos.y + offSet.y}}, 
            {pos: {x: pwall[1].pos.x + player.pos.x + offSet.x, y: pwall[1].pos.y + player.pos.y + offSet.y + offSet.y}}];
            walls.forEach(wall => { 
                //drawWall(wTest[0], wTest[1], 2);
                if(getIntersection(wTest[0].pos, wTest[1].pos, wall[0].pos, wall[1].pos)){
                    if(i == 0){
                        player.vel.x = 0;
                    }else{
                        player.vel.y = 0;
                    }

                }
            })

            if(!player.canHit){return;}
            for(const z of Object.values(enemies)){
                for(const wall of z.walls){
                    if(getIntersection(wTest[0].pos, wTest[1].pos, wall[0].pos, wall[1].pos)){
                        player.onHurt();
                    }
                }
            }
        })
    }


    player.pos.x += player.vel.x;
    player.pos.y += player.vel.y;
    // show gun sights
    const end = rayAtDir(playerCenter, getAngle(playerCenter.pos, VecAdd(i.mouse, camera.pos)));
    let res;
    player.canHit = false;
    for(const enemy of Object.values(enemies)){
        res = sendRay(end, playerCenter, enemy.walls);
        player.canHit=res != end.pos
        if(player.canHit){player.canHit = enemy;break;}
    }

    if(player.canHit != false){
        drawWall({pos: VecSub(playerCenter.pos, camera.pos)}, {pos: VecSub(res, camera.pos)}, 0);
    }else{
        const intersection = sendRay(end, playerCenter, walls);
        drawWall({pos: VecSub(playerCenter.pos, camera.pos)}, {pos: VecSub(intersection, camera.pos)}, 1);
    }

}

player.onHurt = function(){
    bloodSPLAT(player.pos, 30, 50, "blue");
    player.canHit = false;
    setTimeout(player.canHit = true, 500);
}

//cast rays to points
function visibilityCalc(){
    const playerCenter = {pos:{x: player.pos.x + player.scale.x/2, y: player.pos.y + player.scale.y/2}};
    const res = [];
    const poly = mapPolygon.flat(1);
    poly.forEach(p => {
        res.push(sendRay(p, playerCenter, walls));
        res.push(sendRay(rayAtDir(playerCenter, getAngle(playerCenter.pos, p.pos) + 0.01), playerCenter, walls));
        res.push(sendRay(rayAtDir(playerCenter, getAngle(playerCenter.pos, p.pos) - 0.01), playerCenter, walls));
    })

    // res.forEach((p) => {
    //     ctx.save();
    //     added = true;
    //     ctx.fillStyle = "green";
    //     ctx.fillRect(p.x, p.y, 10, 10);
    //     ctx.restore();
    // })
    return res;
}

function rayAtDir(start, dir){
    const len = 10000;
    const end = structuredClone(start);
    end.pos.x += len * Math.cos(dir);
    end.pos.y += len * Math.sin(dir);
    // ctx.beginPath();
    // ctx.moveTo(start.pos.x, start.pos.y);
    // ctx.lineTo(end.pos.x, end.pos.y);
    // ctx.closePath();
    // ctx.stroke();
    return end;
}

function getAngle(a, b){
    return Math.atan2(b.y - a.y, b.x - a.x)
}

function sendRay(point, start, walls){

    let bestDist = dist(start.pos, point.pos)
    let bestPoint = point.pos;
    let added = false;
    walls.forEach((checkwall, index) => {
        const intersection = getIntersection(start.pos, point.pos, checkwall[0].pos, checkwall[1].pos);
        if(intersection){
            //ctx.fillRect(intersection.x, intersection.y, 10, 10);
            const d = dist(start.pos, intersection);
            if(d < bestDist){
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
player.vel = {x: 0, y:0};

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

function bloodSPLAT(pos, oomph, size, color="red"){
    if(size == 0){return;}
    // spawn BLOOD!
    ctx.fillStyle = "red";
    ctx.fillRect
    for(let n = 0; n <= size; n++){
        const dropPos =  {x: gaussianRandom(pos.x, oomph),y: gaussianRandom(pos.y, oomph)};
        let bloodTaken = false;
        for(const well of bloodWells){
            if(dropPos.x > well.pos.x && dropPos.x < well.pos.x + well.scale.x && dropPos.y > well.pos.y & dropPos.y < well.pos.y + well.scale.y){
                bloodTaken = true
                well.sprite.value += 1/size;
                break;
            }
        }
        if(!bloodTaken){
            game.addStaticActor(Math.random(), new BoxGeometry(10, color), 
            dropPos, {group: "points"});
        }

    }
}

i.onMouseDown(function (e) {
    points.push(game.addStaticActor(Math.random(), new BoxGeometry(10, "white"), VecAdd(i.mouse, camera.pos), {group: "points"}));
    if(player.canHit){
        player.canHit.onHurt();
    }
    camera.shake(25)
})

i.onKeyPressed("space", function(){
    drawing = true;
    const newP = jarvisSort(points);
    mapPolygon.push(newP);
    genWalls(newP);
    points = [];
})

i.onKeyPressed("q", function(){
    drawing = true;
    mapPolygon.push(points);
    genWalls(points);
    points = [];
})

function checkInput(){
    const res = {x: 0, y: 0};
    if(i.keys["w"]){
        res.y -= 8;
    }
    if(i.keys["s"]){
        res.y += 8;
    }
    if(i.keys["a"]){
        res.x -= 8;
    }
    if(i.keys["d"]){
        res.x += 8;
    }
    return res;
}

i.onKeyPressedRepeat("a", function() {
    player.vel.x = 8;
})

i.onKeyPressedRepeat("d", function() {
    player.vel.x =8;
})

i.onKeyPressedRepeat("w", function() {
    player.vel.y =8;
})

i.onKeyPressedRepeat("s", function() {
    player.vel.y =8;
})

i.onKeyPressed("f", () => {
    startSpawn();
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

function drawPolygon(points, camera, fill){
    if(points.length == 0) return;
    ctx.save();
    ctx.strokeStyle = "red";
    ctx.fillStyle = fill
    ctx.beginPath();
    ctx.moveTo(points[0].pos.x - camera.pos.x, points[0].pos.y- camera.pos.y);

    points.forEach((p, i) => {
        if(i == 0){return;}

        ctx.lineTo(p.pos.x - camera.pos.x, p.pos.y - camera.pos.y);
    })
    ctx.lineTo(points[0].pos.x - camera.pos.x, points[0].pos.y - camera.pos.y);
    if(fill){
        ctx.fill();
    }

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

function drawTri(a,b,c, camera={x:0,y:0}){

    ctx.moveTo(a.x - camera.x, a.y - camera.y);  // Move to point a
    ctx.lineTo(b.x - camera.x, b.y - camera.y);  // Draw a line to point b
    ctx.lineTo(c.x - camera.x, c.y - camera.y);  // Draw a line to point c

}

function drawLight(origin, points, camera){
    if(points.length == 0) return;
    points = points.sort((a, b) => getAngle(a, origin) - getAngle(b, origin));
    ctx.save()

    ctx.beginPath();  // Start a new path
    points.forEach((p, i) => { 
        if(i == 0){
            return
        }
        drawTri(origin, points[i - 1], p, camera.pos);

    });
    drawTri(origin, points[0], points[points.length - 1], camera.pos);

    if(filling){
        ctx.clip();
    }
    ctx.closePath();  // Close the path to create a triangle

}

const floor = document.createElement("canvas");
floor.width = 50;
floor.height = 50;
const fCtx = floor.getContext("2d");
//fCtx.fillStyle = "#696969";
fCtx.fillStyle = "rgb(10, 10, 10)";
fCtx.strokeStyle = "rgb(15, 15, 15)";
fCtx.lineWidth = 5;
fCtx.strokeRect(0, 0, floor.width, floor.height);
fCtx.fillRect(0, 0, floor.width - 5, floor.height - 5);
const floorPattern = ctx.createPattern(floor, "repeat");


function addZombie(){
    const zombie = game.addActor("z" + Math.random(),new polygon([{x: 0, y: 0}, {x: 50, y: 0}, {x: 50, y: 50}, {x: 0, y: 50}]));
    zombie.sprite.color = "green";
    zombie.pos = {x: randInRange(0, canvas.width), y: randInRange(0, canvas.height)};
    zombie.t = 0;
    zombie.ogPos = structuredClone(zombie.pos)
    zombie.walls = structuredClone(zombie.sprite.walls);
    zombie.maxHealth = 3;
    zombie.health = 3;
    zombie.onUpdate = function(){
        if(zombie.health <= 0){return;}
        zombie.sprite.walls.forEach((w, i) => {
            zombie.walls[i] = [{pos:VecAdd(w[0].pos, zombie.pos)}, {pos: VecAdd(w[1].pos, zombie.pos)}];
        })
        zombie.pos = vecLerp(zombie.ogPos,player.pos, zombie.t, bounceOut);
        if(zombie.t < 1){
            zombie.t += 0.001;
        }
        if(zombie.health == 0){
            game.destroy(zombie);
        }
        // bleed effect
        if(Math.random() < 0.06){
            bloodSPLAT(zombie.pos, 15 * (zombie.maxHealth - zombie.health), 15 * (zombie.maxHealth - zombie.health));
        }
    }

    zombie.onHurt = function(){
        bloodSPLAT(zombie.pos, 10 + (20 * (zombie.maxHealth - zombie.health)), 80 + (50 * (zombie.maxHealth - zombie.health)));
        zombie.health -= 1;
        if(zombie.health <= 0){
            zombie.sprite.color = "darkgreen";
            delete enemies[zombie.name];
            return;
        }
    }
    return zombie
}

function addSpeedyZombie(){
    const zombie = game.addActor("z" + Math.random(),new polygon([{x: 0, y: 0}, {x: 50, y: 0}, {x: 50, y: 50}, {x: 0, y: 50}]));
    zombie.sprite.color = "green";
    zombie.pos = {x: randInRange(0, canvas.width), y: randInRange(0, canvas.height)};
    zombie.t = 0;
    zombie.ogPos = structuredClone(zombie.pos)
    zombie.walls = structuredClone(zombie.sprite.walls);
    zombie.maxHealth = 1;
    zombie.health = 1;
    zombie.onUpdate = function(){
        if(zombie.health <= 0){return;}
        zombie.sprite.walls.forEach((w, i) => {
            zombie.walls[i] = [{pos:VecAdd(w[0].pos, zombie.pos)}, {pos: VecAdd(w[1].pos, zombie.pos)}];
        })
        zombie.pos = vecLerp(zombie.ogPos,player.pos, zombie.t, bounceOut);
        if(zombie.t < 1){
            zombie.t += 0.005;
        }else{
            zombie.onHurt();
        }
        // bleed effect
        bloodSPLAT(zombie.pos, 20, 40);
    }

    zombie.onHurt = function(){
        bloodSPLAT(zombie.pos, 100, 200);
        zombie.health -= 1;
        if(zombie.health <= 0){
            zombie.sprite.color = "darkgreen";
            delete enemies[zombie.name];
            return;
        }
    }
    return zombie
}


function startSpawn(){
    setInterval(function(){const z = addZombie();enemies[z.name] = z}, 1000);
}
const enemies = {};
let lightsOn = true;
function update(){
    // check wells
    let wellsFilled = true;
    console.log(bloodWells)
    for(let well of bloodWells){
        if(well.sprite.value < well.sprite.max){
            wellsFilled = false;
            break;
        }
    }
    
    if(wellsFilled){
        lightsOn = false;
    }


    ctx.fillStyle = "rgb(0, 0, 0)"
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    if(drawing){
        mapPolygon.forEach((p, i) => {
            if(i == 0){
                drawPolygon(p, camera, false);
                return;
            }
            drawPolygon(p, camera, "black");
        })
        // draw light sets a clipping mask till we calls ctx.restore
        drawLight({x: player.pos.x + player.scale.x/2, y: player.pos.y + player.scale.y/2}, visibilityCalc(), camera);
        ctx.fillStyle = floorPattern;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        game.drawStatics();
        game.update(true, false);
        if(lightsOn){
            ctx.fillStyle = "rgba(255, 255, 0, 0.1)";
            ctx.fillRect(0, 0, canvas.width, canvas.height);
    
            ctx.fillStyle = "rgba(0, 0, 0, 0.3)";
            ctx.fillRect(0, 0, canvas.width, canvas.height);
        }

    }
    ctx.restore();
    window.requestAnimationFrame(update);
}

update();
