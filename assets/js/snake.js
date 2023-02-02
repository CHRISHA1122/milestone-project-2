// Phaser game configeration
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

var snake;
var food;
var cursors;

var game = new Phaser.Game(config);

function preload() {

    this.load.image('bg', 'assets/images/grass_template2.jpg');
    this.load.image('snake', 'assets/images/body.png');
    this.load.image('rabbit', 'assets/images/Snake-14.png');
}

function create() {
    
    this.add.image(640, 300, 'bg');

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


    var Snake = new Phaser.Class({

        initialize:

        function Snake (scene, x, y) {
            this.headPosition = new Phaser.Geom.Point(x, y);
            this.body = scene.add.group();

            this.head = this.body.create(x * 16, y * 16, 'snake');
            this.head.setOrigin(0);

            this.alive = true;
        },
    })

    rabbit = new rabbit(this, 16, 28);

    snake = new Snake(this, 8, 8);
}

function update() {
    
}