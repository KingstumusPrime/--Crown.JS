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

The quickest way to get started is to read the (documentation)[] or look at the (sample projects)[]

### Executing the OS

* run the ./qemu.sh command in the root of the project to boot the operating systems iso automatically
* To manually run the Operating System try:
```
qemu-system-i386 -m 4G -cpu max -cdrom ./path/to/the/OS.iso -boot order=dc -drive file=disc.img,media=disk  -no-shutdown -no-reboot
```

## Building

In order to build this project you will first need the custom GCC toolchain found in the releases of this repo here [RealOS Custom toolchain](https://github.com/KingstumusPrime/RealOs-Custom-Toolchain/releases/tag/Release). After that you need to run:
```
export PATH="$HOME/path/to/realOS/toolchain/bin:$PATH"
```
Once you have ran this command you should be able to simply us the build and clean scripts included in this project. If you wish to write code to run on the Operating System you also need to use the custom toolchain in place of standard GCC.
