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
    scene: [Menu, Tutorial, Load, Play]
};

let game = new Phaser.Game(config);
let isBananaColliding = false;
let isLightningColliding = false;
let isPianoColliding = false;
let explode = false;
let crash= false;
let spacebar, rkey, tkey;
let speed = 100;
let choose = 20;
let score = 0;
