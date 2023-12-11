class Game {
    constructor(canvas) {
        this.canvas = canvas;
        this.context = canvas.getContext("2d");
        this.level = new Level(this);
        this.player = new Player();
        this.gameLoopId = null;
        this.lastTimeStamp = 0;
    }

    init() {
        this.level.init(this);
    }

    reset() {
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
        this.player.score.draw();
    }

    gameLoop(time) {
        this.gameLoopId = requestAnimationFrame((time) => this.gameLoop(time))
        let ticks = time - this.lastTimeStamp;
        this.lastTimeStamp = time;
        this.draw();
        this.update(ticks);
        
    }

    run() {
        this.init();
        this.gameLoop(0);
    }
}

class BoundryCheckResult {
    constructor(tileReached) {
        this.tileReached = tileReached;
        this.availableDirections = [];
    }
}

class Level {


    constructor(game) {
        this.canvas = game.canvas;
        this.context = game.context;
        this.player = game.player;
        this.backgroundColor = "black";
        this.areaSize = new Vector(50, 50);
        this.sprites = [];
        this.entities = [];
        this.levelData = [];
        this.playerStartPosition;
    }
    get tileSize() {
        return new Vector(Math.floor(this.canvas.width / this.areaSize.x), Math.floor(this.canvas.height / this.areaSize.y))
    }
    getLevelTile(tilePosition) {
        let x = tilePosition.x;
        let y = tilePosition.y
        if (x < 0) {
            x = this.areaSize.x - 1;
        }
        if (x >= this.areaSize.x) {
            x = 0;
        }
        if (y < 0) {
            y = this.areaSize.y - 1;
        }
        if (y >= this.areaSize.y) {
            y = 0;
        }
        return this.levelData[y][x];
    }

    clearArea() {
        this.context.fillStyle = this.backgroundColor;
        this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }

    /**
     * Liefert die linke obere Canvas Koordinate zu einer Tilekoordinate.
     * @param {number} x Die x Koordinate des Tiles im Level
     * @param {number} y Die y Koordinate des Tiles im Level
     * @returns {Vector} Einen Vector mit der linken oberen Canvas Koordinate des Tiles
     */
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
    /**
     * Liefert die Koordinate des Tiles, in dem der Mittelpunkt des Sprites liegt.
     * @param {Sprite} sprite Das Sprite, dessen Tile ermittelt werden soll.
     * @returns {Vector} Die Koordinate des Tiles.
     */
    getCurrentTile(sprite) {
        return new Vector(Math.floor(sprite.center.x / this.tileSize.x), Math.floor(sprite.center.y / this.tileSize.y));
    }


    checkLevelBoundries(sprite, requestedDirection) {
        //let targetTile = sprite.currentTile.add(sprite.direction.vector);

        requestedDirection = requestedDirection ?? Direction.None;
        let currentTile = this.getCurrentTile(sprite);
        let tilePosition = this.getPosition(currentTile.x, currentTile.y);

        let tileReached = sprite.position.approxEquals(tilePosition);
        

        let checkResult = new BoundryCheckResult(tileReached);
        if (checkResult.tileReached || sprite.direction === Direction.None) {
            if (requestedDirection !== Direction.None) {
                sprite.position = tilePosition;
                let targetTile = currentTile.add(requestedDirection.vector);
                if (this.getLevelTile(targetTile).blocks) {
                    if (this.getLevelTile(currentTile.add(sprite.direction.vector)).blocks) {
                        sprite.direction = Direction.None;
                    }
                } 
                else {
                    sprite.direction = requestedDirection;
                }
            }
            if (!this.getLevelTile(currentTile.add(Direction.Up.vector)).blocks) {
                checkResult.availableDirections.push(Direction.Up);
            }
            if (!this.getLevelTile(currentTile.add(Direction.Down.vector)).blocks) {
                checkResult.availableDirections.push(Direction.Down);
            }
            if (!this.getLevelTile(currentTile.add(Direction.Left.vector)).blocks) {
                checkResult.availableDirections.push(Direction.Left);
            }
            if (!this.getLevelTile(currentTile.add(Direction.Right.vector)).blocks) {
                checkResult.availableDirections.push(Direction.Right);
            }
        }
        else {
            let oppositeDirection = sprite.direction.getOpposite();
            if (requestedDirection === oppositeDirection) {
                sprite.direction = oppositeDirection;
            }
            checkResult.availableDirections.push(sprite.direction);
            checkResult.availableDirections.push(oppositeDirection);
        }
        return checkResult;
    }

    init(game) {
        this.player = game.player;
        this.loadFromStringArray(this.levelDef);
        this.player.init(game);
        for(let sprite of this.sprites) {
            sprite.init(game);
        }
    }

    update(game) {
        this.player.sprite.update(game);
        for(let sprite of this.sprites) {
            sprite.update(game);
        }
        for(let entity of this.entities) {
            entity.update(game);
        }
    }

    draw(game) {
        this.clearArea();
        for(let entity of this.entities) {
            entity.draw(game);
        }
        for(let tileSet of this.levelData) {
            for (let tile of tileSet) {
                tile.draw(game);
            }
        }
        for(let sprite of this.sprites) {
            sprite.draw(game);
        }
        this.player.sprite.draw(game);
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

    getOpposite() {
        switch(true) {
            case this === Direction.Up:
                return Direction.Down;
            case this === Direction.Down:
                return Direction.Up;
            case this === Direction.Left:
                return Direction.Right;
            case this === Direction.Right:
                return Direction.Left;
            default:
                return Direction.None;
        }
    }
}


class Renderer {

    constructor(level) {
        this.size = new Vector(level.tileSize.x, level.tileSize.y);
    }

    draw(game, position) {
    }

}

class ImageRenderer extends Renderer {
    constructor(level, imageSrc) {
        super(level);
        this.image = new Image(this.size?.x, this.size?.y);
        this.image.src = imageSrc;
    }

    init(game) {
        super.init(game);
        this.size = new Vector(game.level.tileSize.x, game.level.tileSize.y);
        this.image.width = game.level.tileSize.x;
        this.image.height = game.level.tileSize.y;
    }

    draw(game, position) {
        game.context.drawImage(this.image, position.x, position.y, this.image.width, this.image.height);
    }
}

class BlockRenderer extends Renderer {
    constructor(level, color) {
        super(level);
        this.color = color;
    }

    draw(game, position) {
        game.context.fillStyle = this.color;
        game.context.fillRect(position.x, position.y, this.size.x, this.size.y);
    }
}

class CircleRenderer extends Renderer {
    constructor(level,  color, radius) {
        super(level);
        this.color = color;
        this.radius = radius;
    }

    draw(game, position) {
        game.context.fillStyle = this.color;
        game.context.beginPath();
        if (this.size.x === this.size.y) {
            game.context.arc(position.x + this.size.x/2, position.y + this.size.y/2, this.size.x * this.radius, 0, Math.PI * 2);
        }
        else {
            game.context.ellipse(position.x + this.size.x/2, position.y + this.size.y/2, 0, this.size.x * this.radius, this.size.y * this.radius, 0, Math.PI * 2);
        }
        game.context.fill();
    }
}

class Entity {

    constructor(level, tilePosition, renderer) {
        this.level = level;
        this.tilePosition = tilePosition;
        this.position = level.getPosition(tilePosition.x, tilePosition.y);
        this.renderer = renderer ?? new Renderer(level);
    }
    get size() {
        return new Vector(this.level.tileSize.x, this.level.tileSize.y);
    }
    draw(game, position) {
        this.renderer.draw(game, position ?? this.position);
    }

    update(game) {
    }
}

class Tile extends Entity {
    constructor(level, tilePosition, renderer) {
        super(level, tilePosition);
        this.renderer = renderer;
        this.blocks = false;
    }
    draw(game) {
        this.renderer.draw(game, this.position);
    }
}

class Sprite extends Entity {
    constructor(level, tilePosition, renderer, framesPerTile) {
        super(level, tilePosition)
        this.level = level;
        this.direction = Direction.None;
        this.framesPerTile = framesPerTile;
        this.renderer = renderer;
        this.position = level.getPosition(tilePosition.x, tilePosition.y);
        this.speed = new Vector(game.level.tileSize.x/this.framesPerTile, game.level.tileSize.y/this.framesPerTile);
        this.availableDirections = [];
    }
    get currentTile() {
        return this.level.getCurrentTile(this);
    }

    get center() {
        return new Vector(this.position.x + this.size.x/2, this.position.y + this.size.y/2);
    }

    init(game) {
    }

    update(game, requestedDirection) {
        let boundryCheckResult = game.level.checkLevelBoundries(this, requestedDirection);
        this.velocity = this.direction.vector.hadamardProduct(this.speed);
        let newPosition = this.position.add(this.velocity);
        if (newPosition.x < 0 - this.size.x) {
            newPosition.x = game.canvas.width;
        }
        if (newPosition.x > game.canvas.width) {
            newPosition.x = 0 - this.size.x;
        }
        if (newPosition.y < 0 - this.size.y) {
            newPosition.y = game.canvas.height;
        }
        if (newPosition.y > game.canvas.height) {
            newPosition.y = 0 - this.size.y;
        }
        this.position = newPosition;
        this.availableDirections = boundryCheckResult.availableDirections;
    }

    draw(game) {
        this.renderer.draw(game, this.position);
    }
}

class PlayerSprite extends Sprite {
    constructor(level, tilePosition, renderer, framesPerTile) {
        super(level, tilePosition, renderer, framesPerTile);
        this.controller = new Controller();
    }

    init(game) {
        super.init(game);
        this.controller.init(game);
    }

    update(game) {
        super.update(game, this.controller.direction);
    }

    draw(game) {
        super.draw(game, this.position);
    }
}

class Player {
    constructor(imageSrc, framesPerTile) {
        this.sprite;
        this.imageSrc = imageSrc;
        this.framesPerTile = framesPerTile;
        this.score = new Score();
    }

    get currentTile() {
        return this.sprite.currentTile;
    }

    init(game) {
        this.score.init();
        this.sprite = new PlayerSprite(game.level, game.level.playerStartPosition, new ImageRenderer(game.level, this.imageSrc), this.framesPerTile);
        this.sprite.init(game);
    }
}

class Score {
    constructor() {
        this.points = 0;
        this.scoreValueElement = document.getElementById("score-value");
    }

    init() {
        this.points = 0;
    }

    draw() {
        this.scoreValueElement.textContent = this.points;

    }

    add(points) {
        this.points += points;
    }
}
