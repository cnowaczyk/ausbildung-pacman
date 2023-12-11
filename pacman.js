class Pacman extends Game {

    constructor(canvas) {
        super(canvas);
        this.player = new Player("img/pacman.png", 20);
        this.level = new PacmanLevel(this);
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
    }
}

class PacmanLevel extends Level {
    levelDef = [
        "===== =====",
        "=         =",
        "= ======= =",
        "=   ===   =",
        "=== === ===",
        "    ===    ",
        "=== === ===",
        "=   ===   =",
        "= ======= =",
        "=....x....=",
        "===== =====",
    ]

    constructor(game) {
        super(game);
    }

    update(game, ticks) {
        super.update(game, ticks);
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
                        //this.player.sprite.position = this.getPosition(x, y);

                        break;
                    case '=':
                        //this.levelData[y].push(new Tile(this, position, new BlockRenderer(this, "blue")));
                        this.levelData[y].push(new WallTile(this, position));
                        //this.entities.push(new BlockRenderer(this, new Vector(x, y), "blue"));
                        //this.entities.push(new Blockrenderer("blue", this.getPosition(x, y), new Vector(this.tileSize.x, this.tileSize.y)));
                        break;
                    case '.':
                        //this.levelData[y].push(new Tile(this, position, new CircleRenderer(this, "yellow", 0.1)));
                        this.levelData[y].push(new Tile(this, position, new Renderer(this)));
                        this.entities.push(new PointEntity(this, position));
                        //this.entities.push(new Circlerenderer("yellow", this.getCenterPosition(x, y), new Vector(this.tileSize.x * 0.1, this.tileSize.y * 0.1)));
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
