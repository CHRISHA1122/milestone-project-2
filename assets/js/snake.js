var config = {
    type: Phaser.AUTO,
    width: 640,
    height : 480,
    physics: {
        default: 'arcade',
    },
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

}

function create() {

}

function update() {
    
}