// Enemies our player must avoid
// Parameter: row, where the enemy will be placed
var Enemy = function (row) {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/enemy-bug.png';

    // Enemy starts offscreen
    this.x = Math.floor(Math.random() * 5) * 101;

    // Enemies will move on rows: 2, 3, 4, 5
    this.y = this.boardPosition.row[row];

    // Enemy speed
    this.speed = this.randomSpeed();

    // Used for collision detection
    this.hitBox = {
        xOffset: 0,
        yOffset: 90,
        height: 50,
        width: 100
    };
};

// Used to randomly set the enemy speed
Enemy.prototype.randomSpeed = function () {
    var minSpeed = 75;
    var maxSpeed = 250;
    return Math.floor(Math.random() * (maxSpeed - minSpeed)) + minSpeed;
};

// enemy 'y' coordinates of the for valid row positions
Enemy.prototype.boardPosition = {
    row: [56, 139, 222, 305]
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function (dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.

    var movement = this.speed * dt;

    if (this.y === this.boardPosition.row[1] ||
        this.y === this.boardPosition.row[3]) {
        this.x = this.x - movement;

        // Reset position when enemy moves off left side of screen
        if (this.x < 0) {
            this.x = 600;
            this.speed = this.randomSpeed();
        }
    } else {
        this.x = this.x + movement;

        // Reset position when enemy moves off right side of screen
        if (this.x > 500) {
            this.x = -100;
            this.speed = this.randomSpeed();
        }
    }
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function () {

    // Enemies in middle row move right to left
    if (this.y === this.boardPosition.row[1] ||
        this.y === this.boardPosition.row[3]) {

        // used to flip image along the x axis
        ctx.scale(-1, 1);
        ctx.drawImage(Resources.get(this.sprite), -this.x, this.y);
        // Used outline to visually determine collisions
        // this.drawHitBox(-this.x, this.y);

        // Reset the transform to default after using the scale transform
        ctx.setTransform(1, 0, 0, 1, 0, 0);

    } else {
        ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
        // Used outline to visually determine collisions
        // this.drawHitBox(this.x, this.y);
    }
};

// Helper function to visually check collisions
// Parameters: xPos, yPos - coordinates of enemy
Enemy.prototype.drawHitBox = function (xPos, yPos) {
    ctx.strokeStyle = "red";
    ctx.strokeRect(xPos + this.hitBox.xOffset, yPos + this.hitBox.yOffset, this.hitBox.width, this.hitBox.height);
};

// Player Class
var Player = function () {

    this.sprite = 'images/char-boy.png';

    this.livesRemaining = 2;

    // used for player positioning
    this.currentCol = 2;
    this.currentRow = 5;
    this.targetCol = this.currentCol;
    this.targetRow = this.currentRow;
    this.direction = null;

    // Player start position
    this.x = this.boardPosition.col[this.currentCol];
    this.y = this.boardPosition.row[this.currentRow];

    // Used for collision detection
    this.hitBox = {
        xOffset: 30,
        yOffset: 100,
        height: 40,
        width: 40
    }
};

// Function to update the players position on the board
Player.prototype.update = function (dt) {
    var speed = 750 * dt;

    if (this.direction === 'left') {
        if (this.x > this.boardPosition.col[this.targetCol]) {
            if (this.x - speed <= this.boardPosition.col[this.targetCol]) {
                this.x = this.boardPosition.col[this.targetCol];
                this.currentCol = this.targetCol;
            } else {
                this.x -= speed;
            }
        }
    } else if (this.direction === 'right') {
        if (this.x < this.boardPosition.col[this.targetCol]) {
            if (this.x + speed >= this.boardPosition.col[this.targetCol]) {
                this.x = this.boardPosition.col[this.targetCol];
                this.currentCol = this.targetCol;
            } else {
                this.x += speed;
            }
        }
    } else if (this.direction === 'up') {
        if (this.y > this.boardPosition.row[this.targetRow]) {
            if (this.y - speed <= this.boardPosition.row[this.targetRow]) {
                this.y = this.boardPosition.row[this.targetRow];
                this.currentRow = this.targetRow;
            } else {
                this.y -= speed;
            }
        }

        // Reached the top row
        if (this.currentRow === 0) {
            this.reachGoalPosition();
        }

    } else if (this.direction === 'down') {
        if (this.y < this.boardPosition.row[this.targetRow]) {
            if (this.y + speed >= this.boardPosition.row[this.targetRow]) {
                this.y = this.boardPosition.row[this.targetRow];
                this.currentRow = this.targetRow;
            } else {
                this.y += speed;
            }
        }
    }
};

// Function for when the player reaches the top row
Player.prototype.reachGoalPosition = function () {
    soundEffect.play('score');
    scoreboard.score++;
    scoreboard.displayScored();
    this.reset();
};

// Reset player positioning information
Player.prototype.reset = function () {
    this.currentCol = 2;
    this.currentRow = 5;
    this.targetCol = this.currentCol;
    this.targetRow = this.currentRow;
    this.x = this.boardPosition.col[this.currentCol];
    this.y = this.boardPosition.row[this.currentRow];
};

// All valid player position locations
Player.prototype.boardPosition = {
    col: [0, 101, 202, 303, 404],
    row: [-37, 46, 129, 212, 295, 378]
};

// Function for drawing the player on the board
Player.prototype.render = function () {
    if (this.livesRemaining >= 0) {
        ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
        // Hit box for determining collisions
        // this.drawHitBox();
    }
};

// Handling keyboard input for movement and game restart
Player.prototype.handleInput = function (keyPress) {

    if (this.currentCol === this.targetCol && this.currentRow === this.targetRow) {

        if (keyPress === 'left' && this.currentCol > 0) {
            this.targetCol = this.currentCol - 1;
        } else if (keyPress === 'right' && this.currentCol < this.boardPosition.col.length - 1) {
            this.targetCol = this.currentCol + 1;
        } else if (keyPress === 'up' && this.currentRow > 0) {
            this.targetRow = this.currentRow - 1;
        } else if (keyPress === 'down' && this.currentRow < this.boardPosition.row.length - 1) {
            this.targetRow = this.currentRow + 1;
        }

        this.direction = keyPress;
    }

    // Enter was pressed to reset the game
    if (keyPress === 'restart') {
        document.location.reload();
    }
};

// Function that determines if the player has collided with an enemy
Player.prototype.enemyCollisions = function () {
    allEnemies.forEach(function (enemy) {

        // Off set for enemies that move right to left
        var rightToLeftOffset;
        if (enemy.y === enemy.boardPosition.row[1] ||
            enemy.y === enemy.boardPosition.row[3]) {
            rightToLeftOffset = 100;
        } else {
            rightToLeftOffset = 0;
        }

        if (this.x + this.hitBox.xOffset + rightToLeftOffset < enemy.x + enemy.hitBox.xOffset + enemy.hitBox.width &&
            this.x + this.hitBox.xOffset + this.hitBox.width + rightToLeftOffset > enemy.x + enemy.hitBox.xOffset &&
            this.y + this.hitBox.yOffset < enemy.y + enemy.hitBox.yOffset + enemy.hitBox.height &&
            this.y + this.hitBox.yOffset + this.hitBox.height > enemy.y + enemy.hitBox.yOffset) {
            // Player collided with enemy
            soundEffect.play('hit');
            this.livesRemaining--;
            this.reset();
            if (this.livesRemaining < 0) {
                scoreboard.gameEnded();
            }
        }
    }, this);
};

// Helper function to visual check collisions
Player.prototype.drawHitBox = function () {
    ctx.strokeStyle = "red";
    ctx.strokeRect(this.x + this.hitBox.xOffset, this.y + this.hitBox.yOffset, this.hitBox.width, this.hitBox.height);
};

// Function for displaying the score, high score, and lives
// Keeps track of high score using local storage
var Scoreboard = function () {
    this.score = 0;
    this.scored = false;
    this.messageSize = 60;
    this.messageOpacity = 1;
    this.gameOver = false;

    // Function to store/retrieve high scores from local storage
    this.highScore = function (newHighScore) {
        if (newHighScore) {
            localStorage.highScore = newHighScore;
        } else {
            if (!localStorage.highScore) {
                return 0;
            } else {
                return localStorage.highScore;
            }
        }
    };

    // Function that displays score, high score, and live remaining
    this.render = function (canvas) {
        ctx.font = "24px sans-serif";

        // Score
        ctx.textAlign = "left";
        ctx.fillText("Score: " + this.score, 10, 34);

        // High Score
        ctx.textAlign = "center";
        ctx.fillText("High Score: " + this.highScore(), canvas.width / 2, 34);

        // Lives Remaining using scaled down player images
        ctx.scale(.35, .35);
        for (var i = 0; i < player.livesRemaining; i++) {
            ctx.drawImage(Resources.get(player.sprite), 1330 - (80 * i), -30);
        }
        ctx.setTransform(1, 0, 0, 1, 0, 0);


        if (this.scored) {
            this.displayScored();
        }

        if (this.gameOver) {
            this.displayGameOver();
        }
    };

    // Function that displays 'SCORE' when you reach the top
    this.displayScored = function () {
        this.scored = true;
        this.messageSize += 2;
        this.messageOpacity -= .03;
        ctx.save();
        ctx.textAlign = "center";
        ctx.fillStyle = "rgba(0,0,0," + this.messageOpacity + ")";
        ctx.font = this.messageSize + "px Arial Black";
        ctx.fillText("SCORE", 252, 290);
        ctx.restore();
        setTimeout(function () {
            scoreboard.scored = false;
            scoreboard.messageSize = 60;
            scoreboard.messageOpacity = 1;
        }, 500);
    };

    // Function that displays 'GAME OVER' and how to restart
    this.displayGameOver = function () {
        ctx.save();
        ctx.textAlign = "center";
        ctx.fillStyle = "rgba(255,255,0,.9)";
        ctx.font = "60px Arial Black";
        ctx.fillText("GAME OVER", 252, 280);
        ctx.fillStyle = "rgba(0,0,0,.9)";
        ctx.font = "24px Arial Black";
        ctx.fillText("<ENTER> to restart", 252, 350);
        ctx.restore();
    };

    // Function that updates high score if it is the new high score
    this.gameEnded = function () {
        this.gameOver = true;

        if (this.score > this.highScore()) {
            this.highScore(this.score);
        }
    };
};

// Game sound effects using the Howler.js audio framework
// Use single audio sprite file for sfx using time offsets and durations
var soundEffect = new Howl({
    src: ['./audio/arcade_sfx.mp3'],
    sprite: {
        hit: [0, 589],
        score: [589, 735]
    },
    volume: .2
});

// Background music
var soundBG = new Howl({
    src: ['./audio/arcade_bg.mp3'],
    autoplay: true,
    loop: true,
    volume: .025
});

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player

var numEnemies = 10; // 10 is a fair number of enemies
var allEnemies = [];

for (var i = 0; i < numEnemies; i++) {
    allEnemies.push(new Enemy(i % 4));
}

var player = new Player();

var scoreboard = new Scoreboard();

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keydown', function (e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down',

        13: 'restart'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});

