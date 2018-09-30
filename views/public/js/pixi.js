//import('pixi.js');
$(document).ready(()=>{
let currentTitle = document.title;
let indexTitle = "Kiai";
let gameTitle = "GameRoom"; 
//canvas handler/switch statement for different pixi canvases;
switch(currentTitle){
    case indexTitle : 
        menuPixiCanvas();
        break;
    case gameTitle : 
        gamePixiCanvas();
        break;
}
//initialize pixiMenu.
function menuPixiCanvas(){
    //Create a Pixi Application
    let menuApp = new PIXI.Application({width: 700, height: 400, antialiase: true, transparent: true, resolution: 1});
    //Add the canvas that Pixi automatically created for you to the HTML document
    //menuApp.renderer.backgroundColor = 0x061639;
    document.getElementById('pixiMenu').appendChild(menuApp.view);
    //draws lines on the menu.
    drawMenu(menuApp);
}//end of pixiMenuInit

function drawMenu(pixiApp){
    let menu = pixiApp;
    //draw circles.
    let circle = new PIXI.Graphics();
    circle.lineStyle( 2, 0x333333 , 1 );
    circle.drawCircle( 100 , 50 , 30 );
    circle.endFill();
    circle.alpha = 0.5;
    //add circles to canvas
    menu.stage.addChild(circle);
    circle.interactive = true;
    circle.hitArea = new PIXI.Circle( 100, 50 , 30 );
    circle.mouseover = function(mouseData){ circle.beginFill(0x333333,1);
                                            console.log("this worked!");}
    circle.mouseout = function(mouseData){this.alpha = 0.5;}
} //end of drawMenu.

//initialize game Canvas
function gamePixiCanvas(){
    //Create a Pixi Application
    let gameApp = new PIXI.Application({width: 500, height: 500, transparent: true, antialiase: true, resolution: 1});
    //Add the canvas that Pixi automatically created for you to the HTML document
    document.getElementById('display').appendChild(gameApp.view);
}
}); //end of #indexbody.