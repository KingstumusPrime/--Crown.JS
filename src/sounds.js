class Sound{
    constructor(src, loop=false, onFinished=undefined){

        this.sound = new Audio(src);
        this.sound.loop = loop;
        if(typeof onFinished === "function"){
            this.sound.addEventListener("ended", function (){
                onFinished();
            });
        }
    }

    play(){
        const playPromise = this.sound.play();
        if (playPromise !== undefined) {
            playPromise.then(function() {
              // Automatic playback started!
            }).catch(function(error) {
                console.log(error)
              // Automatic playback failed.
              // Show a UI element to let the user manually start playback.
            });
        }
    }

    pause(restart=false){
        this.sound.pause();
        if(restart){
            this.sound.currentTime = 0;
        }
    }

}