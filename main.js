
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
canvas.width = 800;
canvas.height = 500;

let score = 0;
let gameFrame = 0;
ctx.font = "50px Arial";

//mouse
let canvasPosition = canvas.getBoundingClientRect();
const mouse = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    click : false
}
canvas.addEventListener('mousedown', function(event){
    mouse.click = true;
    mouse.x = event.x - canvasPosition.left;
    mouse.y = event.y - canvasPosition.top;
})
canvas.addEventListener('mouseup', function(){
    mouse.click = false;
})

//player
const abuelitaRight = new Image();
abuelitaRight.src = 'Images/AbuelitaRight.png';
const abuelitaLeft = new Image();
abuelitaLeft.src = 'Images/AbuelitaLeft.png';

class Abuelita {
    constructor(){
        this.x = canvas.width;
        this.y = canvas.height /2;
        this.radius = 50;
        this.angle = 0;
        this.frameX = 0;
        this.frameY = 0;
        this.frame = 0;
        this.spriteWidth = 1141;
        this.spriteHeight = 992;
        // this.image = new Image();
        // this.image.src = "./images/Abuelita.png"
    }
    update(){
        const dx = this.x - mouse.x;
        const dy = this.y - mouse.y;
        if (mouse.x != this.x){
            this.x -= dx/10;
        }
        if(mouse.y != this.y){
            this.y -= dy/10;
        }
    }
    draw(){
        if (mouse.click){
            ctx.lineWidth = 0.2;
            ctx.beginPath();
            ctx.moveTo(this.x, this.y);
            ctx.lineTo(mouse.x, mouse.y);
            ctx.stroke();
        }
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.closePath();
        if (this.x >= mouse.x){
            ctx.drawImage(abuelitaLeft, this.frameX * this.spriteWidth, this.frameY * this.spriteHeight, this.spriteWidth, this.spriteHeight, this.x - 140, this.y - 140, this.spriteWidth/4, this.spriteHeight/4);
        }else{
            ctx.drawImage(abuelitaRight, this.frameX * this.spriteWidth, this.frameY * this.spriteHeight, this.spriteWidth, this.spriteHeight, this.x - 140, this.y - 140, this.spriteWidth/4, this.spriteHeight/4);

        }
    }
}
const player = new Abuelita();

//pavos
const pavosArray =[];
class Pavo {
    constructor(){

        // inverted the x and y axis
        this.y = Math.random() * canvas.height
        this.x = canvas.width + 100
        this.radius = 50;
        this.speed = Math.random()* 5 + 1;
        this.distance;
        this.counted = false;
        this.sound = Math.random() <= 0.5 ? 'sound1' : 'sound2';
    }
    update(){
        // replaced this.y to this.x on this.speed
        this.x -= this.speed;
        const dx = this.x - player.x;
        const dy = this.y - player.y;
        this.distance = Math.sqrt(dx * dx + dy * dy);
    }

    draw(){
        ctx.fillStyle = 'blue';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.closePath();
        ctx.stroke();
    }
}

const pavoPop1 = document.createElement('audio');
pavoPop1.src = "pavo.mp3";

function handlePavo(){
    if(gameFrame % 50 == 0){
        pavosArray.push(new Pavo());
    }
    for (let i = 0; i < pavosArray.length; i++){
        pavosArray[i].update();
        pavosArray[i].draw();   
    }
    for (let i = 0; i < pavosArray.length; i++){
        if (pavosArray[i].y < 0 - pavosArray[i].radius*2){
            pavosArray.splice(i,1);
        }
        if(pavosArray[i].distance < pavosArray[i].radius + player.radius){
            if(!pavosArray[i].counted){
                if(pavosArray[i].sound == 'sound1'){
                    pavoPop1.play();
                }
                score++;
                pavosArray[i].counted = true;
                pavosArray.splice(i, 1);
            }
        }
    }
}

//animacion
function animate(){
    ctx.clearRect(0,0, canvas.width, canvas.height);
    handlePavo();
    player.update();
    player.draw();
    ctx.fillStyle = 'black';
    ctx.fillText('score: ' + score, 10, 50);
    gameFrame++;

    requestAnimationFrame(animate);
}
animate();