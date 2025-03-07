let CROWN_RANDOM_FUNC = Math.random;

function actorsCollides(act1, act2){
    return act1.pos.y + act1.scale.y > act2.pos.y && act1.pos.y < act2.pos.y + act2.scale.y
    && act1.pos.x + act1.scale.x > act2.pos.x && act1.pos.x < act2.pos.x + act2.scale.x;
}


function VecSub(v1, v2){
    return {x: v1.x - v2.x, y: v1.y - v2.y};
}

function randFromArr(arr){
    return arr[randInRange(0, arr.length)];
}

function randInRange(min, max){
    return Math.floor(CROWN_RANDOM_FUNC() * (max - min)) + min;
}

function randFloatInRange(min, max){
    return CROWN_RANDOM_FUNC() * (max - min) + min;
}

// creates a variable of name with a on update event
function addPointer(name, value, onChange){
    this[value + "@#$tbgxjktdhivyo drgtrhyuj"] = value;
    Object.defineProperty(this, name, {
        get: function () { return this[value + "@#$tbgxjktdhivyo drgtrhyuj"]; },
        set: function (v) {
            this[value + "test"] = v;
            this[value + "@#$tbgxjktdhivyo drgtrhyuj"] = v;
            onChange(v);
        }
    });
}

// cleans number like this 10 = 010 or 1000 = 00001000 ect...
function numWithLength(num, len){
    return "0".repeat(len - num.toString().length) + num;
}


function lerp(a, b, t){
    return a + (b-a)*t;
}


class TWEEN {
    constructor(start, end, func, algo, afterFunc=undefined, rate=0.01){
        this.t = 0;
        this.start = start;
        this.end = end;
        this.func = func;
        this.algo = algo;
        this.finished = false;
        this.afterFunc = afterFunc;
        this.rate = rate;
    }

    step(){
        if(!this.finished){
            if(this.t < 1){
                this.t += this.rate; 
                const fixedT = this.algo(this.t);
                // lerp the values
                const v = lerp(this.start, this.end, fixedT);
                // call the user defined function
                this.func(v, fixedT);
                // use a built in or user defined function to modify t
                // example ease in, elastic, constantRate, whatever else i add

                
            }else if(!this.finished){
                this.finished = true;
                if(typeof this.afterFunc === "function"){
                    this.afterFunc();
                }
    
            }
        }

    }
}
// tween function
// credit to simon dev for most of the math: https://www.youtube.com/watch?v=YJB1QnEmlTs
function constantSpeed(t){
    return t;
}

function squared(t){
    return t*t;
}

function easeInCubic(t){
    return t*t*t;
}

function squareRoot(t){
    return Math.sqrt(t);
}

function quadEaseOut(t){
    return 1 - (1 - t) * (1 - t);
}

function parabola(t){
    return Math.pow(4 * t * (1 - t), 4)
}

function triangle(t){
    return 1 -2 * Math.abs(t - 0.5);
}

function elasticOut(t){
    return Math.sin(-13 * (t + 1) * (Math.PI/2)) * Math.pow(2, -10 * t) + 1;
}

function bounceOut(t){
    const nl  = 7.5625;
    const dl = 2.75;
    if(t < 1/dl){
        return nl * t * t;
    }else if (t < 2/dl){
        t -= 1.5/dl;
        return nl * t * t + 0.75;
    } else if (t < 2.5/dl){
        t -= 2.25/dl;
        return nl * t * t + 0.9375;
    } else{
        t -= 2.625 / dl;
        return nl * t * t + 0.984375;
    }
}

function smoothstep(t){
    return lerp(squareRoot(t), squared(t), t);
}

function easeOutQuint(t){
    return 1 - Math.pow(1 - t, 5);
}

function easeInBounce(t){
    return 1 - bounceOut(1-t);
}

function elasticIn(t){
    return 1 - elasticOut(1-t);
}
