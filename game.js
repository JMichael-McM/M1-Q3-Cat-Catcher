// const config = {
//   type: Phaser.AUTO,
//   width: 800,
//   height: 500,
//   physics: { default: 'arcade', arcade: { gravity: { y: 500 } } },
//   scene: { preload, create, update }
// };
 
// const game = new Phaser.Game(config);
// let player, cursors;
 
// function preload() {
//   // Load a built-in colored rectangle as player
// }
 
// function create() {
//   player = this.physics.add.image(400, 200, 'player');
//   player.setCollideWorldBounds(true);
//   cursors = this.input.keyboard.createCursorKeys();
// }
 
// function update() {
//   if (cursors.left.isDown) player.setVelocityX(-200);
//   else if (cursors.right.isDown) player.setVelocityX(200);
//   else player.setVelocityX(0);
//   if (cursors.up.isDown) player.setVelocityY(-100);
// }

// ============================================================
//  game.js  —  My First Phaser Platformer
//  Controls: Arrow keys to move, Up arrow to jump
// ============================================================
 
 
// ── STEP 1: Tell Phaser how big the game is and what physics to use ──────────
 
// ── STEP 1: GAME CONFIG ───────────────────────────────────

const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 400 },
      debug: false
    }
  },
  scene: {
    preload: preload,
    create: create,
    update: update
  }
};

// Start the game
const game = new Phaser.Game(config);


// ── STEP 2: VARIABLES ─────────────────────────────────────

let player;
let platforms;
let cursors;
let cats;
let scoreText;
let score = 0;


// ── STEP 3: LOAD ASSETS ───────────────────────────────────

function preload() {

  // Background image
  this.load.image('background', 'assets/background.png');

  // Catcher / Player image
  this.load.image('catcher', 'assets/catcher.png');

  // Cat image
  this.load.image('cat', 'assets/cat.png');


  // GREEN platform texture
  const groundGraphic = this.make.graphics({ add: false });

  groundGraphic.fillStyle(0x2ecc71);

  groundGraphic.fillRect(0, 0, 200, 20);

  groundGraphic.generateTexture('ground', 200, 20);

  groundGraphic.destroy();

}


// ── STEP 4: CREATE GAME OBJECTS ───────────────────────────

function create() {

  // --- Background ---
  this.add.image(400, 300, 'background');


  // --- Platforms ---
  platforms = this.physics.add.staticGroup();

  // Ground
  platforms.create(400, 580, 'ground')
    .setScale(4, 1)
    .refreshBody();

  // Floating platforms
  platforms.create(150, 450, 'ground');

  platforms.create(500, 350, 'ground');

  platforms.create(750, 250, 'ground');

  platforms.create(250, 250, 'ground');


  // --- Player / Catcher ---
  player = this.physics.add.sprite(100, 500, 'catcher');

  player.setScale(0.3);

  player.setBounce(0.05);

  player.setCollideWorldBounds(true);


  // Player collides with platforms
  this.physics.add.collider(player, platforms);


  // --- Cats ---
  cats = this.physics.add.group({
    key: 'cat',
    repeat: 11,
    setXY: {
      x: 20,
      y: 0,
      stepX: 64
    }
  });


  // Random bounce for cats
  cats.children.iterate(function (cat) {

    cat.setScale(0.2);

    cat.setBounceY(Phaser.Math.FloatBetween(0.2, 0.6));

  });


  // Cats collide with platforms
  this.physics.add.collider(cats, platforms);


  // Player catches cats
  this.physics.add.overlap(player, cats, catchCat, null, this);


  // --- Score Text ---
  scoreText = this.add.text(16, 16, 'Cats Caught: 0', {
    fontSize: '24px',
    fill: '#ffffff'
  });


  // --- Keyboard Controls ---
  cursors = this.input.keyboard.createCursorKeys();

}


// ── STEP 5: CATCH CAT FUNCTION ────────────────────────────

function catchCat(player, cat) {

  // Remove cat
  cat.disableBody(true, true);

  // Add score
  score += 10;

  // Update score text
  scoreText.setText('Cats Caught: ' + score);


  // Win condition
  if (cats.countActive(true) === 0) {

    this.add.text(70, 280, 'YOU CAUGHT ALL THE CATS!🎉', {
      fontSize: '42px',
      fill: '#ffff00'
    });

    // Stop player movement
    player.setVelocity(0, 0);

    player.body.moves = false;

    console.log('You Win!');

  }

}


// ── STEP 6: GAME LOOP ─────────────────────────────────────

function update() {

  // LEFT
  if (cursors.left.isDown) {

    player.setVelocityX(-180);

  }

  // RIGHT
  else if (cursors.right.isDown) {

    player.setVelocityX(180);

  }

  // STOP
  else {

    player.setVelocityX(0);

  }


  // JUMP
  const playerIsOnGround = player.body.blocked.down;

  if (cursors.up.isDown && playerIsOnGround) {

    player.setVelocityY(-500);

  }

}