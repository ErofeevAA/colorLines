let canvas, table, balls, context, isChoose, currentX, currentY;

TCoordinatsAndStates = new Class({
   initialize: function (i,j) {
       this.centX = this.C + (i*(canvas.width/9));
       this.centY = this.C + (j*(canvas.height/9));
       this.startX = i*(canvas.width/9);
       this.startY = j*(canvas.height/9);
   },
    startX:0,
    startY:0,
    centX: 0,
    centY: 0,
    C:33,
    statSize:0,
    numCol:0

});

TBall = new Class({
    initialize: function(pX,pY,size,numCol) {
        this.posX = pX;
        this.posY = pY;
        this.colBall = this.colorBall(numCol);
        this.rBall = size;
    },
    posX: 0,
    posY: 0,
    colBall:'rgb(0,0,0)',
    rBall: 0,
    colorBall: function(color){
        switch (color){
            case 0:
                return 'red';
            case 1:
                return 'yellow';
            case 2:
                return 'green';
            case 3:
                return 'orange';
            case 4:
                return 'blue';
            case 5:
                return 'black';
            case 6:
                return 'pink';
        }
    },
   /* create later
   gradientBall: function(ctx){
        console.log("Current start number for gradient: "+ this.rBall/8);
        console.log("Current numbers. posX="+this.posX+" posY="+this.posY);
        let gradient = ctx.createRadialGradient(this.posX,
            this.posY, this.rBall / 8, this.posX, this.posY, this.rBall);
        gradient.addColorStop(1, this.colBall);
        gradient.addColorStop(0, '#fff');
        return gradient;
    },*/

    draw : function(ctx){
        ctx.fillStyle = this.colBall;
        ctx.beginPath();
        ctx.arc(this.posX, this.posY, this.rBall, 0, 2*Math.PI, false);

        ctx.closePath();
        ctx.fill();
    }
});

function createCenterCoordinates() {
    table = new Array(9);
    for (let i = 0; i < table.length; i++){
        table[i] = new Array(9);
    }
    for (let i = 0; i<table.length;i++){
        for(let j = 0; j < table.length;j++){
            table[i][j] = new TCoordinatsAndStates(i,j);
        }
    }
}

function firstSettings() {
    isChoose = false;
    balls = [];
    canvas = document.getElementById('canvas');
    createCenterCoordinates();
    if (canvas.getContext){
       context = canvas.getContext('2d');
       drawCanvas(context);
       for (let i = 0;i<3;) {
           let x = Math.floor(Math.random()*9);
           let y = Math.floor(Math.random()*9);
           if (table[x][y].statSize === 0) {
               table[x][y].statSize = 2;
               table[x][y].numCol = randomColor();
               let item = new TBall(table[x][y].centX, table[x][y].centY, 20,table[x][y].numCol);
               item.draw(context);
               balls.push(item);
               i++;
           }
       }
       for (let i = 0;i<3;){
           let x = Math.floor(Math.random()*9);
           let y = Math.floor(Math.random()*9);
           if (table[x][y].statSize === 0) {
               table[x][y].statSize = 1;
               table[x][y].numCol = randomColor();
               let item = new TBall(table[x][y].centX, table[x][y].centY, 10,table[x][y].numCol);
               item.draw(context);
               balls.push(item);
               i++;
           }
       }
    }
}

function drawCanvas(ctx) {
    ctx.save();
    ctx.fillStyle = 'gray';
    ctx.fillRect(0,0,canvas.width,canvas.height);
    ctx.restore();
    for (let i = 0; i < canvas.width; i += canvas.width/9) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i, canvas.height);
        ctx.stroke();
    }

    for (let i = 0; i < canvas.height; i += canvas.height/9) {
        ctx.beginPath();
        ctx.moveTo(0, i);
        ctx.lineTo(canvas.width, i);
        ctx.stroke();
    }

}

function selectElement(event) {
    console.log("start "+event.clientX+" "+ event.clientY);
    for (let i = 0; i<table.length;i++){
        let f = false;
        for (let j = 0;j<table.length;j++){
            if ((table[i][j].startX+(canvas.width/9) >= event.clientX)
            && (table[i][j].startX <= (canvas.width/9)+event.clientX)
            && (table[i][j].startY+(canvas.height/9) >= event.clientY)
                && (table[i][j].startY <= (canvas.height/9)+event.clientY)){
                console.log("pos "+i+" "+j);
                f = true;
                if (!isChoose) {
                    if (table[i][j].statSize === 2) {
                        console.log("choose ball");
                        currentX = i;
                        currentY = j;
                        isChoose = true;
                    }
                }else{
                    if (i === currentX && j === currentY){
                        console.log("reset");
                        isChoose = false;
                    }else if (table[i][j].statSize === 0){
                        console.log("choose place");
                        isChoose = false;
                        repositionElements(currentX,currentY,i,j);
                    } else if (table[i][j].statSize === 1){
                        console.log("now reset");
                        isChoose = false;
                    } else {
                        console.log("choose ball");
                        currentX = i;
                        currentY = j;
                        isChoose = true;
                    }
                }
                break;
            }
        }
        if (f){
            break;
        }
    }
}

function move(x1,y1,x2,y2) {
    for (let i = 0;i<balls.length;i++){
        if ((table[x1][y1].centX === balls[i].posX)
          && (table[x1][y1].centY === balls[i].posY)){
            balls.splice(i,1);
            break;
        }
    }
    drawCanvas(context);
    for (let i = 0; i<balls.length;i++){
        balls[i].draw(context);
    }
    let item = new TBall(table[x2][y2].centX, table[x2][y2].centY, 20,table[x2][y2].numCol);
    item.draw(context);
    balls.push(item);
}

function repositionElements(x1,y1,x2,y2) {
    table[x1][y1].statSize = 0;
    table[x2][y2].statSize = 2;
    table[x2][y2].numCol = table[x1][y1].numCol;
    move(x1,y1,x2,y2);
}

function createSmallBall(x,y) {

}

function fromSmalltoBig(x,y) {

}

function randomColor() {
    return Math.floor(Math.random()*7);
}

function randomPozition(arr) {

}