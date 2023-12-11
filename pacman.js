class Pacman extends Game {

    constructor(canvas) {
        super(canvas);
        this.player = new Player("img/pacman.png", 20);
        this.level = new PacmanLevel(this);
    }

    init() {
        super.init();
    }

    update() {
        super.update();
    }

    draw() {
        super.draw();
    }

    reset() {
        super.reset();
    }

}

class WallTile extends Tile {
    constructor(level, tilePosition) {
        super(level, tilePosition);
        this.renderer = new BlockRenderer(this.level, "blue");
        this.blocks = true;
    }
}

class PointEntity extends Entity {
    constructor(level, tilePosition) {
        super(level, tilePosition);
        this.renderer = new CircleRenderer(this.level, "yellow", 0.1);
        this.points = 1;
        this.collected = false;
    }

    update(game) {
        if (game.player.currentTile.equals(this.tilePosition)) {
            if (!this.collected) {
                game.player.score.add(this.points);
                this.collected = true;
            }
        }
    }

    draw(game) {
        if (!this.collected) {
            super.draw(game);
        }
    }
}

class Ghost extends Sprite {
    constructor(level, tilePosition, renderer, framesPerTile) {
        super(level, tilePosition, renderer, framesPerTile);;
    }

    update(game, requestDirection) {
        if (this.direction === Direction.None) {
            let directionChoice = Math.floor(Math.random() * this.availableDirections.length);
            requestDirection = this.availableDirections[directionChoice];
        }
        else {
            requestDirection = this.direction;
        }
        super.update(game, requestDirection);
        if (this.currentTile.equals(game.player.currentTile)) {
            alert("Game Over!");
            game.init();
        }
    }
}

class PacmanLevel extends Level {
    levelDef = [
        "====== ======",
        "=   o  o    =",
        "= ========= =",
        "= ========= =",
        "=   =====   =",
        "=== ===== ===",
        "    =====    ",
        "=== ===== ===",
        "=   =====   =",
        "= ========= =",
        "= ========= =",
        "=.....x.....=",
        "====== ======",
    ]

    update(game) {
        super.update(game);
    }

    loadFromStringArray(levelDef) {
        this.areaSize = new Vector(levelDef[0].length, levelDef.length);
        for (let y = 0; y < levelDef.length; y++) {
            this.levelData.push([]);
            for(let x = 0; x < levelDef[y].length; x++) {
                let position = new Vector(x, y);
                switch (levelDef[y][x]) {
                    case 'x':
                        this.levelData[y].push(new Tile(this, position, new Renderer(this)));
                        this.playerStartPosition = new Vector(x, y);
                        break;
                    case '=':
                        this.levelData[y].push(new WallTile(this, position));
                        break;
                    case '.':
                        this.levelData[y].push(new Tile(this, position, new Renderer(this)));
                        this.entities.push(new PointEntity(this, position));
                        break;
                    case 'o':
                        this.levelData[y].push(new Tile(this, position, new Renderer(this)));
                        this.sprites.push(new Ghost(this, position, new ImageRenderer(this, "img/ghost.png"), 20));
                        break;
                    default:
                        this.levelData[y].push(new Tile(this, position, new Renderer(this)));
                        break;
                }
            }
        }
    }    
}

let game = new Pacman(document.getElementById("canvas"));

game.run();
