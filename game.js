// Get the canvas element and its context
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

let isGameOver = false; // Flag to control the game loop

let score = 0; // Variable to hold the player's score

let lives = 3; // Variable to hold the number of lives

const paddleSpeed = 7; // Speed at which the paddle moves
let moveLeft = false; // Flag for moving the paddle left
let moveRight = false; // Flag for moving the paddle right


// Brick properties
const brickRowCount = 5;
const brickColumnCount = 8;
const brickWidth = 75;
const brickHeight = 20;
const brickPadding = 10;
const brickOffsetTop = 30;
const brickOffsetLeft = 30;

// Initialize the bricks as a two-dimensional array
const bricks = [];
for (let c = 0; c < brickColumnCount; c++) {
  bricks[c] = [];
  for (let r = 0; r < brickRowCount; r++) {
    bricks[c][r] = { x: 0, y: 0, status: 1 }; // Status 1 means the brick is visible
  }
}

// Paddle properties
const paddleWidth = 100;
const paddleHeight = 10;
const paddleY = canvas.height - paddleHeight;
let paddleX = (canvas.width - paddleWidth) / 2;

// Ball properties
const ballRadius = 10;
let ballX = canvas.width / 2;
let ballY = canvas.height - 30;
let ballDX = 5; // Horizontal speed
let ballDY = -5; // Vertical speed

// Function to draw the paddle
function drawPaddle() {
  ctx.beginPath();
  ctx.rect(paddleX, paddleY, paddleWidth, paddleHeight);
  ctx.fillStyle = '#0095DD';
  ctx.fill();
  ctx.closePath();
}

// Function to draw the ball
function drawBall() {
  ctx.beginPath();
  ctx.arc(ballX, ballY, ballRadius, 0, Math.PI * 2);
  ctx.fillStyle = '#0095DD';
  ctx.fill();
  ctx.closePath();
}

// Function to draw the bricks
function drawBricks() {
    for (let c = 0; c < brickColumnCount; c++) {
      for (let r = 0; r < brickRowCount; r++) {
        const brick = bricks[c][r];
        if (brick.status === 1) {
          const brickX = c * (brickWidth + brickPadding) + brickOffsetLeft;
          const brickY = r * (brickHeight + brickPadding) + brickOffsetTop;
          brick.x = brickX;
          brick.y = brickY;
          ctx.beginPath();
          ctx.rect(brickX, brickY, brickWidth, brickHeight);
          ctx.fillStyle = '#0095DD';
          ctx.fill();
          ctx.closePath();
        }
      }
    }
  }  

  function drawScore() {
    ctx.font = '16px Arial';
    ctx.fillStyle = '#0095DD';
    ctx.fillText('Score: ' + score, 8, 20);
  }  

  function drawLives() {
    ctx.font = '16px Arial';
    ctx.fillStyle = '#0095DD';
    ctx.fillText('Lives: ' + lives, canvas.width - 65, 20);
  }  

  function collisionDetection() {
    for (let c = 0; c < brickColumnCount; c++) {
      for (let r = 0; r < brickRowCount; r++) {
        const b = bricks[c][r];
        if (b.status === 1 && ballX > b.x && ballX < b.x + brickWidth && ballY > b.y && ballY < b.y + brickHeight) {
          ballDY = -ballDY;
          b.status = 0; // Hide the brick
          score++; // Increment the score
        }
      }
    }
  }  

// Function to draw the game objects
function draw() {
  // Clear the canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw the paddle and ball
  drawBricks();
  drawPaddle();
  drawBall();
  collisionDetection();
  drawLives();
   
  // Draw the score
  drawScore();

  // Update ball position
  ballX += ballDX;
  ballY += ballDY;

    // Move the paddle
    if (moveRight && paddleX < canvas.width - paddleWidth) {
        paddleX += paddleSpeed;
      } else if (moveLeft && paddleX > 0) {
        paddleX -= paddleSpeed;
      }

  // Bounce off left and right walls
if (ballX + ballDX < ballRadius || ballX + ballDX > canvas.width - ballRadius) {
    ballDX = -ballDX;
  }
  
  // Bounce off the top wall
  if (ballY + ballDY < ballRadius) {
    ballDY = -ballDY;
  }

// Bounce off the paddle or end the game
if (ballY + ballDY > canvas.height - ballRadius) {
    if (ballX > paddleX && ballX < paddleX + paddleWidth) {
      ballDY = -ballDY;
    } else {
      lives--; // Decrement lives
      if (!lives) {
        isGameOver = true; // Set the game over flag if no lives remain
      } else {
        // Reset ball and paddle positions
        ballX = canvas.width / 2;
        ballY = canvas.height - 30;
        ballDX = 5;
        ballDY = -5;
        paddleX = (canvas.width - paddleWidth) / 2;
      }
    }
  }  

 // Continue the game loop only if the game is not over
 if (!isGameOver) {
    requestAnimationFrame(draw);
  }
  else
    // Display "Game Over" if the game is over
    {
        ctx.font = '36px Arial';
        ctx.fillStyle = '#0095DD';
        ctx.fillText('Game Over', canvas.width / 2 - 100, canvas.height / 2);
    }  

}

draw(); // Start the game loop

// Event listener for keydown events
document.addEventListener('keydown', keyDownHandler);

// Event listener for keyup events
document.addEventListener('keyup', keyUpHandler);

// Function to handle keydown events
function keyDownHandler(e) {
  if (e.key === 'Right' || e.key === 'ArrowRight' || e.key === 'l') {
    moveRight = true;
  } else if (e.key === 'Left' || e.key === 'ArrowLeft' || e.key === 'j') {
    moveLeft = true;
  }
}

// Function to handle keyup events
function keyUpHandler(e) {
  if (e.key === 'Right' || e.key === 'ArrowRight' || e.key === 'l') {
    moveRight = false;
  } else if (e.key === 'Left' || e.key === 'ArrowLeft' || e.key === 'j') {
    moveLeft = false;
  }
}
