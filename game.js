let canvas,count, table, context, isChoose, currentSmall, currentX, currentY, way;

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
        colour:['FireBrick','Indigo','green','Turquoise','DodgerBlue','black','pink'],
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
            size *= 10;
            ctx.fillStyle = this.colourBall(numCol);
            ctx.beginPath();
            ctx.shadowBlur = 1;
            ctx.shadowOffsetX = -2.5;
            ctx.shadowOffsetY = -1.5;
            ctx.shadowColor = "gray";
            ctx.arc(pX,pY,size,0,2*Math.PI,false);
            ctx.closePath();
            ctx.fill();
        },

        drawSquare: function (ctx,pX,pY) {
            let s = canvas.height/9;
            ctx.fillStyle = "Goldenrod";
            ctx.strokeStyle = "DarkGoldenrod";
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.shadowBlur = 13;
            ctx.shadowOffsetX = -2;
            ctx.shadowOffsetY = -3;
            ctx.shadowColor = "Black";
            ctx.closePath();
            ctx.fillRect(pX,pY,s,s);
            ctx.strokeRect(pX,pY,s,s);
            ctx.fill();
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
        count = 0;
        isChoose = false;
        currentSmall = new Array(3);
        canvas = document.getElementById('canvas');
        createCenterCoordinates();
        context = canvas.getContext('2d');
        drawCanvas(context);
        for (let i = 0;i<3;) {
                let a = randomPosition(2);
                let item = new TDraw();
                item.drawBall(context, table[a[0]][a[1]].centX, table[a[0]][a[1]].centY, table[a[0]][a[1]].statSize,
                        table[a[0]][a[1]].numCol);
                i++;
                }
        for (let i = 0;i<3;){
                let a = randomPosition(1);
                currentSmall[i] = a;
                let item = new TDraw();
                item.drawBall(context, table[a[0]][a[1]].centX, table[a[0]][a[1]].centY, table[a[0]][a[1]].statSize,
                        table[a[0]][a[1]].numCol);
                i++;
            }
            count = 6;
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
        const ADD = -6;
        console.log("start "+event.clientX+" "+ event.clientY);
        for (let i = 0; i<table.length;i++){
                let f = false;
                for (let j = 0;j<table.length;j++){
                        if ((table[i][j].startX+(canvas.width/9) >= event.clientX+ADD)
                            && (table[i][j].startX <= (canvas.width/9)+event.clientX+ADD)
                            && (table[i][j].startY+(canvas.height/9) >= event.clientY + ADD)
                                && (table[i][j].startY <= (canvas.height/9)+event.clientY+ADD)){
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
                                            } else if (table[i][j].statSize === 0){
                                                console.log("choose place");
                                                isChoose = false;
                                                if (checkRightLogicMove(currentX, currentY, i, j)) {
                                                    repositionElements(currentX, currentY, i, j);
                                            }else
                                                isChoose = true;
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
    fromSmallToBig();
    if (count < 81)
        createSmallBall();
    else
        alert("You lose!");
    for (let i = 0; i < table.length;i++){
        for (let j = 0; j < table[i].length;j++){
            if (table[i][j].statSize > 0) {
                let item = new TDraw();
                item.drawBall(context, table[i][j].centX, table[i][j].centY, table[i][j].statSize, table[i][j].numCol);
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
    count += 3;
    }

function fromSmallToBig() {
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
    } while (!checkFullness(x));
    while (true) {
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

function checkRightLogicMove(xq,yq,x2,y2) {
        let branch = [];
        let x1 = xq;
        let y1 = yq;
        let c = false;
        way = [];
        way.push([x1,y1]);
    while (true){
        //check branch, shock content
        if (
            (
                (x1 !== 8 && table[x1+1][y1].statSize !== 2 && table[x1+1][y1].statSize !== 3 && table[x1+1][y1].statSize !== 4) &&
                (
                    (y1 !== 8 && table[x1][y1+1].statSize !== 2 && table[x1][y1+1].statSize !== 3 && table[x1][y1+1].statSize !== 4) ||
                    (x1 !== 0 && table[x1-1][y1].statSize !== 2 && table[x1-1][y1].statSize !== 3 && table[x1-1][y1].statSize !== 4) ||
                    (x1 !== 0 && table[x1-1][y1].statSize !== 2 && table[x1-1][y1].statSize !== 3 && table[x1-1][y1].statSize !== 4)
                )
            ) ||
            (
                (y1 !== 8 && table[x1][y1+1].statSize !== 2 && table[x1][y1+1].statSize !== 3 && table[x1][y1+1].statSize !== 4) &&
                (
                    (x1 !== 0 && table[x1-1][y1].statSize !== 2 && table[x1-1][y1].statSize !== 3 && table[x1-1][y1].statSize !== 4) ||
                    (x1 !== 0 && table[x1-1][y1].statSize !== 2 && table[x1-1][y1].statSize !== 3 && table[x1-1][y1].statSize !== 4)
                )
            ) ||
            (
                (x1 !== 0 && table[x1-1][y1].statSize !== 2 && table[x1-1][y1].statSize !== 3 && table[x1-1][y1].statSize !== 4) &&
                (
                    (x1 !== 0 && table[x1-1][y1].statSize !== 2 && table[x1-1][y1].statSize !== 3 && table[x1-1][y1].statSize !== 4)
                )
            )
        ){
            branch.push([x1,y1]);
        }

        if (x1 !== 8 && table[x1+1][y1].statSize !== 2 && table[x1+1][y1].statSize !== 3 &&
            table[x1+1][y1].statSize !== 4){
            x1 += 1;
            table[x1][y1].statSize += 3;
            way.push([x1,y1]);
            if (x1 === x2 && y1 === y2){
                c = true;
                break;
            }
        } else if (y1 !== 8 && table[x1][y1+1].statSize !== 2 && table[x1][y1+1].statSize !== 3 &&
            table[x1][y1+1].statSize !== 4){
            y1 += 1;
            table[x1][y1].statSize += 3;
            way.push([x1,y1]);
            if (x1 === x2 && y1 === y2){
                c = true;
                break;
            }
        } else if (x1 !== 0 && table[x1-1][y1].statSize !== 2 && table[x1-1][y1].statSize !== 3 &&
            table[x1-1][y1].statSize !== 4){
            x1 -= 1;
            table[x1][y1].statSize += 3;
            way.push([x1,y1]);
            if (x1 === x2 && y1 === y2){
                c = true;
                break;
            }
        } else if (y1 !== 0 && table[x1][y1-1].statSize !== 2 && table[x1][y1-1].statSize !== 3 &&
            table[x1][y1-1].statSize !== 4){
            y1 -= 1;
            table[x1][y1].statSize += 3;
            way.push([x1,y1]);
            if (x1 === x2 && y1 === y2){
                c = true;
                break;
            }
        } else {
            if(branch.length === 0) {
                c = false;
                break;
            }
            else{
                //table[x1][y1].statSize += 3;
                x1 = branch[branch.length-1][0];
                y1 = branch[branch.length-1][1];
                branch.splice(branch.length-1,1);
                //table[x1][y1].statSize -= 3;
                for (let i = way.length-1; i>=0;i--){
                    if (way[i][0] === x1 && way[i][1] === y1){
                        break;
                    }
                    way.splice(i,1);
                }
            }
        }
    }

    for (let i = 0; i<table.length;i++){
        for (let j = 0; j < table[i].length;j++){
            if (table[i][j].statSize > 2){
                table[i][j].statSize -= 3;
            }
        }
    }
    return c;
}