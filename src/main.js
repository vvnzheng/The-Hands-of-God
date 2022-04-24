// Nathan Altice
// Updated: 7/1/20
// Phaser 3 Movement Studies
// Concepts: Arcade physics, atlas and atlasXML loading, atlas animation (custom and generated frames), physics world wrapping, physics body properties (velocity, acceleration, drag, max acceleration), keyboard (isDown, JustPressed, DownDuration, UpDuration)
// Some mechanics inspired by and adapted from Game Mechanic Explorer https://gamemechanicexplorer.com
// The two example atlases  are commercial assets and should not be used for your own projects - buy them from https://www.kenney.nl/assets :)

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
            debug: true,
            gravity: {
                x: 0,
                y: 0
            }
        }
    },
    scene: [Load, VariableJump]
};

let game = new Phaser.Game(config);
let isBananaColliding = false;
let spacebar;