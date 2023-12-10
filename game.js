class Game {
    constructor(canvas) {
        this.canvas = canvas;
        this.context = canvas.getContext("2d");
        this.frameRate = 60;
        this.frameCount = 0;
        this.ticks = 0.4;
        this.level = new Level(this);
        this.player = new Player();
    }


    // drawSegment(x, y, color) {
    //     this.context.fillStyle = color;
    //     this.context.fillRect(this.tileSize.x * x, this.tileSize.y * y, this.tileSize.x - 1, this.tileSize.y - 1);
    // }

    init() {
        this.player.init();
        this.level.init(this);
    }

    getRandomPos() {
        return { x: Math.floor(Math.random() * this.areaSize.x), y: Math.floor(Math.random() * this.areaSize.y ) };
    }

    reset() {
        this.player.init();
        this.frameCount = 0;
    }

    gameOver() {
        alert("game over!");
        return this.reset();
    }

    update() {
        
        this.frameCount++;
        this.level.update(this);
    }

    draw() {
        this.level.draw(this);
    }

    gameLoop() {
        this.update();
        this.draw();
    }

    run() {
        this.init();
        setInterval(() => {
            requestAnimationFrame(() => this.gameLoop())
        }, 1000/this.frameRate);
    }
}

class Level {

    levelDef = [
        "===========",
        "=         =",
        "= ======= =",
        "=   ===   =",
        "=== === ===",
        "    ===    ",
        "=== === ===",
        "=   ===   =",
        "= ======= =",
        "=    x    =",
        "===========",
    ]

    constructor(game) {
        this.canvas = game.canvas;
        this.context = game.context;
        this.player = game.player;
        this.backgroundColor = "black";
        this.areaSize = new Vector(50, 50);
        this.sprites = [];
        this.entities = [];
    }
    get tileSize() {
        return new Vector(Math.floor(this.canvas.width / this.areaSize.x), Math.floor(this.canvas.height / this.areaSize.y))
    }

    clearArea() {
        this.context.fillStyle = this.backgroundColor;
        this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }

    getPosition(x, y) {
        return new Vector(x * this.tileSize.x, y * this.tileSize.y);
    }

    getTile(position) {
        return {
            x: Math.floor(position.x / this.tileSize.x),
            y: Math.floor(position.y / this.tileSize.y)
        };
    }

    checkLevelBoundries(sprite) {
        let currentTile = this.getTile(sprite.position);
        let newPosition = sprite.position.add(sprite.velocity);
        let newTile = this.getTile(newPosition);
        if (this.levelDef[newTile.y][newTile.x] === '=') {
            //return sprite.position;
            return this.getPosition(currentTile.x, currentTile.y);
        }
        else {
            return newPosition;
        }
    }


    loadFromStringArray(levelDef) {
        this.areaSize = new Vector(levelDef[0].length, levelDef.length);
        for (let y = 0; y < levelDef.length; y++) {
            for(let x = 0; x < levelDef[y].length; x++) {
                switch (levelDef[y][x]) {
                    case 'x':
                            this.player.position = this.getPosition(x, y);
                        break;
                    case '=':
                            this.entities.push(new BlockEntity("blue", this.getPosition(x, y), new Vector(this.tileSize.x, this.tileSize.y)));
                        break;
                }
            }
        }
    }

    init(game) {
        this.player = game.player;
        this.loadFromStringArray(this.levelDef);
        this.player.entity.image.width = this.tileSize.x;
        this.player.entity.image.height = this.tileSize.y;
    }

    update(game) {
        this.player.update(game);
        for(let entity of this.entities) {
            entity.update(game);
        }
        for(let sprite of this.sprites) {
            sprite.update(game);
        }

    }

    draw(game) {
        this.clearArea();
        for(let entity of this.entities) {
            entity.draw(game);
        }
        for(let sprite of this.sprites) {
            sprite.draw(game);
        }
        this.player.draw(game);

    }
}


// class SnakeBase {
//     constructor(game) {
//         this.game = game;
//         this.segments = [];
//         this.color = "blue";
//     }

//     get head() {
//         return this.segments.slice(-1)[0];
//     }

//     init() {
//         let x = Math.floor(this.game.areaSize.x / 2);
//         let y = Math.floor(this.game.areaSize.y / 2);
//         let length = 3;
//         this.segments = [];
//         for(let i = 0; i < length; i++) {
//             this.segments.push({ x: x + i, y : y })
//         }
//     }

//     update() {
//         const vel = this.game.velocity;
//         if (vel.x || vel.y) {
//             let x = this.head.x + vel.x;
//             let y = this.head.y + vel.y;
//             if (x >= this.game.areaSize.x || x < 0 || y >= this.game.areaSize.y || y < 0) {
//                 //return this.game.gameOver();
//             }
//             for(let i = 0; i < this.segments.length; i++) {
//                 if (x === this.segments[i].x && y === this.segments[i].y) {
//                     return this.game.gameOver();
//                 }
//             }

//             this.segments.push({ x: x, y: y });
//             this.segments.shift();
//         }
//     }

//     addSegment() {
//         this.segments.push({ x: this.head.x, y: this.head.y });
//     }

//     draw() {
//         for(const segment of this.segments) {
//             this.game.drawSegment(segment.x, segment.y, this.color);
//         }
//     }
// }

class Controller {
    constructor() {
        this.direction = new Vector(0, 0);
    }

    setDirection(event) {
        switch(event.keyCode) {
            case 37:
                this.direction = new Vector(-1, 0);
                break;
            case 38:
                this.direction = new Vector(0, -1);
                break;
            case 39:
                this.direction = new Vector(1, 0);
                break;
            case 40:
                this.direction = new Vector(0, 1);
                break;
        }
    }

    reset() {
        this.direction = new Vector(0, 0);
    }
    init() {
        this.reset();
        document.addEventListener("keydown", (event) => this.setDirection(event))
    }
}

class Vector {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
    
    add(v) {
        return new Vector(this.x + v.x, this.y + v.y);
    }

    scale(s) {
        return new Vector(this.x * s, this.y * s);
    }
}

class Entity {

    constructor(position) {
        this.position = position;
    }

    draw(game) {
    }

    update(game) {
    }
}

class ImageEntity extends Entity {
    constructor(imageSrc, position, size) {
        super(position);
        this.image = new Image(size?.x, size?.y);
        this.image.src = imageSrc;
    }

    draw(game) {
        game.context.drawImage(this.image, this.position.x, this.position.y, this.image.width, this.image.height);
    }
}

class BlockEntity extends Entity {
    constructor(color, position, size) {
        super(position);
        this.color = color;
        this.size = size;
    }
    draw(game) {
        game.context.fillStyle = this.color;
        game.context.fillRect(this.position.x, this.position.y, this.size.x, this.size.y);
    }
}

class Sprite {
    constructor(entity, speed) {
        this.entity = entity;
        this.velocity = new Vector(0, 0);
        this.speed = speed;
        this.direction = new Vector(0, 0);
    }

    get position() {
        return this.entity.position;
    }
    set position(value) {
        this.entity.position = value;
    }


    update(game) {
        this.velocity = this.direction.scale(this.speed * game.ticks);
        let newPosition = game.level.checkLevelBoundries(this);
        this.position = newPosition;
    }

    draw(game) {
        this.entity.draw(game);
    }
}

class Player extends Sprite {
    constructor(entity, speed) {
        super(entity, speed);
        this.controller = new Controller();
    }

    init() {
        this.controller.init();
    }

    update(game) {
        super.update(game);
        this.direction = this.controller.direction;
        
    }

    draw(game) {
        super.draw(game);
    }
}


// let game = new Game(document.getElementById("canvas"));

// game.run();
