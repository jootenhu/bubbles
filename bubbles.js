
var canvas = document.getElementById("myCanvas");
var width = canvas.getAttribute("width");
var height = canvas.getAttribute("height");
var ctx = canvas.getContext("2d");
var colors = ["#ffe680", "#ffaa80", "#66ffcc", "#d5ff80", "#9966ff"];
var i = 0;
var gR = 15;
var growSpeed = 0.01;
var count = 20;
var circles = [];

class Circle {
    constructor(x, y, r, color) {
        this.x = x;
        this.y = y;
        this.r = r;
        this.targetR = gR;
        this.color = color;
        this.speed = 0.05;
        this.bubbleR = r * 1.2;
        this.draw();
    }

    draw() {
        drawCircle(this.x, this.y, this.r, this.color);
    }

    hit(x, y) {
         if ((this.r * this.r) > ((x - this.x) * (x - this.x) + (y -this.y) * (y - this.y))) {
             return true;
         }
    }

    growGradually() {   
        if (this.r < this.targetR) {
            this.r += growSpeed;
            this.bubbleR = this.r * 1.2;  
        } else {
            this.r -= growSpeed;
            this.bubbleR = this.r * 1.2;  
        }
    }

    get Speed() {
        return this.speed;
    }
    get X() {
        return this.x;
    }

    set X(x) {
        this.x = x;
    }

    get Y() {
        return this.y;
    }

    set Y(y) {
        this.y = y;
    }

    get BubbleR() {
        return this.bubbleR;
    }

    get R() {
        return this.r;
    }

    set R(newR) {
        this.r = newR;
    }

    set TargetR(newR) {
        this.targetR = newR;
    }
}

setInterval(draw, 10);

for (i = 0; i < count; i++) {
    var x = Math.floor(Math.random() * width / 2) + width / 4;
    var y = Math.floor(Math.random() * height / 2) + height / 4;
    var c = Math.floor(Math.random() * colors.length);
    circles[i] = new Circle(x, y, 0.1, colors[c]); 
}

canvas.addEventListener("click", function (evt) {
    var mousePos = getMousePos(canvas, evt);
    for (i = 0 ; i < circles.length; i ++) {
        if (circles[i].hit(mousePos.x, mousePos.y) == true) {
            circles[i].targetR = gR * 3;
            if (circles[i].R >= gR * 2) {
                circles[i].targetR = gR;
            }
        }
    }
}, false);

canvas.addEventListener("dblclick", function (evt) {
    var mousePos = getMousePos(canvas, evt);
    for (i = 0 ; i < circles.length; i ++) {
        if (circles[i].hit(mousePos.x, mousePos.y) == true) {          
            circles[i].targetR = gR / 2;           
        }
    }
});


function getMousePos(canvas, evt) {
    var rect = canvas.getBoundingClientRect();
    return {
        x: evt.clientX - rect.left,
        y: evt.clientY - rect.top
    };
}

function drawCircle(p1, p2, r, fillColor) {
    ctx.beginPath();  
    ctx.arc(p1, p2 , r, 0 ,2*Math.PI);
    ctx.fillStyle = fillColor;
    ctx.fill();
    ctx.stroke();
}

function draw() {
    ctx.clearRect(0, 0, width, height);

    var j;
    for (i = 0; i < circles.length; i++) {
        for (j = 0; j < circles.length; j++) {
            circles[j].growGradually();

            overlapping(circles[i], circles[j]);
            circles[i].draw();
        }
    }
}

function overlapping(circle1, circle2) {
    var dx = circle2.X - circle1.X;
    var dy = circle2.Y - circle1.Y;

    var vectorLength = 0;
    if (dx != 0 || dy != 0) {
        vectorLength = Math.sqrt(dx * dx + dy * dy);
    } else {
        vectorLength = 0.001;
    }
    var step = circle1.BubbleR + circle2.BubbleR - vectorLength;
    
    if (step > 0) {
        
        dx /= vectorLength;
        dy /= vectorLength;
        circle1.X -= dx*step/2 * circle1.Speed;
        circle1.Y -= dy*step/2 * circle1.Speed;

        circle2.X += dx*step/2 * circle2.Speed;
        circle2.Y += dy*step/2 * circle2.Speed;
    }   
}

