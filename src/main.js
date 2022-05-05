// Vivian Zheng, Charles Qi, Noah Kirsch, Allan Moua
// The Hands of God
// Updated: 5/5/2022
// Creative Tilt Justification:
// We implemented a random generator which "tosses" obstacles at the player using velocity,
// acceleration, and speed. This was a rather difficult objective which we realized as it took up
// a majority of our time developing. There were issues with the collision checking, the speed, and
// the movement. We ended up managing to make it work, however it took much longer for us to finish
// this assignment because of it and now we know not to overreach or plan ahead.
// As for our visual style, we implemented a timer function for the levels. Although we never got to
// proceed towards making full on different levels for different life stages as we planned, we 
// settled for this simple level change. The unique part of it is that if you manage to reach level 5
// the baby turns into an old man, implicating that he has been running for a very very long time. We
// are also very proud of the music and the art assets as those took time and effort to produce.
// Even the fonts used in this game were created as sprites to get a unique display. We believe that
// a very impressive quality of our game is the title screen animation that simulates a see through
// barrier with the text so the player can see the baby sprite walking from left to right.
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
