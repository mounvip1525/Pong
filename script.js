const { body }=document;

const canvas=document.createElement('canvas');
const context=canvas.getContext('2d');
const width=500;
const height=700;
const screenWidth = window.screen.width;
const canvasPosition = screenWidth / 2 - width / 2;
const gameOverElement=document.createElement('div');
const isMobile = window.matchMedia('(max-width: 600px)');



const paddleHeight=10;
const paddleWidth=50;
let paddleBottomX=225;
let paddleTopX=225;
const paddleDiff=25;
let playerMoved=false;
let paddleContact=false;


let ballX=250;
let ballY=350;
const ballRadius=5;

let playerScore=0;
let computerScore=0;
const winningScore=3;
let isGameOver=true;
let newGame=true;

let speedX;
let speedY;
let trajectoryX;
let computerSpeed;

if (isMobile.matches) {
    speedY = -2;
    speedX = speedY;
    computerSpeed = 4;
  } else {
    speedY = -1;
    speedX = speedY;
    computerSpeed = 3;
  }


function renderCanvas(){
    //setting the background for the canvas
    context.fillStyle='black';
    context.fillRect(0,0,width,height);

    //Paddle
    context.fillStyle='white';
    context.fillRect(paddleBottomX, height-20, paddleWidth,paddleHeight);
    context.fillRect(paddleTopX,10,paddleWidth,paddleHeight);

    //Center line
    context.beginPath();
    context.setLineDash([5]);
    context.moveTo(0,350);
    context.lineTo(500,350);
    context.strokeStyle='whitesmoke';
    context.stroke();

    //Ball
    context.beginPath();
    context.arc(ballX, ballY, ballRadius, 2 * Math.PI, false);
    context.fillStyle='white';
    context.fill();

    //Score
    context.font='32px Courier New';
    context.fillText(playerScore,20,canvas.height/2+50);
    context.fillText(computerScore,20,canvas.height/2-30);
}

function createCanvas(){
    canvas.width=width;
    canvas.height=height;
    body.appendChild(canvas);
    renderCanvas();
}

function ballReset() {
    ballX = width / 2;
    ballY = height / 2;
    speedY = -3;
    paddleContact = false;
  }

//Vertical Speed and Horizontal Speed
function ballMove(){
    ballY += -speedY;
    if(playerMoved && paddleContact)
    { 
        ballX += speedX;
    }
}

//To bounce the ball
function ballBoundaries() {
    // Bounce off Left Wall
    if (ballX < 0 && speedX < 0) {
      speedX = -speedX;
    }
    // Bounce off Right Wall
    if (ballX > width && speedX > 0) {
      speedX = -speedX;
    }
    // Bounce off player paddle (bottom)
    if (ballY > height - paddleDiff) {
      if (ballX > paddleBottomX && ballX < paddleBottomX + paddleWidth) {
        paddleContact = true;
        // Increase the speed on hit
        if (playerMoved) {
          speedY -= 1;
          // Set maximum speed
          if (speedY < -5) {
            speedY = -5;
            computerSpeed = 6;
          }
        }
        speedY = -speedY;
        trajectoryX = ballX - (paddleBottomX + paddleDiff);
        speedX = trajectoryX * 0.3;
      } else if (ballY > height) {
        // Reset Ball
        ballReset();
        computerScore++;
      }
    }
    // Bounce off computer paddle (top)
    if (ballY < paddleDiff) {
      if (ballX > paddleTopX && ballX < paddleTopX + paddleWidth) {
        // Increase speed on hit
        if (playerMoved) {
          speedY += 1;
          // Set maximum speed
          if (speedY > 5) {
            speedY = 5;
          }
        }
        speedY = -speedY;
      } else if (ballY < 0) {
        // Reset Ball, add to Player Score
        ballReset();
        playerScore++;
      }
    }
  }


// Computer Movement
function computerAI() {
    if (playerMoved) {
      if (paddleTopX + paddleDiff < ballX) {
        paddleTopX += computerSpeed;
      } else {
        paddleTopX -= computerSpeed;
      }
    }
  }

function showGameOver(winner){
    canvas.hidden=true;
    gameOverElement.textContent='';
    gameOverElement.classList.add('game-over');
    const title =document.createElement('h1');
    title.textContent=`${winner} Wins!`;
    const playAgainBtn=document.createElement('button');
    playAgainBtn.setAttribute('onclick','startGame()');
    playAgainBtn.textContent="Let's Play Again!";
    gameOverElement.append(title,playAgainBtn);
    body.appendChild(gameOverElement);
}

function gameOver(){
    if(playerScore===winningScore || computerScore===winningScore)
    {
        isGameOver=true;
        const winner=playerScore===winningScore ? 'Player' : 'Computer';
        showGameOver(winner);
    }
}

function animate() {
    renderCanvas();
    ballMove();
    ballBoundaries();
    computerAI();
    gameOver();
    if (!isGameOver) {
      window.requestAnimationFrame(animate);
    }
  }

function startGame(){
    if(isGameOver && !newGame){
        body.removeChild(gameOverElement);
        canvas.hidden=false;
    }
    isGameOver=false;
    newGame=false;
    playerScore=0;
    computerScore=0;
    ballReset();
    createCanvas();
    animate();
    canvas.addEventListener('mousemove',(e)=>{
        // console.log(e.clientX);
        playerMoved=true;
        paddleBottomX=e.clientX-canvasPosition-paddleDiff;
        if(paddleBottomX<paddleDiff){
            paddleBottomX=0;
        }
        if(paddleBottomX>width-paddleWidth){
            paddleBottomX=width-paddleWidth;
        }
        canvas.style.cursor='none';
    });

}

startGame(); 

