# 👑 Crown.JS 👑

A JavaScript library that simplifies the creation of canvas games

## Description

I went through a phase of creating tons of little canvas games in JavaScript. I had noticed that I had reused tons of code with each game, so I had created Crown.JS to streamline this process. Aside from quicker game creation, I also gave Crown.JS a couple of features like smooth cameras (with shake) and TWEENs in order to give canvas games the same level of fluidity experienced by games made in professional engines.

## Features

* Smooth movement through TWEENs
* Three different sample projects
* Easily expandable object-oriented design
* Dynamic camera with shake
* Culling of objects outside the camera
* Support for "static" objects that are only drawn one time
* Easy handling of JavaScripts and more tedious things such as initialization or rendering. 

## Getting Started

This is one easy header just take the crown.js file from the root directory and add it to your project.

### Learning guide

The quickest way to get started is to read the [documentation]() or take a look at the [sample projects]()

### Quickstart

* First thing you need to do get your canvas and context. After that you can create an input controller that will handle all of your keybaord input in the project
```
const canvas = document.querySelector("#game");
const ctx = canvas.getContext("2d");
const i = new InputController();
```
* Once you have these three things you can create the game object. This game object handles the rendering, camera, and adding objects
```
const game = new Game(canvas, ctx, i);
```
* Now you need to call the games update methoud in a loop like like this:
```
function update(){
    game.update();
    window.requestAnimationFrame(update);
}
```
* From there you can set up a input system with onKeyPressed() and onKeyPressedRepeat(). Or you could try to set up your game world with addActor() and addStaticActor()

## Example Projects
### Inversion: 

Originally created in [Scratch](https://scratch.mit.edu/projects/571692328/) and featured on the news by Hour Of Code. It is definitely the best example project to start with and probably the cleanest. It can be found in index.html and main.js

### grapher.js

This was created as a way to showcase the smooth movement functionality of Crown.JS. Its source code is in grapher.html and grapher.js.

### spacegame

A little test put together to push Crown.JS to its limits. With completly dynamic graphics it shows how you can blend your own custom code with Crown.JS. While its not the best example of using Crown.JS to guide your project is a func little demo I coded up and had a lot of fun making.

## Documentation

This documentation was created to outline Crown.JS and all of its features. This is more of a reference guide. If you are looking to quick start look at [getting started]() or [example projects]().

### The Game Object

class Game(HTMLCanvas canvas, HTMLCanvasContexet2d ctx, [InputController]() input)

#### properties
* canvas : the canvas passed too the constructor
* ctx : the ctx pass too the constructor
* tweenList : a list of all active tweens
* backgroundColor : A string that defines the background color of the canvas
* offScreenCanvas : the canvas that static actors are drawn to. Created with the Game object
* offCtx : the ctx of game.offScreenCanvas
* input : the [InputController]() passed to the game
* camera : The [Camera]() object for the game. Created with the Game object

#### Methouds
##### addActor
Add Actor creates a new actor and automatically will start rendering it. Extra parameters can be passed through params such as: Bool "bottom" (renders sprite below others) and String "group" (sets the group for that actor) 
```
void addActor(String name, [Sprite]() sprite, Object params={})
```

#### addStaticActor
Similar to add actor this draws the actor to the offScreenCanvas. It can be used for things like background images or other static things. 
```
void addStaticActor(String name, [Sprite]() sprite, [Vector Object]() pos, Object params={})
```

#### findActor
Finds an actor by name
```
[Actor]() findActor(String name)
```

#### update
The update function must be called every frame and is the foundatation for Crown.JS
```
void update()
```

##### destroy
This function should be used to remove a actor from the game world
```
void destroy([Actor]() Object)
```

#### pauseInput
pauseInput disables the game's input temporarily.  The sister function of resumeInput()
```
void pauseInput()
```

#### resumeInput
resumeInput re-enables the game's input.  The sister function of pauseInput()
```
void resumesInput()
```

#### destroyGroup
This function calls destroy() for every single actor in a group.
```
void destroyGroup(String group)
```

#### addToGroup
This function allows you to add an actor to an existing group
```
void addToGroup(String group, [Actor]() actor)
```

#### getGroup
This function allows you get every single actor in a group
```
[Actor]()[] getGroup(String name)
```

#### addTween
Creates a [TWEEN]() that will be automatically updated. The recomended way to handle TWEENs
```
void addTween(double start, double end, [TWEEN algorithm]() algo, void function endFunc, double speed) 
```
