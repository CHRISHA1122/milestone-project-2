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
}

function create() {
    
    this.add.image(640, 300, 'bg');
}

function update() {
    
}