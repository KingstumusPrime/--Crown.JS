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
* Now you need to call the games update method in a loop like like this:
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

class Game(HTMLCanvas canvas, CanvasContext2d ctx, [InputController]() input)

The Game object is the foundatation for Crown.JS and mainly exists to render and create actors.

#### properties
* canvas : the canvas passed too the constructor
* ctx : the ctx pass too the constructor
* tweenList : a list of all active tweens
* backgroundColor : A string that defines the background color of the canvas
* offScreenCanvas : the canvas that static actors are drawn to. Created with the Game object
* offCtx : the ctx of game.offScreenCanvas
* input : the [InputController]() passed to the game
* camera : The [Camera]() object for the game. Created with the Game object

#### Methods
##### addActor
Add Actor creates a new actor and automatically will start rendering it. Extra parameters can be passed through params such as: Bool "bottom" (renders sprite below others) and String "group" (sets the group for that actor) 
```
void addActor(String name, Sprite sprite, Object params={})
```

#### addStaticActor
Similar to add actor this draws the actor to the offScreenCanvas. It can be used for things like background images or other static things. 
```
void addStaticActor(String name, Sprite sprite, [Vector Object]() pos, Object params={})
```

#### findActor
Finds an actor by name
```
Actor findActor(String name)
```

#### update
The update function must be called every frame and is the foundatation for Crown.JS
```
void update()
```

##### destroy
This function should be used to remove a actor from the game world
```
void destroy(Actor Object)
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
void addToGroup(String group, Actor() actor)
```

#### getGroup
This function allows you get every single actor in a group
```
Actor[] getGroup(String name)
```

#### addTween
Creates a [TWEEN]() that will be automatically updated. The recomended way to handle TWEENs
```
void addTween(double start, double end, TWEEN algorithm() algo, void function endFunc, double speed) 
```

### The Actor Object

class Actor(String name, [Sprite]() sprite, CanvasContext2d ctx)

The actor represents a [Sprite]() with a position and scale. It should not be created without using [addActor]()

#### properties
* name : the name of the sprite
* sprite : the [Sprite]() tied to this actor
* pos : a [Vector Object]() with x and y properties
* rot : the rotation of the actor
* scale : a [Vector Object]() with x and y properties
* culled : this value is read-only and can be used to tell if the actor is being rendered

#### Methods

#### scaleBy
scales the sprite by n times. Good because it updates both the sprites scale and the scale used for collisions 
```
void scaleBy(double n) 
```

#### onUpdate
Called every single frame. Has not body and is meant to be overidden
```
void onUpdate() 
```
#### onSpriteLoaded
Similar to onUpdate() it is meant to be overidden. Called when the sprite is loaded. It is not recomended to modify the sprite at all before onSpriteLoaded is called.
```
void onSpriteLoaded()
```
#### onCreate
This function in f will be called instantally and is more for looks than anything
```
onCreate(function f)
```

### The Sprite Object

The Sprite object is not technically an object instead it is defined by having a render function.
#### properties
* loaded : a boolean value of whether or not its loaded
* opacity : the opacity of the sprite
* scale : the scale of the sprite. Should match with the actor for proper collision

#### varations

#### BoxGeometry
```
BoxGeometry(double scale, String color="black")
```
##### extra properties:
* color : a string the color

#### RectGeometry
```
RectGeometry(double x, double y, String color="black")
```
##### extra properties:
* color : a string the color
* rot : the rotatation of the rect

#### Line
```
Line(double length, double width)
```
##### extra properties:
* color : a string the lines color (default black)
* end : the end of the line (stored as a [Vector Object]())
* start : the start of the line (stored as a [Vector Object]())
* rot : the rotation of the line
* length : length of a line
* width : width of a line

#### CircleGeometry
```
CircleGeometry(double scale, String color="black")
```
##### extra properties:
* color : a string of the circles color

#### Sprite
```
Sprite(String src, Vector Object scale)
```
##### extra properties:
* img : the image object tied to the sprite
* rot : the rotatation of the sprite

### The InputController

class InputController()

The input controller is meant to handle keyboard and mouse controls in your project

#### properties
* paused : a boolean value of whether the input will trigger events
* mouse : a vector object of the mouse

#### Methods

#### onMouseDown
the function f will be called every click
```
void onMouseDown(function f) 
```

#### onMouseMove
A function meant to be overridden. Called every time the mouse moves
```
void onMouseMove()
```

#### onKeyPressed
Creates a an event and calls the function f every time the key gets pressed
```
void onKeyPressed(String key, function f)
```

#### onKeyPressedRepeat
Creates a an event and calls the function f every frame where the key is down
```
void onKeyPressedRepeat(String key, function f)
```

#### clearKey
Removes the keypress event tied to the key
```
void clearKey(String key)
```

#### clearKeys
Calls clearKey() for an array of keys
```
void clearKeys(String[] keys)
```

### The Camera object

The Camera Object is automatically created by the [game]() and can be accessed through game.camera

#### properties
* pos : a read-only [Vector Object]() that shows the current position of the camera
* target : a [Vector Object]() that holds the target that the camera will move towards
* dampening : how fast the shaking stops (default 3)
* drag : how fast the camera moves towards the target (default 0.3)
* culling : boolean of whether the camera will hide actors outside the view of the camera

#### Methods

#### shake
Shakes the camera
```
void shake(double strength)
```

### The Sound object

The Camera Object is automatically created by the [game]() and can be accessed through game.camera

#### properties
* pos : a read-only [Vector Object]() that shows the current position of the camera
* target : a [Vector Object]() that holds the target that the camera will move towards
* dampening : how fast the shaking stops (default 3)
* drag : how fast the camera moves towards the target (default 0.3)
* culling : boolean of whether the camera will hide actors outside the view of the camera

#### Methods

#### shake
Shakes the camera
```
void shake(double strength)
```

