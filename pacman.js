class Pacman extends Game {

    constructor(canvas) {
        super(canvas);
        this.player = new Player(new ImageEntity("img/pacman.png"), 10)
    }

    init() {
        super.init();
    }

    update() {
        super.update();
        if (this.frameCount % 50 === 0) {
        }
    }

    draw() {
        super.draw();
    }

    reset() {
        super.reset();
    }

}

// class Snake extends SnakeBase {
    
//     update() {
//         super.update();
//         let x = this.head.x;
//         let y = this.head.y;

//         let food = this.game.food;
//         for(let i = 0; i < food.length; i++) {
//             if (x == food[i].x && y == food[i].y) {
//                 food.splice(i, 1);
//                 return super.addSegment();
//             }
//         }
//     }
// }

let game = new Pacman(document.getElementById("canvas"));

// game.snake = new Snake(game);

game.run();
