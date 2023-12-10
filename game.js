class Game {
    constructor(canvas) {
        this.canvas = canvas;
        this.context = canvas.getContext("2d");
        this.level = new Level(this);
        this.player = new Player();
        this.gameLoopId = null;
        this.lastTimeStamp = 0;
    }


    // drawSegment(x, y, color) {
    //     this.context.fillStyle = color;
    //     this.context.fillRect(this.tileSize.x * x, this.tileSize.y * y, this.tileSize.x - 1, this.tileSize.y - 1);
    // }

    init() {
        //this.player.init(this);
        this.level.init(this);
    }

    // getRandomPos() {
    //     return { x: Math.floor(Math.random() * this.areaSize.x), y: Math.floor(Math.random() * this.areaSize.y ) };
    // }

    reset() {
        this.player.init();
        this.frameCount = 0;
    }

    gameOver() {
        alert("game over!");
        return this.reset();
    }

    update(time) {
        this.level.update(this, time);
    }

    draw() {
        this.level.draw(this);
    }

    gameLoop(time) {
        this.gameLoopId = requestAnimationFrame((time) => this.gameLoop(time))
        let ticks = time - this.lastTimeStamp;
        this.lastTimeStamp = time;
        this.update(ticks);
        this.draw();
    }

    run() {
        this.init();
        this.gameLoop(0);
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
        "=....x....=",
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
    getCenterPosition(x, y) {
        return new Vector(x * this.tileSize.x + Math.floor(this.tileSize.x / 2), y * this.tileSize.y + Math.floor(this.tileSize.y / 2));
    }

    getTile(position) {
        return {
            x: Math.floor(position.x / this.tileSize.x),
            y: Math.floor(position.y / this.tileSize.y)
        };
    }
    getCurrentTile(sprite) {
        return new Vector(Math.floor(sprite.center.x / this.tileSize.x), Math.floor(sprite.center.y / this.tileSize.y));
    }

    tileReached(sprite) {
        let currentTile = this.getCurrentTile(sprite);
        let tilePosition = this.getPosition(currentTile.x, currentTile.y);
        return sprite.position.approxEquals(tilePosition);
    }

    checkLevelBoundries(sprite) {
        //let currentTile = this.getCurrentTile(sprite);
        let targetTile = sprite.currentTile.add(sprite.direction.vector);
        let reached = this.tileReached(sprite);
        if (reached) {
            console.log("tile reached");
        }

        if (this.levelDef[targetTile.y][targetTile.x] === '=') {
            return sprite.position;
            //return this.getPosition(currentTile.x, currentTile.y);
        }
        else {
            return sprite.position.add(sprite.velocity);
        }



        let newPosition = sprite.position.add(sprite.velocity);
        switch(true) {
            case sprite.direction == Direction.Right:

                break;
            case sprite.direction == Direction.Left:
                break;
            case sprite.direction == Direction.Down:
                break;
            case sprite.direction == Direction.Up:
                break;
            default:
                return sprite.position;
        }
        let newTile = this.getTile(newPosition);
        if (this.levelDef[newTile.y][newTile.x] === '=') {
            return sprite.position;
            //return this.getPosition(currentTile.x, currentTile.y);
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
                        this.entities.push(new BlockRenderer(this, new Vector(x, y), "blue"));
                        //this.entities.push(new Blockrenderer("blue", this.getPosition(x, y), new Vector(this.tileSize.x, this.tileSize.y)));
                        break;
                    case '.':
                        this.entities.push(new CircleRenderer(this, new Vector(x, y), "yellow", 0.1));
                        //this.entities.push(new Circlerenderer("yellow", this.getCenterPosition(x, y), new Vector(this.tileSize.x * 0.1, this.tileSize.y * 0.1)));
                        break;
                }
            }
        }
    }

    init(game) {
        this.player = game.player;
        this.loadFromStringArray(this.levelDef);
        this.player.init(game);
        for(let renderer of this.entities) {
            renderer.init(game);
        }
        for(let sprite of this.sprites) {
            sprite.init(game);
        }
    }

    update(game, ticks) {
        this.player.update(game, ticks);
        for(let renderer of this.entities) {
            renderer.update(game, ticks);
        }
        for(let sprite of this.sprites) {
            sprite.update(game, ticks);
        }
    }

    draw(game) {
        this.clearArea();
        for(let renderer of this.entities) {
            renderer.draw(game);
        }
        for(let sprite of this.sprites) {
            sprite.draw(game);
        }
        this.player.draw(game);
    }
}

class Controller {
    constructor() {
        this.direction = Direction.None;
    }

    setDirection(event) {
        switch(event.keyCode) {
            case 37:
                this.direction = Direction.Left;
                break;
            case 38:
                this.direction = Direction.Up;
                break;
            case 39:
                this.direction = Direction.Right;
                break;
            case 40:
                this.direction = Direction.Down;
                break;
            default:
                this.direction = Direction.None;
        }
    }

    reset() {
        this.direction = Direction.None;
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

    equals(v) {
        return this.x === v.x && this.y === v.y;
    }

    approxEquals(v, variance = 1) {
        //let variance = 1;
        //return this.x <= v.x + variance && this.x >= v.x - variance && this.y <= v.y + variance && this.y >= vy - variance;
        return Math.abs(this.x - v.x) < variance && Math.abs(this.y - v.y) < variance;
    }

    hadamardProduct(v) {
        return new Vector(v.x * this.x, v.y * this.y);
    }
}

class Direction {
    static Up = new Direction("up", new Vector(0, -1));
    static Down = new Direction("down", new Vector(0, 1));
    static Left = new Direction("left", new Vector(-1, 0));
    static Right = new Direction("right", new Vector(1, 0));
    static None = new Direction("none", new Vector(0, 0));

    constructor(name, vector) {
        this.name = name;
        this.vector = vector;
    }
}


class Renderer {

    constructor(level, coordinate) {
        this.position = level.getPosition(coordinate.x, coordinate.y);
        this.size = new Vector(level.tileSize.x, level.tileSize.y);
    }

    get center() {
        return new Vector(this.position.x + this.size.x/2, this.position.y + this.size.y/2);
    }


    init(game) {
    }

    draw(game) {
    }

    update(game) {
    }
}

class ImageRenderer extends Renderer {
    constructor(level, coordinate, imageSrc) {
        super(level, coordinate);
        this.image = new Image(size?.x, size?.y);
        this.image.src = imageSrc;
    }

    init(game) {
        super.init(game);
        this.size = new Vector(game.level.tileSize.x, game.level.tileSize.y);
        this.image.width = game.level.tileSize.x;
        this.image.height = game.level.tileSize.y;
    }

    draw(game) {
        game.context.drawImage(this.image, this.position.x, this.position.y, this.image.width, this.image.height);
    }
}

class BlockRenderer extends Renderer {
    constructor(level, coordinate, color) {
        super(level, coordinate);
        this.color = color;
    }

    draw(game) {
        game.context.fillStyle = this.color;
        game.context.fillRect(this.position.x, this.position.y, this.size.x, this.size.y);
    }
}

class CircleRenderer extends Renderer {
    constructor(level, coordinate, color, radius) {
        super(level, coordinate);
        this.color = color;
        this.radius = radius;
    }

    draw(game) {
        game.context.fillStyle = this.color;
        game.context.beginPath();
        if (this.size.x === this.size.y) {
            game.context.arc(this.center.x, this.center.y, this.size.x * this.radius, 0, Math.PI * 2);
        }
        else {
            game.context.ellipse(this.center.x, this.center.y, 0, this.size.x * this.radius, this.size.y * this.radius, 0, Math.PI * 2);
        }
        game.context.fill();
    }
}

class Tile {
    constructor(renderer, level, coordinate) {
        this.renderer = renderer;
        this.coordinate = coordinate;
    }
}


class Sprite {
    constructor(spriteSrc, framesPerTile) {
        this.renderer;
        this.spriteSrc = spriteSrc;
        this.velocity = new Vector(0, 0);
        this.speed;
        this.framesPerTile = framesPerTile;
        this.direction = Direction.None;
        this.currentDirection = Direction.None;
        this.currentTile;
        this.targetTile;
    }

    get position() {
        return this.renderer.position;
    }
    set position(value) {
        this.renderer.position = value;
    }
    get center() {
        return this.renderer.center();
        return new Vector(this.renderer.position.x + this.renderer.size.x/2, this.renderer.position.y + this.renderer.size.y/2);
    }

    init(game) {
        this.renderer = new ImageRenderer(game.level, new Vector(0,0), this.imageSrc);
        this.renderer.init(game);
        this.speed = new Vector(game.level.tileSize.x/this.framesPerTile, game.level.tileSize.y/this.framesPerTile);
        this.currentTile = game.level.getCurrentTile(this);
        
    }

    update(game, ticks) {
        this.velocity = this.direction.vector.hadamardProduct(this.speed);
        let newPosition = game.level.checkLevelBoundries(this);
        this.position = newPosition;
    }

    draw(game) {
        this.renderer.draw(game);
    }
}

class Player extends Sprite {
    constructor(renderer, speed) {
        super(renderer, speed);
        this.controller = new Controller();
    }

    init(game) {
        super.init(game);
        this.controller.init(game);
    }

    update(game, ticks) {
        //console.log(ticks);
        super.update(game, ticks);
        this.direction = this.controller.direction;
        this.currentDirection = this.controller.direction;
        
    }

    draw(game) {
        // let ctx = game.context;
        // ctx.save();
        // switch(true) {
        //     case this.currentDirection.x > 0:
        //         break;
        //     case this.currentDirection.x < 0:
        //             ctx.translate(this.position.x + this.width/2, 0);
        //             ctx.scale(-1, 1);
        //         break;
        //     case this.currentDirection.y > 0:
        //             ctx.translate(this.position.x + this.width/2, this.position.y + this.width/2);
        //             ctx.rotate(Math.PI/2);
        //         break;
        //     case this.currentDirection.y < 0:
        //             ctx.translate(this.position.x + this.width/2, this.position.y + this.width/2);
        //             ctx.rotate(-Math.PI/2);
        //         break;
        // }
        super.draw(game);
        // ctx.restore();
    }
}


// let game = new Game(document.getElementById("canvas"));

// game.run();
