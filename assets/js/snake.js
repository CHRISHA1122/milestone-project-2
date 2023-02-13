// Phaser game configuration
var config = {
    type: Phaser.AUTO,
    height: 600,
    width: 1280,
    backgroundColor: '#d3d3d3',
    physics: {
        default: 'arcade',
    },
    parent: 'game',
    scene: {
        preload: preload,
        create: create,
        update: update
    },
};

// Global variables
var player;
var food;
var direction;
var UP = 0;
var DOWN = 1;
var LEFT = 2;
var RIGHT = 3;

var game = new Phaser.Game(config);

function preload() {

// Adds images to game
    this.load.image('snake', 'assets/images/body.png');
    this.load.image('food', 'assets/images/food.png');
}

function create() {

// Adds pause feature to game
    var text = this.add.text(1000, 10, 'PAUSE');
    var pause = false;

    this.input.on('pointerdown', () => {
        if(!pause) {
            text.setText('PLAY');
            setTimeout(_ => game.loop.sleep(), 50);
            pause = true;
        }
        else {
            text.setText('PAUSE');
            game.loop.wake();
            pause = false;
        }
    })

// Adds food to game
    var Food = new Phaser.Class({

        Extends: Phaser.GameObjects.Image,
        initialize:

        function Food (scene, x, y) {
            Phaser.GameObjects.Image.call(this, scene)
            this.setTexture('food');
            this.setPosition(x * 16, y * 16);
            this.setOrigin(0);

            this.total = 0;
            scene.children.add(this);
        },

        consume: function() {
            this.total ++;
            var x = Phaser.Math.Between(0, 78);
            var y = Phaser.Math.Between(0, 36);
            this.setPosition(x * 16, y * 16);
        },
    });


// Adds snake to game
    var Player = new Phaser.Class({

        initialize:

        function Snake (scene, x, y) {
            this.headPosition = new Phaser.Geom.Point(x, y);
            this.body = scene.add.group();

            this.head = this.body.create(x * 16, y * 16, 'snake');
            this.head.setOrigin(0);

            this.alive = true;
            this.moveTime = 0;
            this.speed = 100;
            this.heading = DOWN;
            this.direction = DOWN;
            this.newBody = new Phaser.Geom.Point(x, y);
        },

        update: function (time) {
            if (time >= this.moveTime) {
                return this.move(time);
            }
        },

        faceUp: function() {
            if (this.direction === LEFT || this.direction === RIGHT) {
                this.heading = UP;
            }
        },
        faceDown: function() {
            if (this.direction === LEFT || this.direction === RIGHT) {
                this.heading = DOWN;
            }
        },
        faceLeft: function() {
            if (this.direction === UP || this.direction === DOWN) {
                this.heading = LEFT;
            }
        },
        faceRight: function() {
            if (this.direction === UP || this.direction === DOWN) {
                this.heading = RIGHT;
            }
        },

        move: function(time) {
            switch(this.heading) {
                case UP: this.headPosition.y = Phaser.Math.Wrap(this.headPosition.y - 1, 0, 38);
                break;
                case DOWN: this.headPosition.y = Phaser.Math.Wrap(this.headPosition.y + 1, 0, 38);
                break;
                case LEFT: this.headPosition.x = Phaser.Math.Wrap(this.headPosition.x - 1, 0, 80);
                break;
                case RIGHT: this.headPosition.x = Phaser.Math.Wrap(this.headPosition.x + 1, 0, 80);
                break;
            }

            this.direction = this.heading;
            Phaser.Actions.ShiftPosition(this.body.getChildren(), this.headPosition.x * 16, this.headPosition.y * 16, 1, this.newBody);
            
            var colideBody = Phaser.Actions.GetFirst(this.body.getChildren(), { x: this.head.x, y: this.head.y }, 1);
            if (colideBody) {
            console.log('dead');
            this.alive = false;
            return false;
        }
            
            this.moveTime = time + this.speed;
            return true;
            
        },

        consumeFood: function(food) {
            if (this.head.x === food.x && this.head.y === food.y) {
                this.addBody();
                food.consume();
                return true;
            }
            else {
                return false;
            }
        },

        addBody: function() {
            var grow = this.body.create(this.newBody.x, this.newBody.y, 'snake');
            grow.setOrigin(0);
        },
    });

    food = new Food(this, 16, 28);

    player = new Player(this, 8, 8);

//  Create keyboard controls
        direction = this.input.keyboard.createCursorKeys();
}

function update(time, delta) {
    
    if (!player.alive) {
        return
    }
    if (direction.up.isDown) {
        player.faceUp();
    }
    else if (direction.down.isDown) {
        player.faceDown();
    }
    else if (direction.left.isDown) {
        player.faceLeft();
    }
    else if (direction.right.isDown) {
        player.faceRight();
    }

    if (player.update(time)) {
        player.consumeFood(food);
    };
}