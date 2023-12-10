class Pacman extends Game {

    constructor(canvas) {
        super(canvas);
        this.player = new Player("img/pacman.png", 20)
    }

    init() {
        super.init();
    }

    update(ticks) {
        super.update(ticks);
    }

    draw() {
        super.draw();
    }

    reset() {
        super.reset();
    }

}

let game = new Pacman(document.getElementById("canvas"));

game.run();
