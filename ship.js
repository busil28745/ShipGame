const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const FPS = 60; //프레임설정
//해적선
let shipImg = new Image();
shipImg.src ="고잉메리호2331.png";
//포탄
let cannonImg = new Image();
cannonImg.src = "포탄22.png"
//화살표
let arrowImg = new Image();
arrowImg.src = "화살2130.png"

let shipRotateSpeed = 0.3 //배 초기 회전 속도 0.3
let shipSpeed = 0.2; //배 초기 속도 0.2
let cannonSpeed = 0.5; //대포 초기 속도 0.5 let cannonNum = 4; //대포 수
let cannonNum = 1; //대포 알 수
let rightCannonCoolDown = 300; // 사용자 초기 대포 쿨타임
let leftCannonCoolDown = 300; // 사용자 초기 대포 쿨타임
let shipAngle = 0;
let shipX = 300;
let shipY = 200;
let keyUp = 0;
let keyLeft = 0;
let keyRight = 0;
let keyA = 0;
let keyD = 0;

//대포쿨타임
let rightCannonTime = 300;
let leftCannonTime = 300;

document.addEventListener('keydown', (event) => {
    //console.log(event);
    if (event.key == 'ArrowUp') {
        keyUp = 1;
    } else if (event.key == 'ArrowLeft') {
        keyLeft = 1;
    } else if (event.key == 'ArrowRight') {
        keyRight = 1;
    } else if (event.key == 'a') {
        keyA = 1;
    } else if (event.key == 'd') {
        keyD = 1;
    } 
});

document.addEventListener('keyup', (event) => {
    if (event.key == 'ArrowUp') {
        keyUp = 0;
    } else if (event.key == 'ArrowLeft') {
        keyLeft = 0;
    } else if (event.key == 'ArrowRight') {
        keyRight = 0;
    } else if (event.key == 'a') {
        keyA = 0;
    } else if (event.key == 'd') {
        keyD = 0;
    } 
});

//포탄클래스
class Cannon {
    constructor(x, y, agl, spd, dir) {
        this.x = x;
        this.y = y;
        this.agl = agl;
        this.spd = spd;
        this.dir = dir;
    }
    move() {
        if(this.dir == "right") {
            this.x += this.spd * Math.sin((this.agl+90) * Math.PI / 180);
            this.y -= this.spd * Math.cos((this.agl+90) * Math.PI / 180);
        } else if (this.dir == "left") {
            this.x += this.spd * Math.sin((this.agl+270) * Math.PI / 180);
            this.y -= this.spd * Math.cos((this.agl+270) * Math.PI / 180);
        }
    }
}

Cannons = [];

function step() {
    rightCannonTime--;
    leftCannonTime--;

    if ( keyRight == 1 ) {
        shipAngle += shipRotateSpeed;
    }
    if ( keyLeft == 1 ) {
        shipAngle -= shipRotateSpeed;
    }
    if ( keyUp == 1 ) {
        //console.log("test");
        shipX += shipSpeed * Math.sin(shipAngle * Math.PI / 180);
        shipY -= shipSpeed * Math.cos(shipAngle * Math.PI / 180);
    }
    if (keyD == 1 && rightCannonTime <= 0) {
        rightCannonTime = rightCannonCoolDown;
        for ( i=0 ; i < cannonNum ; i++ ) {
            cannon = new Cannon(shipX, shipY + (i-1)*3, shipAngle, cannonSpeed, "right");
            Cannons.push(cannon);
        }
    }
    if (keyA == 1 && leftCannonTime <= 0) {
        leftCannonTime = leftCannonCoolDown;
        for ( i=0 ; i < cannonNum ; i++ ) {
            cannon = new Cannon(shipX, shipY + (i-1)*3, shipAngle, cannonSpeed, "left");
            Cannons.push(cannon);
        }
    }
    Cannons.forEach((cannon, index)=> {
        //대초 이동
        cannon.move();
        //대포 벽면 충돌시 제거
        if ( cannon.x < 0 || cannon.x > 600 || cannon.y < 0 || cannon.y > 400 ) {
            Cannons.splice(index, 1);
        }
    });
}

function draw() {
    //캔버스 초기화
    ctx.clearRect(0,0,canvas.clientWidth,canvas.height);

    ctx.fillStyle = "#4D81F0";
    ctx.fillRect(0,0,600,400);

    ctx.font = "10px Arial";
    ctx.fillStyle = "#000000";
    ctx.fillText("CREATED BY BUSIL", 500, 10);

    //대포 쿨타임
    if ( leftCannonTime <= 0 ) {
        ctx.font = "15px Arial";
        ctx.fillStyle = "#000000";
        ctx.fillText("LEFT READY", 5, 395);
    }
    if ( rightCannonTime <= 0 ) {
        ctx.font = "15px Arial";
        ctx.fillStyle = "#000000";
        ctx.fillText("RIGHT READY", 495, 395);
    }

    //화살표 출력 및 좌표 재위치
    ctx.translate(20,20);
    ctx.rotate(shipAngle * Math.PI / 180);
    ctx.drawImage(arrowImg, 0 - arrowImg.width/2, 0 - arrowImg.height/2, arrowImg.width, arrowImg.height);
    ctx.rotate(2 * Math.PI - (shipAngle * Math.PI / 180));
    ctx.translate(-20, -20);
    ctx.save();

    //포
    Cannons.forEach((cannon, index)=> {
        ctx.drawImage(cannonImg, cannon.x, cannon.y, cannonImg.width, cannonImg.height);
    });

    //배 출력
    ctx.translate(shipX, shipY); 
    ctx.rotate(shipAngle * Math.PI / 180);
    ctx.drawImage(shipImg, 0 - shipImg.width / 2, 0 - shipImg.height / 2, shipImg.width, shipImg.height);
    ctx.restore();
}

function game() {
    step();
    draw();
}

setInterval(game, 1000/FPS)

