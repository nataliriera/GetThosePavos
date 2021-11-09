


const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
canvas.width = 1000;
canvas.height = 700;

let score = 0;
let gameFrame = 0;
ctx.font = "50px Impact, Haettenschweiler, 'Arial Narrow Bold', sans-serif";
let canvasPosition = canvas.getBoundingClientRect();

//AUDIO 
var audio = new Audio('fondo.m4a');
if (typeof audio.loop == 'boolean') {
    audio.loop = true;
} 
else {
    audio.addEventListener('ended', function(){
        this.currentTime = 0;
        this.play();
    }, false);
}
  audio.play();


//background
class Background {
    //constructor
    constructor(w,h){
        this.x = 0;
        this.y = 0;
        this.width = w;
        this.height = h;
        this.image = new Image();
        this.image.src = "Images/bgcopy.png" // ./ => en este mismo 
    }

    
    draw(){
        //para hacer que el background se mueva
        if(this.x < -canvas.width){
            this.x = 0
        }
        this.x--;

        //dibujar la imagen
        ctx.drawImage(this.image,this.x,this.y,this.width,this.height)
        ctx.drawImage(
            this.image,
            this.x + this.width,
            this.y,
            this.width,
            this.height
        )
    }
}


//mouse

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
            ctx.beginPath();
            ctx.moveTo(this.x, this.y);
            if (gameFrame % 2 == 0) {
                this.frame++;
                if (this.frame >= 6) this.frame = 0
                if ( this.frame == 0) {
                    this.frameX = 0;
                } else this.frameX++;
                
              
            }
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
const imgPavo = new Image();
imgPavo.src = "Images/Flying.png"
class Pavo {
    constructor(){

        // inverted the x and y axis
        this.frame = 0;
        this.y = Math.random() * canvas.height
        this.x = canvas.width + 100
        this.radius = 50;
        this.speed = Math.random()* 5 + 1;
        this.distance;
        this.counted = false;
        this.sound = Math.random() <= 0.5 ? 'sound1' : 'sound2';
        this.frameX = 0;
        this.spriteWidth = 764;
        this.spriteHeight = 646;
    }
    update(){
        // replaced this.y to this.x on this.speed
        this.x -= this.speed;
        const dx = this.x - player.x;
        const dy = this.y - player.y;
        this.distance = Math.sqrt(dx * dx + dy * dy);
        if (gameFrame % 100 == 0) {
            this.frame++;
            if (this.frame > 15) this.frame = 0
            if ( this.frame == 4 ||  this.frame == 9 ||  this.frame == 14) {
                this.frameX = 1;
            } else this.frameX++; 
    
            if ( this.frame == 4 ||  this.frame == 9 ||  this.frame == 14) {
                this.frameY = 0;
            } else this.frameY++;

        }
        
    } 

    draw(){
        ctx.drawImage(imgPavo, this.frameX * this.spriteWidth, 0, this.spriteWidth, this.spriteHeight, this.x - 68, this.y - 68, this.spriteWidth/4, this.spriteHeight/4);
    }
}

const pavoPop1 = document.createElement('audio');
pavoPop1.src = "pavo.mp3";

function handlePavo(){
    
    if(gameFrame % 50 == 0){
        pavosArray.push(new Pavo());
    }
    pavosArray.forEach((pavo, index_pavo)=>{
        pavo.draw()
        pavo.update()
        if(pavo.distance < pavo.radius + player.radius){
            if(!pavo.counted){
                if(pavo.sound == 'sound1'){
                    pavoPop1.play()
                }
                score++;
                pavo.counted = true;
                pavosArray.splice (index_pavo, 1)
            }
        }
        if(pavo.x + pavo.radius < 0){
            pavosArray.splice(index_pavo, 1)
        }
    })
    
}

// enemy 
const enemiesArray =[];
const imgEnemy = new Image();
imgEnemy.src = "Images/farmer.png"
class Enemy {
    constructor(){

        // inverted the x and y axis
        this.frame = 0;
        this.y = Math.random() * canvas.height
        this.x = canvas.width + 100
        this.radius = 100;
        this.speed = Math.random()* 1+ 1;
        this.distance;
        this.counted = false;
        this.frameX = 0;
        this.spriteWidth = 1351;
        this.spriteHeight = 1027;
    }
    update(){
        // replaced this.y to this.x on this.speed
        this.x -= this.speed;
        const dx = this.x - player.x;
        const dy = this.y - player.y;
        this.distance = Math.sqrt(dx * dx + dy * dy);
        if (gameFrame % 8 == 0) {
            this.frame++;
            if (this.frame >= 9) this.frame = 0
            if ( this.frame == 0) {
                this.frameX = 0;
            } else this.frameX++;
        }
        
    } 

    draw(){
        
        ctx.drawImage(imgEnemy, this.frameX * this.spriteWidth, 0, this.spriteWidth, this.spriteHeight, this.x - 140, this.y - 140, this.spriteWidth/4, this.spriteHeight/4);
    }
}

const abuela = new Abuelita();


   


function handleEnemy(){
    
    if(gameFrame % 500 == 0){
        enemiesArray.push(new Enemy());
    }
    enemiesArray.forEach((enemy)=>{
        enemy.draw()
        enemy.update()
        if(enemy.distance < enemy.radius + player.radius){
            if(!enemy.counted){
                
                window.location.href = "game-over/go.html"
            }
        }
        
    })
    
}

const bg = new Background(canvas.width,canvas.height)
const goBg = new Background(canvas.width,canvas.height)
function animate(){
    ctx.clearRect(0,0, canvas.width, canvas.height);
    bg.draw();
    handlePavo();
    handleEnemy();
    player.update();
    player.draw();
    ctx.fillStyle = '#9A281A';
    ctx.fillText('score: ' + score, 10, 50);
    gameFrame++;

   
    requestAnimationFrame(animate);
}
animate();