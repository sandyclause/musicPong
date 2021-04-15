const canvas = document.getElementById('musicPong');
const ctx = canvas.getContext('2d');

const h3 = document.getElementById('name');
const file = document.getElementById('file-input');

const MEDIA_ELEMENT_NODES = new WeakMap();

let audioContext;

function init(source) {
  audio.src = source;
  
  if (audioContext == undefined) {
    audioContext = new AudioContext();
  }

  if (MEDIA_ELEMENT_NODES.has(audio)) {
    src = MEDIA_ELEMENT_NODES.get(audio);
  } else {
    src = audioContext.createMediaElementSource(audio);
    MEDIA_ELEMENT_NODES.set(audio, src);
  }

  const analyser = audioContext.createAnalyser();

  src.connect(analyser);
  analyser.connect(audioContext.destination);
  analyser.fftSize = 16384;

  const bufferLength = analyser.frequencyBinCount;

  const dataArray = new Uint8Array(bufferLength);
  
  let barHeight;
  let x = 0;
  
  function renderFrame() {
    ctx.fillStyle = 'rgba(0,0,0,0.2)';
    ctx.fillRect(0, 0, WIDTH, HEIGHT);
    
    requestAnimationFrame(renderFrame);
    
    x = 0;
    
    analyser.getByteFrequencyData(dataArray);

    let bars = 100;

    for (let i = 0; i < bars; i++) {
      barHeight = (dataArray[i] * 2.5);
      const barWidth = (WIDTH / bars);
      
      const rgbColor = (() => {
        switch (true) {
          case dataArray[i] > 210:
            return {
              r: 250,
              g: 0,
              b: 255
            }
          case dataArray[i] > 200:
            return { // yellow
              r: 250,
              g: 255,
              b: 0,
            }
          case dataArray[i] > 190:
            return { // yellow/green
              r: 204,
              g: 255,
              b: 0
            }       
          case dataArray[i] > 180:
            return { // blue/green
              r: 0,
              g: 219,
              b: 131
            }
          default:
            return { // light blue
              r: 0,
              g: 199,
              b: 255,
            }
        }
      })();

      ctx.fillStyle = `rgb(${rgbColor.r},${rgbColor.g},${rgbColor.b})`;
      ctx.fillRect(x, (HEIGHT - barHeight), barWidth, barHeight);

      x += barWidth
    };

    draw();
    update();
  }


  audio.play();
  renderFrame();
}

document.getElementById('listen').addEventListener('click', playAudio);
document.getElementById('refresh').addEventListener('click', refreshPage);

function refreshPage () {
  location.reload();
}

async function playAudio() {
  let audio = document.createElement('audio');

  // Define the URL of the MP3 audio file
  audio.src = 'http://sandytian.ca/audio/bensound-dubstep.mp3';
  const source = 'http://sandytian.ca/audio/bensound-dubstep.mp3';
  
  // Once the metadata has been loaded
  audio.addEventListener('loadedmetadata', function(){

    init(source);
  },false);
}

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const WIDTH = canvas.width;
const HEIGHT = canvas.height;


// canvas.style.border = '1px solid red';

const PADDLE_WIDTH = 100;
const PADDLE_MARGIN_BOTTOM = 50;
const PADDLE_HEIGHT = 20;
const BALL_RADIUS = 10;
let leftArrow = false;
let rightArrow = false;

const paddle = {
  x: WIDTH/2 - PADDLE_WIDTH/2,
  y: HEIGHT - PADDLE_MARGIN_BOTTOM - PADDLE_HEIGHT,
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
  } else if (e.keyCode === 39) {
    rightArrow = true;
  }
});

document.addEventListener('keyup', (e) => {
  if (e.keyCode === 37) {
    leftArrow = false;
  } else if (e.keyCode === 39) {
    rightArrow = false;
  }
});

function movePaddle() {
  if (rightArrow && paddle.x + paddle.width < WIDTH) {
    paddle.x += paddle.dx;
  } else if (leftArrow && paddle.x > 0) {
    paddle.x -= paddle.dx;
  }
}

const ball = {
  x: WIDTH/2,
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
  if (ball.x + ball.radius > WIDTH || ball.x - ball.radius < 0) {
    ball.dx = - ball.dx;
  }

  if (ball.y - ball.radius < 0) {
    ball.dy = -ball.dy;
  }

  if (ball.y + ball.radius > HEIGHT) {
    resetBall();
  }
}

function resetBall() {
  ball.x = WIDTH/2;
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

file.onchange = function() {


  const files = this.files;
  const source = URL.createObjectURL(files[0]);


  const name = files[0].name;
  h3.innerText = `${name}`;

  init(source);
};

