let canvas, table, balls, context;

TCoordinatsAndStates = new Class({
   initialize: function (i,j) {
       this.centX = this.C + (i*(canvas.width/9));
       this.centY = this.C + (j*(canvas.height/9));
   },
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
    for (let i = 0; i < canvas.width; i += canvas.width/9) {
        context.beginPath();
        context.moveTo(i, 0);
        context.lineTo(i, canvas.height);
        context.stroke();
    }

    for (let i = 0; i < canvas.height; i += canvas.height/9) {
        context.beginPath();
        context.moveTo(0, i);
        context.lineTo(canvas.width, i);
        context.stroke();
    }
    ctx.restore();
}

function selectElement(event) {

}

function move() {

}

function positionElements(x1,y1,x2,y2) {

}

function createSmallBall(x1,y1) {

}

function fromSmalltoBig(x1,y1) {

}

function randomColor() {
    return Math.floor(Math.random()*7);
}

function randomPozition(arr) {

}