// get canvas
const canvas = document.querySelector("#game");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
const ctx = canvas.getContext("2d");

const i = new InputController()


const game = new Game(canvas, ctx, i);
const camera = game.camera;
const player = game.addActor("player", new BoxGeometry(100), {});
player.pos = {x: 0 - 50, y : window.innerHeight/2};

let funcToTest = constantSpeed;
var tTest = new TWEEN(0, window.innerWidth/2, function(v, t) {
    player.pos.x = v;
    boxList.push(game.addStaticActor(Math.random(), new BoxGeometry(10), {x: boxList.length * 10, y: 200 - t * 100}))
}, funcToTest, () => {alert("DONE")});
let boxList = [];

let camTween;

function setFunc(f){
    funcToTest = f;
    game.offCtx.clearRect(0, 0, canvas.width, canvas.height);
    boxList = [];
    player.pos = {x: 0 - 50, y : window.innerHeight/2};
    tTest = new TWEEN(0, window.innerWidth/2, function(v, t) {
        player.pos.x = v;
        boxList.push(game.addStaticActor(Math.random(), new BoxGeometry(10), {x: boxList.length * 10, y: 200 - t * 100}))
    }, funcToTest, () => {alert("DONE")});
}


i.onKeyPressed("space", () => {
    
    game.offCtx.clearRect(0, 0, canvas.width, canvas.height);
    boxList = [];
    player.pos = {x: 0 - 50, y : window.innerHeight/2};
    tTest = new TWEEN(0, window.innerWidth/2, function(v, t) {
        player.pos.x = v;
        boxList.push(game.addStaticActor(Math.random(), new BoxGeometry(10), {x: boxList.length * 10, y: 200 - t * 100}));
    }, funcToTest);
    
})

i.onKeyPressed("c", () => {
    player.pos = {x: 0 - 50, y : window.innerHeight/2};
    tTest = new TWEEN(0, window.innerWidth/2, function(v, t) {
        player.pos.x = v;
    }, funcToTest);
    
})

i.onKeyPressed("z", () => {
    game.offCtx.clearRect(0, 0, canvas.width, canvas.height);
    boxList = [];
    tTest = new TWEEN(0, window.innerWidth/2, function(v, t) {
        boxList.push(game.addStaticActor(Math.random(), new BoxGeometry(10), {x: boxList.length * 10, y: 200 - t * 100}))
    }, funcToTest);    
})

i.onKeyPressed("x", () => {
    camTween = new TWEEN(camera.pos.x, i.mouse.x, (v, t) => {
        camera.target.x = v;
        camera.pos.x = v;
    }, funcToTest)
})


function update(){
    game.update();
    tTest.step();
    if(camTween){
        camTween.step();
    }
    window.requestAnimationFrame(update);
}

update();