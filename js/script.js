let canv = document.querySelector(".canvas");
let ctx = canv.getContext('2d');

const height = canv.height;
const width = canv.width;
const sizeCoin = 4;
const sizeSnake = 16;

if( localStorage.highestScore === undefined ) localStorage.setItem('highestScore','0');
document.querySelector('.highest-score').innerHTML = `${localStorage.getItem('highestScore')}`;

let scoreboard = 0;
let snake = [];
let coin = {
    x:0,
    y:0,
}

snake[0] = {
    x:(width/2)-sizeSnake/2,
    y:(height/2)-sizeSnake/2,
}

document.addEventListener("keydown",moveDirection);

// control directions
let currentDirection = null;
let queue = [];

function moveDirection(event){
    if(event.keyCode == 37 && currentDirection != "right" && currentDirection != "left" ) queue.unshift("left");
    else if(event.keyCode == 39 && currentDirection != "left" && currentDirection != "right") queue.unshift("right");
    else if(event.keyCode == 38 && currentDirection != "down" && currentDirection != "up") queue.unshift("up");
    else if(event.keyCode == 40 && currentDirection != "up" && currentDirection != "down" ) queue.unshift("down");
}

spawnCoin();
drawSnake();

function drawGame(){
    let snakeX = snake[0].x;
    let snakeY = snake[0].y;

    drawCoin();

    // refresh game
    for(let i = 1; i < snake.length; i++){
        if( snakeX == snake[i].x && snakeY == snake[i].y ){
            document.location.reload();
            document.querySelector('.highest-score').innerHTML = `${localStorage.getItem('highestScore')}`;
        }
    }

    // control snake
    if (queue.length){
        if(queue[queue.length - 1] != currentDirection){
            currentDirection = queue[queue.length - 1];
        }
    }

    if(currentDirection == "left"){
        snakeX -= sizeSnake;
        for(let i = 0; i < snake.length; i++){
            ctx.clearRect(snake[i].x,snake[i].y,sizeSnake,sizeSnake);
        }
        queue.pop();
    } 
    if(currentDirection == "right"){
        snakeX += sizeSnake;
        for(let i = 0; i < snake.length; i++){
            ctx.clearRect(snake[i].x,snake[i].y,sizeSnake,sizeSnake);
        }
        queue.pop();
    } 
    if(currentDirection == "up"){
        snakeY -= sizeSnake;
        for(let i = 0; i < snake.length; i++){
            ctx.clearRect(snake[i].x,snake[i].y,sizeSnake,sizeSnake);
        }
        queue.pop();
    } 
    if(currentDirection == "down"){
        snakeY += sizeSnake;
        for(let i = 0; i < snake.length; i++){
            ctx.clearRect(snake[i].x,snake[i].y,sizeSnake,sizeSnake);
        }
        queue.pop();
    }

    // border collision
    if( snakeX == 400 ){
        snakeX = 0;
    }else if ( snakeX == 0-sizeSnake ){
        snakeX = 400;
    }
    if( snakeY == 400 ){
        snakeY = 0;
    }else if ( snakeY == 0-sizeSnake ){
        snakeY = 400;
    }

    // eat coin, spawn new coin, add tail to snake
    function check(callback){
        callback();
    }
    function repeat(){
        for(let i = 1; i < snake.length; i++){
            if(snake[i].x == coin.x && snake[i].y == coin.y){
                spawnCoin();
                check(repeat);
            }
        }
    }
    check(repeat);

    if( snakeX == coin.x && snakeY == coin.y){
        spawnCoin();
        score();
        if (scoreboard > localStorage.highestScore) localStorage.setItem('highestScore',scoreboard); // highest score LOCALSTORAGE
    }else{
        snake.pop();
    }
    let newTail = {
        x: snakeX,
        y: snakeY,
    }
    snake.unshift(newTail);
    drawSnake();
}

let game = setInterval(drawGame,100);

function score(){
    scoreboard += 3;
    document.querySelector('.score-table').innerHTML = `${scoreboard}`;
}

function drawSnake(){
    for(let i = 0; i < snake.length; i++){
       ctx.fillStyle = "#239B56";
       ctx.fillRect(snake[i].x,snake[i].y,sizeSnake,sizeSnake); 
    }
}

function spawnCoin(){
    coordCoin();
    drawCoin();
}

function drawCoin(){
    ctx.beginPath();
    ctx.fillStyle = "#F1C40F";
    ctx.arc(coin.x + sizeSnake / 2,coin.y + sizeSnake / 2 ,sizeCoin,0,10);
    ctx.fill();
    ctx.closePath();
}

function coordCoin(){
    coin.x = getRandomInt(0, width / sizeSnake ) * sizeSnake;
    coin.y = getRandomInt(0, height / sizeSnake ) * sizeSnake ;
}

function getRandomInt(min,max){
    return Math.floor( Math.random() * (max - min) + min );
}