// Phaser game configuration
var config = {
    type: Phaser.AUTO,
    width: 1280,
    height : 600,
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
var snake;
var food;
var cursors;
var UP = 0;
var DOWN = 1;
var LEFT = 2;
var RIGHT = 3;

var game = new Phaser.Game(config);

function preload() {

    this.load.image('bg', 'assets/images/grass_template2.jpg');
    this.load.image('snake', 'assets/images/body.png');
    this.load.image('rabbit', 'assets/images/Snake-14.png');
}

function create() {
    
// Adds background image
    this.add.image(640, 300, 'bg');

    
// Adds food to game
    var rabbit = new Phaser.Class({

        Extends: Phaser.GameObjects.Image,
        initialize:

        function rabbit (scene, x, y) {
            Phaser.GameObjects.Image.call(this, scene)
            this.setTexture('rabbit');
            this.setScale(1.3);
            this.setPosition(x * 16, y * 16);
            this.setOrigin(0);

            this.total = 0;
            scene.children.add(this);
        },
    });


// Adds snake to game
    var Snake = new Phaser.Class({

        initialize:

        function Snake (scene, x, y) {
            this.headPosition = new Phaser.Geom.Point(x, y);
            this.body = scene.add.group();

            this.head = this.body.create(x * 16, y * 16, 'snake');
            this.head.setOrigin(0);

            this.alive = true;
            this.moveTime =0;
            this.speed = 100;
            this.heading = RIGHT;
            this.direction = RIGHT;
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
                case UP: this.headPosition.y =Phaser.Math.Wrap(this.headPosition.y - 1, 0, 38);
                break;
                case DOWN: this.headPosition.y =Phaser.Math.Wrap(this.headPosition.y + 1, 0, 38);
                break;
                case LEFT: this.headPosition.x =Phaser.Math.Wrap(this.headPosition.x - 1, 0, 80);
                break;
                case RIGHT: this.headPosition.x =Phaser.Math.Wrap(this.headPosition.x + 1, 0, 80);
                break;
            }

            this.direction = this.heading;
            Phaser.Actions.ShiftPosition(this.body.getChildren(), this.headPosition.x * 16, this.headPosition.y * 16, 1);
            this.moveTime = time + this.speed;
            return true;
        }
    });

    rabbit = new rabbit(this, 16, 28);

    snake = new Snake(this, 8, 8);

//  Create keyboard controls
        cursors = this.input.keyboard.createCursorKeys();
}

function update(time, delta) {
    
    if (!snake.alive) {
        return
    }
    if (cursors.up.isDown) {
        snake.faceUp();
    }
    else if (cursors.down.isDown) {
        snake.faceDown();
    }
    else if (cursors.left.isDown) {
        snake.faceLeft();
    }
    else if (cursors.right.isDown) {
        snake.faceRight();
    }

    snake.update(time);
}