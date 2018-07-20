let canvas, table, context, isChoose, currentSmall, currentX, currentY;

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

TDraw = new Class({
    colour:['red','yellow','green','orange','blue','black','pink'],
    colourBall: function(c){
        return this.colour[c];
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

    drawBall : function(ctx, pX, pY, size, numCol){
        ctx.fillStyle = this.colourBall(numCol);
        ctx.beginPath();
        ctx.arc(pX,pY,size,0,2*Math.PI,false);
        ctx.closePath();
        ctx.fill();
    },
    backgroundSquare: function (ctx) {
        // drawBack in this
        return 'gray';
    },
    drawSquare: function (ctx,pX,pY) {
        let s = canvas.height/9;
        ctx.fillStyle = this.backgroundSquare(ctx);
        ctx.fillRect(pX,pY,s,s);
        ctx.strokeRect(pX,pY,s,s);
    }
});

function createCenterCoordinates() {
    table = new Array(9);
    for (let i = 0; i < table.length; i++){
        table[i] = new Array(9);
        for (let j = 0; j < table.length;j++){
            table[i][j] = new TCoordinatsAndStates(i,j);
        }
    }
}

function firstSettings() {
    isChoose = false;
    currentSmall = new Array(3);
    canvas = document.getElementById('canvas');
    createCenterCoordinates();
    context = canvas.getContext('2d');
    drawCanvas(context);
    for (let i = 0;i<3;) {
        let a = randomPosition(2);
        let item = new TDraw();
        item.drawBall(context, table[a[0]][a[1]].centX, table[a[0]][a[1]].centY, 20,table[a[0]][a[1]].numCol);
        i++;
        }
    for (let i = 0;i<3;){
        let a = randomPosition(1);
        currentSmall[i] = a;
        let item = new TDraw();
        item.drawBall(context, table[a[0]][a[1]].centX, table[a[0]][a[1]].centY, 10,table[a[0]][a[1]].numCol);
        i++;
    }
}

function drawCanvas(ctx) {
    ctx.save();
    ctx.fillStyle = 'gray';
    ctx.fillRect(0,0,canvas.width,canvas.height);
    ctx.restore();
    for (let i = 0; i < canvas.width; i += canvas.width/9) {
        for (let j = 0; j < canvas.height; j += canvas.height/9){
            let item = new TDraw();
            item.drawSquare(ctx,i,j);
        }
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

function move() {
    drawCanvas(context);
    fromSmalltoBig();
    createSmallBall();
    for (let i = 0; i < table.length;i++){
        for (let j = 0; j < table[i].length;j++){
            if (table[i][j].statSize > 0) {
                let item = new TDraw();
                item.drawBall(context, table[i][j].centX, table[i][j].centY, table[i][j].statSize*10, table[i][j].numCol);
            }
        }
    }
}

function repositionElements(x1,y1,x2,y2) {
    table[x1][y1].statSize = 0;
    table[x2][y2].statSize = 2;
    table[x2][y2].numCol = table[x1][y1].numCol;
    move();
}

function animationMove() {

}

function createSmallBall() {
    for (let i = 0; i<currentSmall.length;i++) {
        currentSmall[i] = randomPosition(1);
    }
}

function fromSmalltoBig() {
    for (let i = 0; i<currentSmall.length;i++) {
        table[currentSmall[i][0]][currentSmall[i][1]].statSize = 2;
    }
}

function randomColour() {
    return Math.floor(Math.random()*7);
}

function randomPosition(s) {
    let x;
    let y;
    do {
        x=Math.floor(Math.random()*9);
    }while (!checkFullness(x));
    for (let i = 0;i<table.length;i++){
        y=Math.floor(Math.random()*9);
        if (table[x][y].statSize === 0) {
            table[x][y].statSize = s;
            table[x][y].numCol = randomColour();
            break;
        }
    }
    return [x,y];
}

function checkFullness(x) {
    for (let i = 0; i<table.length;i++){
        if (table[x][i].statSize === 0){
            return true;
        }
    }
    return false;
}