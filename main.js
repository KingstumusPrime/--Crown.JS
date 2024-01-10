// WISHILIST
// one include to rule them all!
// streamline the update function
// actually asset loading!
// battle testing in a jam of some sorts
// physics!
// particles
// vector tween!
// spritesheets

// get canvas
const canvas = document.querySelector("#game");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
const ctx = canvas.getContext("2d");

const i = new InputController()

// sound loading
const switchSound = new Sound("./assets/switch.wav");
const themeSong = new Sound("./assets/theme.wav", true);
const jump = new Sound("./assets/jump.wav");
const oops = new Sound("./assets/Oops.wav")
const end = new Sound("./assets/End.wav", true)


themeSong.play();

const game = new Game(canvas, ctx, i);
let ground = game.addStaticActor("helloAStaticWorld", new Sprite("./assets/ground.svg", {x:window.innerWidth * 1.01, y: 129}), {x:window.innerWidth * -0.005, y: canvas.height - 129});

const player = game.addActor("helloWorld", new Sprite("./assets/player.svg", {x:80, y: 80}));
player.onCreate(()=>{
    player.vx = 0;
    player.vy = 0;
    player.onGround = false;
    player.pos.x += 256;
})

const scoreDiv = document.querySelector("#score");
const menu = document.querySelector("#mainMenu");
const playAgain = document.querySelector("#playAgain");
const scoreText = document.querySelector("#finScore");




// create score
addPointer("score", 0, function(val) {
    scoreDiv.innerText = numWithLength(val, 3);
    if(score%5 == 0 && score > 0){
        switchSound.play();
        invert = !invert;
    }
})

// create invert
addPointer("invert", false, function(val) {
    player.sprite.img.src = `./assets/player${val? " inverted" : ""}.svg`;
    game.backgroundColor = val ? "black" : "white";
    game.offCtx.clearRect(0, 0, canvas.width, canvas.height);
    ground = game.addStaticActor("helloAStaticWorld", new Sprite(`./assets/ground${val? "i" : ""}.svg`, {x:window.innerWidth * 1.01, y: 129}), {x:window.innerWidth * -0.005, y: canvas.height - 129});
    document.body.style.setProperty('--text-color', invert ? "white" : "black");
    document.body.style.setProperty('--bg-color', invert ? "black" : "white");
})



console.log(playAgain)
playAgain.onclick = function(){
    new Sound("./assets/Coin.wav", false).play();
    setTimeout(() => {
        new Sound("./assets/Coin.wav", false).play();
        setTimeout(() => {
            new Sound("./assets/Coin.wav", false).play();
            setTimeout(() => {
                score = 0;
                // re show all sprites
                game.updaters.forEach(u => {
                    u.sprite.opacity = 1;
                })
                scoreDiv.style.opacity = 100 + "%";
                game.resumeInput();
                game.destroyGroup("cars");
                gameOver = false;
                
                game.ctx.globalAlpha = 1;
                menu.style.display = "none";
                themeSong.play();
                end.pause(true);
            }, 500)

        }, 500)
    }, 500)

};

let gameOver = false;

// player code
player.onUpdate = () => {
    player.pos.y += player.vy;
    player.onGround = actorsCollides(player, ground)
    if(!player.onGround){
        player.vy += 1;
    }else{
        player.vy = 0;
        // put player on ground
        player.pos.y = ground.pos.y - player.scale.y;
    }
    //check car collisions
    game.getGroup("cars").forEach(car => {
       if(actorsCollides(player, car) && !gameOver){
            game.pauseInput();
            gameOver = true;
            game.camera.shake(100);
            oops.play();
            invert = false;
            scoreText.innerText = "score: " + numWithLength(score, 3);
            game.addTween(1, 0, (v, t) => {
                game.updaters.forEach(u => {
                    u.sprite.opacity = v;
                })
                scoreDiv.style.opacity = v * 100 + "%";
                game.ctx.globalAlpha = v;
            }, easeOutQuint, () => {menu.style.display = "block"; themeSong.pause(true); end.play()});
       } 
    });
}

i.onKeyPressedRepeat("space", () => {
    if(player.onGround){
        player.vy = -20;
        jump.play();
    }

})

i.onKeyPressedRepeat("w", () => {
    game.camera.target.y -= 10;
})
i.onKeyPressedRepeat("a", () => {
    game.camera.target.x -= 10;
})
i.onKeyPressedRepeat("s", () => {
    game.camera.target.y += 10;
})
i.onKeyPressedRepeat("d", () => {
    game.camera.target.x += 10;
})


i.onKeyPressedRepeat("z", () => {
    game.camera.shake(Math.random() * 100);
})
const carNames = ["board", "car", "cool car", "unicycle"];
function addCar(){
    const myCar = game.addActor("car" + Math.random(), new Sprite(`./assets/cars/${randFromArr(carNames)}${invert ? " inverted" : ''}.svg`),  {group: "cars"});
    myCar.onSpriteLoaded = () => {
        myCar.scaleBy(1.3);
        myCar.pos.y = ground.pos.y - myCar.scale.y;
        myCar.pos.x = canvas.width + myCar.scale.x;

        myCar.onUpdate = function() {
            if(!gameOver){
                myCar.pos.x -= 15;
                if(myCar.pos.x + myCar.scale.x <= 0){
                    score += 1;
                    game.destroy(myCar);
                }
            }

        }
    }

}

function startCars(){
    if(!gameOver){
        addCar();
    }

    // set interval for next
    window.setTimeout(startCars, randInRange(1000, 1500));
}

function update(){
    game.update();
    window.requestAnimationFrame(update);

}


const tween = new TWEEN(0, 1, function(v, t) {
    console.log(v + " at t of: "+ t);
}, constantSpeed);

startCars();
update();