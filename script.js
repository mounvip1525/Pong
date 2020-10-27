const { body }=document;
const canvas=document.createElement('canvas');
const context=canvas.getContext('2d');
const width=500;
const height=700;


function renderCanvas(){
    //setting the background for the canvas
    context.fillStyle='black';
    context.fillRect(0,0,width,height);
}

function createCanvas(){
    canvas.width=width;
    canvas.height=height;
    body.appendChild(canvas);
    renderCanvas();
}

createCanvas();
