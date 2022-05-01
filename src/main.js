// Vivian Zheng, Charles Qi, Noah Kirsch, Allan Moua
// Updated: 5/1/2022
// The Hands of God
'use strict';

// global variables
let cursors;
let currentScene = 0;
const SCALE = 0.5;
const tileSize = 35;

// main game object
let config = {
    type: Phaser.WEBGL,
    width: 840,
    height: 525,
    physics: {
        default: 'arcade',
        arcade: {
            //debug: true,
            gravity: {
                x: 0,
                y: 0
            }
        }
    },
    scene: [Menu, Tutorial, Load, VariableJump]
};

let game = new Phaser.Game(config);
let isBananaColliding, isLightningColliding, isPianoColliding, explode, crash= false;
let spacebar, rkey, tkey;
let counter = 0;
let speed = 5;
let choose = Phaser.Math.Between(1,speed);