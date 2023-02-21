// Phaser game configuration
var config = {
    type: Phaser.AUTO,
    height: 600,
    width: 1290,
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
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
var score = 0;
var pause = false;
var player;
var food;
var direction;
var UP = 0;
var DOWN = 1;
var LEFT = 2;
var RIGHT = 3;

// Calls the game configuration
var game = new Phaser.Game(config);

// Preload function
function preload() {

// Adds images to game, taken from Phaser3 examples
    this.load.image('snake', 'assets/images/body.png');
    this.load.image('food', 'assets/images/food.png');
}

// Create function
function create() {

// Adds score to game
    var scoreText;
    scoreText = this.add.text(10, 0, 'SCORE: 0');
    scoreText.setColor('#000000');
    scoreText.setFontFamily('Arcadepix');
    scoreText.setScale(1.8);
    
// Adds pause feature to game
    var pauseText = this.add.text(1200, 0, 'PAUSE');
    pauseText.setColor('#000000');
    pauseText.setFontFamily('Arcadepix');
    pauseText.setScale(1.8);
    pauseText.setInteractive();

        pauseText.on('pointerdown', function(pointer) {
            pauseText.setText('PLAY');
            setTimeout(_ => game.loop.sleep(), 50);
            pause = true;
        })
        pauseText.on('pointerover', function(pointer) {
            pauseText.setText('PAUSE');
            game.loop.wake();
            pause = false;
        })

// Adds gameover to game
    var gameOver = this.add.text(645, 250, 'GAME OVER');
    gameOver.setOrigin(0.5, 0.5);
    gameOver.setColor('#000000');
    gameOver.setFontFamily('Arcadepix');
    gameOver.setScale(8);
    gameOver.setDepth(1);
    gameOver.visible = false;

// Adds food to game
    var Food = new Phaser.Class({

        Extends: Phaser.GameObjects.Image,
        initialize:

        function Food (scene, x, y) {
            Phaser.GameObjects.Image.call(this, scene)
            this.setTexture('food');
            this.setPosition(x * 16, y * 16);
            this.setOrigin(0);
            this.setScale(1.3);

            this.total = 0;
            scene.children.add(this);
        },

// Places new food on game area
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
            this.head.setScale(1.2);

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

// Updates head position
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

// Enables snake to go off screen and come back on the otherside
        move: function(time) {
            switch(this.heading) {
                case UP: this.headPosition.y = Phaser.Math.Wrap(this.headPosition.y - 1, 0, 38);
                break;
                case DOWN: this.headPosition.y = Phaser.Math.Wrap(this.headPosition.y + 1, 0, 38);
                break;
                case LEFT: this.headPosition.x = Phaser.Math.Wrap(this.headPosition.x - 1, 0, 81);
                break;
                case RIGHT: this.headPosition.x = Phaser.Math.Wrap(this.headPosition.x + 1, 0, 81);
                break;
            }

            this.direction = this.heading;
            Phaser.Actions.ShiftPosition(this.body.getChildren(), this.headPosition.x * 16, this.headPosition.y * 16, 1, this.newBody);
            
// Adds colide function 
            var colideBody = Phaser.Actions.GetFirst(this.body.getChildren(), { x: this.head.x, y: this.head.y }, 1);
 
// Adds restart function
            if (colideBody) {
                gameOver.visible = true;
                if (confirm('RESTART GAME') == true) {
                    window.location.reload();
                }
                else {
                    window.location.assign('https://chrisha1122.github.io/milestone-project-2/');
                }
            this.alive = false;
            return false;
        }

//  Updates the timer ready for the next move
            this.moveTime = time + this.speed;
            return true;
            
        },

// Consume food function
        consumeFood: function(food) {
            if (this.head.x === food.x && this.head.y === food.y) {
                this.addBody();
                food.consume();

// Adds 10 points to score function when food is consumed
                score += 10;
                scoreText.setText('SCORE: ' + score);

// Adds speed up function for increased difficulty
                if (this.speed > 20 && food.total % 5 === 0) {
                    this.speed -= 3;
                }
                return true;
            }
            else {
                return false;
            }
        },

// Adds body piece to snake everytime food is consumed
        addBody: function() {
            var grow = this.body.create(this.newBody.x, this.newBody.y, 'snake');
            grow.setOrigin(0);
            grow.setScale(1.2);
        },
    });

// Loads food onto game canvas
    food = new Food(this, 16, 28);

// Loads player onto game canvas
    player = new Player(this, 8, 8);

//  Create keyboard controls
        direction = this.input.keyboard.createCursorKeys();
}

// Update function
function update(time, delta) {
 
// Updates the movement of snake
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

//Updates if food is consumed
    if (player.update(time)) {
        player.consumeFood(food);
    };
}