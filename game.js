const canvas = document.getElementById('musicPong');
const ctx = canvas.getContext('2d');

canvas.style.border = '1px solid red';

const PADDLE_WIDTH = 100;
const PADDLE_MARGIN_BOTTOM = 50;
const PADDLE_HEIGHT = 20;
const BALL_RADIUS = 10;
let leftArrow = false;
let rightArrow = false;

const paddle = {
  x: canvas.width/2 - PADDLE_WIDTH/2,
  y: canvas.height - PADDLE_MARGIN_BOTTOM - PADDLE_HEIGHT,
  width: PADDLE_WIDTH,
  height: PADDLE_HEIGHT,
  dx: 5
}

function drawPaddle() {
  ctx.fillStyle = 'green';
  ctx.fillRect(paddle.x, paddle.y, paddle.width, paddle.height);

  ctx.strokeStyle = 'yellow';
  ctx.strokeRect(paddle.x, paddle.y, paddle.width, paddle.height)
}

document.addEventListener('keydown', (e) => {
  if (e.keyCode === 37) {
    leftArrow = true;
  } else if (event.keyCode === 39) {
    rightArrow = true;
  }
});

document.addEventListener('keyup', (e) => {
  if (e.keyCode === 37) {
    leftArrow = false;
  } else if (event.keyCode === 39) {
    rightArrow = false;
  }
});

function movePaddle() {
  if (rightArrow && paddle.x + paddle.width < canvas.width) {
    paddle.x += paddle.dx;
  } else if (leftArrow && paddle.x > 0) {
    paddle.x -= paddle.dx;
  }
}

const ball = {
  x: canvas.width/2,
  y: paddle.y - BALL_RADIUS,
  radius: BALL_RADIUS,
  speed: 4,
  dx: 3 * (Math.random() * 2 - 1),
  dy: -3
}

function drawBall() {
  ctx.beginPath();

  ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI*2);
  ctx.fillStyle = 'red';
  ctx.fill();

  ctx.strokeStyle = 'green';
  ctx.stroke();

  ctx.closePath();
}

function moveBall() {
  ball.x += ball.dx;
  ball.y += ball.dy;
}

function draw() {
  drawPaddle();
  drawBall();
}

function ballWallCollision() {
  if (ball.x + ball.radius > canvas.width || ball.x - ball.radius < 0) {
    ball.dx = - ball.dx;
  }

  if (ball.y - ball.radius < 0) {
    ball.dy = -ball.dy;
  }

  if (ball.y + ball.radius > canvas.height) {
    resetBall();
  }
}

function resetBall() {
  ball.x = canvas.width/2;
  ball.y = paddle.y - BALL_RADIUS;
  ball.dx = 3 * (Math.random() * 2 - 1);
  ball.dy = -3
}

function ballPaddleCollision(){
  if(ball.x < paddle.x + paddle.width && ball.x > paddle.x && paddle.y < paddle.y + paddle.height && ball.y > paddle.y){

    let collidePoint = ball.x - (paddle.x + paddle.width/2);

    collidePoint = collidePoint / (paddle.width/2);

    let angle = collidePoint * Math.PI/3;

    ball.dx = ball.speed * Math.sin(angle);
    ball.dy = - ball.speed * Math.cos(angle);
  }
}

function update() {
  movePaddle();

  moveBall();

  ballWallCollision();
  ballPaddleCollision();
}

function loop() {
  
  
  ctx.fillStyle = 'white';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  draw();
  update();
  requestAnimationFrame(loop)
}

loop();