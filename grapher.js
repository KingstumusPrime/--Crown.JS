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

// function sets the current tween function
function setFunc(f){
    funcToTest = f;
    // game.offCtx is the canvas for static actors so this will clear all static actors
    game.offCtx.clearRect(0, 0, canvas.width, canvas.height);
    boxList = [];
    // reset player pos
    player.pos = {x: 0 - 50, y : window.innerHeight/2};
    // create a new tween from zero to window.innerWidth/2. When its done alert("DONE")
    tTest = new TWEEN(0, window.innerWidth/2, function(v, t) {
        player.pos.x = v;
        boxList.push(game.addStaticActor(Math.random(), new BoxGeometry(10), {x: boxList.length * 10, y: 200 - t * 100}))
    }, funcToTest, () => {alert("DONE")});
}

// combination of the player and graph
i.onKeyPressed("space", () => {
    game.offCtx.clearRect(0, 0, canvas.width, canvas.height);
    boxList = [];
    player.pos = {x: 0 - 50, y : window.innerHeight/2};
    tTest = new TWEEN(0, window.innerWidth/2, function(v, t) {
        player.pos.x = v;
        boxList.push(game.addStaticActor(Math.random(), new BoxGeometry(10), {x: boxList.length * 10, y: 200 - t * 100}));
    }, funcToTest);
    
})

// move somthing to the tween
i.onKeyPressed("c", () => {
    player.pos = {x: 0 - 50, y : window.innerHeight/2};
    tTest = new TWEEN(0, window.innerWidth/2, function(v, t) {
        player.pos.x = v;
    }, funcToTest);
    
})

// draw the tween
i.onKeyPressed("z", () => {
    game.offCtx.clearRect(0, 0, canvas.width, canvas.height);
    boxList = [];
    tTest = new TWEEN(0, window.innerWidth/2, function(v, t) {
        boxList.push(game.addStaticActor(Math.random(), new BoxGeometry(10), {x: boxList.length * 10, y: 200 - t * 100}))
    }, funcToTest);    
})

// apply the tween to the camera
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
