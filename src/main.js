// Vivian Zheng, Charles Qi, Noah Kirsch, Allan Moua
// Updated: 4/24/2020
// The Hands of God
// tame the javashrek
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
    scene: [Menu, Load, VariableJump]
};

let game = new Phaser.Game(config);
let isBananaColliding, isLightningColliding, explode = false;
let spacebar, rkey;