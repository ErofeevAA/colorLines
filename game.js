let canvas,count, table, context, isChoose, currentSmall, moveCX, moveCY, currentX, currentY, way, audio,currentScore,maxScore = 0, idTimer,t;

TCoordinatsAndStates = new Class({
    initialize: function (i,j) {
        let C = (canvas.width/9)/2-2;
        this.centX = C + (i*(canvas.width/9));
        this.centY = C + (j*(canvas.height/9));
        this.startX = i*(canvas.width/9);
        this.startY = j*(canvas.height/9);
        },
    startX:0,
    startY:0,
    centX: 0,
    centY: 0,
    statSize:0,
    numCol:0
});
TDraw = new Class({
    colour:['FireBrick','Indigo','green','yellow','DodgerBlue','black','pink'],
    colourBall: function(c){
        return this.colour[c];
        }.protect(),

     gradientBall: function(ctx, pX, pY, size, numCol) {
        let gradient = ctx.createRadialGradient(pX, pY, size/8, pX, pY, size);
        gradient.addColorStop(1, this.colourBall(numCol));
        gradient.addColorStop(0, '#F8F8FF');
        return gradient;
    }.protect(),

    drawBall : function(ctx, pX, pY, size, numCol){
       size *= 10;
       ctx.fillStyle = this.gradientBall(ctx, pX, pY, size, numCol);
       ctx.beginPath();
       ctx.shadowBlur = 1;
       ctx.shadowOffsetX = -2.5;
       ctx.shadowOffsetY = -1.5;
       ctx.shadowColor = "gray";
       ctx.arc(pX,pY,size,0,2*Math.PI,false);
       ctx.closePath();
       ctx.fill();
       },

    drawSquare: function (ctx,pX,pY,s) {
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
    idTimer = [];
    t = 0;
    count = 7;
    currentScore = 0;
    isChoose = false;
    currentSmall = new Array(3);
    canvas = document.querySelector('.canvas');
    createCenterCoordinates();
    context = canvas.getContext('2d');
    drawCanvas(context);
    canvas.disabled = true;
    for (let i = 0;i<4;) {
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
        createForecastBalls(i,table[a[0]][a[1]].numCol);
        i++;
    }
    score();
}

function drawCanvas(ctx) {
    ctx.save();
    ctx.fillStyle = 'gray';
    ctx.fillRect(0,0,canvas.width,canvas.height);
    ctx.restore();
    for (let i = 0; i < canvas.width; i += canvas.width/9) {
        for (let j = 0; j < canvas.height; j += canvas.height/9){
            let item = new TDraw();
            item.drawSquare(ctx,i,j,canvas.width/9);
        }
    }
}

function selectElement(event) {
    console.log("mouse coordinates: "+event.clientX+" "+ event.clientY);
    for (let i = 0; i<table.length;i++){
        let f = false;
        for (let j = 0;j<table.length;j++){
            if (checkClick(i,j,event.clientX,event.clientY)){
                console.log("pos "+i+" "+j);
                f = true;
                if (!isChoose) {
                    if (table[i][j].statSize === 2) {
                        console.log("choose ball");
                        currentX = i;
                        currentY = j;
                        isChoose = true;
                    }
                } else{
                    if (i === currentX && j === currentY){
                        console.log("reset");
                        isChoose = false;
                    } else if (table[i][j].statSize === 0){
                        console.log("choose place");
                        isChoose = false;
                        if (checkLogicMove(currentX, currentY, i, j)) {
                            repositionElements(currentX, currentY, i, j);
                        } else
                            isChoose = true;
                    } else if (table[i][j].statSize === 1){
                        console.log("choose place with small ball");
                        isChoose = false;
                        if (checkLogicMove(currentX, currentY, i, j)) {
                            let a;
                            for(let z = 0; z<currentSmall.length;z++){
                                console.log("count "+count);
                                if (currentSmall[z][0] === i && currentSmall[z][1] === j){
                                    if (count > 79){
                                        let c = table[i][j].numCol;
                                        table[i][j].statSize = 2;
                                        table[i][j].numCol = table[currentX][currentY].numCol;
                                        table[currentX][currentY].numCol = c;
                                        if(c === table[i][j].numCol) {
                                            deleteLines(i, j);
                                        } else {
                                            deleteLines(i,j);
                                            deleteLines(currentX,currentY);
                                        }
                                        redrawCanvas();
                                        break;
                                    }
                                    a = randomPosition(1);
                                    repositionElements(i,j,a[0],a[1]);
                                    currentSmall[z] = a;
                                    deleteLines(a[0],a[1]);
                                    break;
                                }
                            }
                            repositionElements(currentX, currentY, i, j);
                        } else
                            isChoose = true;
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

function checkClick(x1,y1,clickX,clickY) {
    const BORDER = -6;
    return (table[x1][y1].startX + (canvas.width / 9) >= clickX + BORDER)
        && (table[x1][y1].startX <= (canvas.width / 9) + clickX + BORDER)
        && (table[x1][y1].startY + (canvas.height / 9) >= clickY + BORDER)
        && (table[x1][y1].startY <= (canvas.height / 9) + clickY + BORDER);
}

function redrawCanvas() {
    drawCanvas(context);
    let c = false;
    if (count < 79){
        fromSmallToBig(3);
        createSmallBall(3);
    } else if (count < 81){
        fromSmallToBig(3);
        createSmallBall(81-count);
    } else {
        c = true;
    }
    score();
    for (let i = 0; i < table.length; i++) {
        for (let j = 0; j < table[i].length; j++) {
            if (table[i][j].statSize > 0) {
                let item = new TDraw();
                item.drawBall(context, table[i][j].centX, table[i][j].centY, table[i][j].statSize, table[i][j].numCol);
            }
        }
    }
    if (c)
        endDialog();
}


function repositionElements(x1,y1,x2,y2) {
    moveCX = table[x1][y1].centX;
    moveCY = table[x1][y1].centY;
    if (table[x2][y2].statSize === 0)
        startMove(x1,y1,x2,y2);
    else {
        table[x2][y2].statSize = table[x1][y1].statSize;
        table[x1][y1].statSize = 0;
        table[x2][y2].numCol = table[x1][y1].numCol;
    }

}

let c = 0;
function animationMove(x1,y1,x2,y2) {
    drawCanvas(context);
    if(moveCX === table[x2][y2].centX && moveCY === table[x2][y2].centY) {
        c = 0;
        stopMove();
        table[x2][y2].statSize = table[x1][y1].statSize;
        table[x1][y1].statSize = 0;
        table[x2][y2].numCol = table[x1][y1].numCol;
        deleteLines(x2,y2);
        redrawCanvas();
    } else {
        moveCX = table[way[c][0]][way[c][1]].centX;
        moveCY = table[way[c][0]][way[c][1]].centY;
        c++;
        for (let i = 0; i < table.length; i++) {
            for (let j = 0; j < table[i].length; j++) {
                if (table[i][j].statSize > 0) {
                    let item = new TDraw();
                    if (i === x1 && j === y1) {
                        item.drawBall(context, moveCX, moveCY, table[i][j].statSize, table[i][j].numCol);
                    }
                    else {
                        item.drawBall(context, table[i][j].centX, table[i][j].centY, table[i][j].statSize, table[i][j].numCol);
                    }
                }
            }
        }
    }

}

function startMove(x1,y1,x2,y2){
    idTimer[t++] = setInterval('animationMove('+x1+','+y1+','+x2+','+y2+');',50);
}

function stopMove() {
    for (let i = 0; i < t; i++) {
        clearInterval(idTimer[i]);
    }
}

function createSmallBall(c) {
    for (let i = 0; i<c;i++) {
        currentSmall[i] = randomPosition(1);
        count++;
        createForecastBalls(i,table[currentSmall[i][0]][currentSmall[i][1]].numCol);
    }
}

function fromSmallToBig(c) {
    for (let i = 0; i<c;i++) {
        table[currentSmall[i][0]][currentSmall[i][1]].statSize = 2;
        deleteLines(currentSmall[i][0],currentSmall[i][1]);
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

function checkLogicMove(x1, y1, x2, y2) {
    let branch = [];
    let c = false;
    way = [];
    way.push([x1,y1]);
    while (true){
        if (x1 === x2 && y1 === y2){
            c = true;
            break;
        }
        //check branch, shock content
        if (
            (
                (x1 !== 8 && table[x1+1][y1].statSize !== 2 && table[x1+1][y1].statSize !== 3 && table[x1+1][y1].statSize !== 4) &&
                (
                    (y1 !== 8 && table[x1][y1+1].statSize !== 2 && table[x1][y1+1].statSize !== 3 && table[x1][y1+1].statSize !== 4) ||
                    (x1 !== 0 && table[x1-1][y1].statSize !== 2 && table[x1-1][y1].statSize !== 3 && table[x1-1][y1].statSize !== 4) ||
                    (y1 !== 0 && table[x1][y1-1].statSize !== 2 && table[x1][y1-1].statSize !== 3 && table[x1][y1-1].statSize !== 4)
                )
            ) ||
            (
                (y1 !== 8 && table[x1][y1+1].statSize !== 2 && table[x1][y1+1].statSize !== 3 && table[x1][y1+1].statSize !== 4) &&
                (
                    (x1 !== 0 && table[x1-1][y1].statSize !== 2 && table[x1-1][y1].statSize !== 3 && table[x1-1][y1].statSize !== 4) ||
                    (y1 !== 0 && table[x1][y1-1].statSize !== 2 && table[x1][y1-1].statSize !== 3 && table[x1][y1-1].statSize !== 4)
                )
            ) ||
            (
                (x1 !== 0 && table[x1-1][y1].statSize !== 2 && table[x1-1][y1].statSize !== 3 && table[x1-1][y1].statSize !== 4) &&
                (
                    (y1 !== 0 && table[x1][y1-1].statSize !== 2 && table[x1][y1-1].statSize !== 3 && table[x1][y1-1].statSize !== 4)
                )
            )
        ){
            branch.push([x1,y1]);
        }

        if (x1 !== 8 && table[x1+1][y1].statSize !== 2 && table[x1+1][y1].statSize !== 3 &&
            table[x1+1][y1].statSize !== 4 && x1<x2) {
            x1 += 1;
            table[x1][y1].statSize += 3;
            way.push([x1, y1]);
        } else if (y1 !== 8 && table[x1][y1+1].statSize !== 2 && table[x1][y1+1].statSize !== 3 &&
            table[x1][y1+1].statSize !== 4 && y1<y2){
            y1 += 1;
            table[x1][y1].statSize += 3;
            way.push([x1,y1]);
        } else if (x1 !== 0 && table[x1-1][y1].statSize !== 2 && table[x1-1][y1].statSize !== 3 &&
            table[x1-1][y1].statSize !== 4 && x1>x2){
            x1 -= 1;
            table[x1][y1].statSize += 3;
            way.push([x1,y1]);
        } else if (y1 !== 0 && table[x1][y1-1].statSize !== 2 && table[x1][y1-1].statSize !== 3 &&
            table[x1][y1-1].statSize !== 4 && y1>y2){
            y1 -= 1;
            table[x1][y1].statSize += 3;
            way.push([x1,y1]);
        }
        else if (x1 !== 8 && table[x1+1][y1].statSize !== 2 && table[x1+1][y1].statSize !== 3 &&
            table[x1+1][y1].statSize !== 4){
            x1 += 1;
            table[x1][y1].statSize += 3;
            way.push([x1,y1]);
        } else if (y1 !== 8 && table[x1][y1+1].statSize !== 2 && table[x1][y1+1].statSize !== 3 &&
            table[x1][y1+1].statSize !== 4){
            y1 += 1;
            table[x1][y1].statSize += 3;
            way.push([x1,y1]);
        } else if (x1 !== 0 && table[x1-1][y1].statSize !== 2 && table[x1-1][y1].statSize !== 3 &&
            table[x1-1][y1].statSize !== 4){
            x1 -= 1;
            table[x1][y1].statSize += 3;
            way.push([x1,y1]);
        } else if (y1 !== 0 && table[x1][y1-1].statSize !== 2 && table[x1][y1-1].statSize !== 3 &&
            table[x1][y1-1].statSize !== 4){
            y1 -= 1;
            table[x1][y1].statSize += 3;
            way.push([x1,y1]);
        } else {
            if(branch.length === 0) {
                c = false;
                break;
            }
            else{
                x1 = branch[branch.length-1][0];
                y1 = branch[branch.length-1][1];
                branch.splice(branch.length-1,1);
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

audio = new Audio();
audio.src = 'Audio/fon_Music.mp3';
audio.autoplay = true;
audio.loop = true;
function soundClick() {
    console.log("play music "+audio.paused);
    if (!audio.paused) {
        audio.pause()
    }
    else audio.play();
}

function getLines(x,y){
    let lines = [false,[[x,y]],[[x,y]],[[x,y]],[[x,y]]];

    let l, r, d, u, lu, ru, ld, rd;
    l = r = d = u = lu = ru = ld = rd = true;

    let i = 1;
    while(l || r || u || d || lu || ru || ld || rd){
        if(l && x-i>=0 && table[x][y].numCol===table[x-i][y].numCol && table[x][y].statSize===table[x-i][y].statSize){
            lines[1].push([x-i,y]);
        } else {
            l = false;
        }
        if(r && x+i<=8 && table[x][y].numCol===table[x+i][y].numCol && table[x][y].statSize===table[x+i][y].statSize){
            lines[1].push([x+i,y]);
        } else {
            r = false;
        }

        if(u && y-i>=0 && table[x][y].numCol===table[x][y-i].numCol && table[x][y].statSize===table[x][y-i].statSize){
            lines[2].push([x,y-i]);
        } else {
            u = false;
        }
        if(d && y+i<=8 && table[x][y].numCol===table[x][y+i].numCol && table[x][y].statSize===table[x][y+i].statSize){
            lines[2].push([x,y+i]);
        } else {
            d = false;
        }

        if(lu && y-i>=0 && x-i>=0 && table[x][y].numCol===table[x-i][y-i].numCol && table[x][y].statSize===table[x-i][y-i].statSize){
            lines[3].push([x-i,y-i]);
        } else {
            lu = false;
        }
        if(rd && y+i<=8 && x+i<=8 && table[x][y].numCol===table[x+i][y+i].numCol && table[x][y].statSize===table[x+i][y+i].statSize){
            lines[3].push([x+i,y+i]);
        } else {
            rd = false;
        }

        if(ld && y+i<=8 && x-i>=0 && table[x][y].numCol===table[x-i][y+i].numCol && table[x][y].statSize===table[x-i][y+i].statSize){
            lines[4].push([x-i,y+i]);
        } else {
            ld = false;
        }
        if(ru && y-i>=0 && (x+i)<=8 && table[x][y].numCol===table[x+i][y-i].numCol && table[x][y].statSize===table[x+i][y-i].statSize){
            lines[4].push([x+i,y-i]);
        } else {
            ru = false;
        }

        i++;
    }
    for(let i = lines.length-1; i>=1; i--){
        if(lines[i].length < 5){
            lines.splice(i,1);
        }else{
            lines[0] = true;
        }

    }
    return lines;

}

function deleteLines(x,y) {
    let a = getLines(x,y);
    if (a[0] === true){
        for (let i = 1;i<a.length;i++){
            if (a[i].length===5){currentScore+=3;}else
            if (a[i].length===6){currentScore+=6;}else
            if (a[i].length===7){currentScore+=11;}else
            if (a[i].length===8){currentScore+=14;}else
            if (a[i].length===9){currentScore+=15;}
            for (let j = 0; j<a[i].length;j++) {
                if (a[i] !== undefined) {
                    console.log(a[i][j][0] + " " + a[i][j][0]);
                    table[a[i][j][0]][a[i][j][1]].statSize = 0;
                    --count;
                }
            }
        }
    }
}
function createForecastBalls(i, colour) {
    let canvas2 = document.querySelector('.canvas_for_small_ball');
    let context2 = canvas2.getContext('2d');
    let c=i;
    let foreball = new TDraw();
    if (c===0){
        foreball.drawBall(context2, c+=25,c, 2, colour);
    } else if(c===1){
        foreball.drawBall(context2, c+=25,c+50, 2, colour);
    } else if(c===2){
        foreball.drawBall(context2, c+=25,c+100, 2, colour);
    }
}

function score() {
    if(currentScore > maxScore){
        maxScore = currentScore;
    }
    let s  = document.querySelector('.score');
    s.innerHTML = 'Score: '+currentScore +' <br><br>Record: '+ maxScore;
}

function endDialog() {
    new TDraw().drawSquare(context,0,0,canvas.width);
    context.strokeStyle = "black";
    context.font = 'bold 40pt sans-serif';
    context.strokeText("Game Over", canvas.width/4,canvas.height/2.5);
}

function bumpColour(c) {
    for (let i = 0;i<table.length;i++){
        for (let j = 0;j<table.length;j++){
            if (table[i][j].statSize === 2 && table[i][j].numCol === c){
                table[i][j].statSize = 0;
            }
        } 
    }
}