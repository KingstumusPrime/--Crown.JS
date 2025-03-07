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
Originally created in [Scratch](https://scratch.mit.edu/projects/571692328/) and featured on the news by Hour Of Code. It is definitely the best example project to start with and probably the cleanest.

## Documentation

In order to build this project you will first need the custom GCC toolchain found in the releases of this repo here [RealOS Custom toolchain](https://github.com/KingstumusPrime/RealOs-Custom-Toolchain/releases/tag/Release). After that you need to run:
```
export PATH="$HOME/path/to/realOS/toolchain/bin:$PATH"
```
Once you have ran this command you should be able to simply us the build and clean scripts included in this project. If you wish to write code to run on the Operating System you also need to use the custom toolchain in place of standard GCC.
