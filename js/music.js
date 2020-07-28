class music {
    constructor(name) {
        this.audio = new Audio();
        this.load(name);
    }
    load(name) {
        this.audio.src = `../mp3/${name}.mp3`;
    }
    play() {
        if (this.audio.readyState === 4) {
            this.audio.play();
        }
    }
    pause() {
        this.audio.pause();
    }
}
export default music;