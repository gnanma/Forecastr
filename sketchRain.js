/*
 OpenWeather API Key bcbb1535e010ecf8a195d60261f8b63c
//5 day forecast OpenWeather url
//http://api.openweathermap.org/data/2.5/forecast?
//q=London,uk&appid=bcbb1535e010ecf8a195d60261f8b63c&unit=metric

//current weather OpenWeather url
//http://api.openweathermap.org/data/2.5/weather?q=London,uk&appid=bcbb1535e010ecf8a195d60261f8b63c

*/

//global variables
var displayWidth; // date display + equals 8 slots + 7 gaps + 2 edge gaps
var displayHeight; // equals five times day hight + some padding
var dayWidth = 100;
var dayHeight = 100;
var forecast; //JSON data of 5 day weather forecast
var weather;  //JSON data of current weather
var minTemp5Days;
var maxTemp5Days;
var barHeight;
var drops = [];
var snowflakes = [];
var topPadding = 40;
var clouds = [];
var inputCity;
var button;
var dropSizeSlider;

//functions
function setup() {
  dayWidth = windowWidth-100;
  displayWidth = windowWidth-80;
  displayHeight = dayHeight * 5 + 30;



  createCanvas(displayWidth, displayHeight);
  background(255,255,255);
  // create sliders
    dropSizeSlider = createSlider(0, 100, 8);
    dropSizeSlider.position(500, 220);
    text("Drop size",410,183)
    windSlider = createSlider(0, 100, 50);
    windSlider.position(500, 250);
    text("Wind",432,211)
//     bSlider = createSlider(0, 100, 50);
//     bSlider.position(500, 280);

   precipitation(100,100,300,400,100,1,0); //rain
   precipitation(100,100,300,400,100,0,0); //snow

}


function precipitation(x1,y1,x2,y2,z1,isRain,isSnow){
// var dropsCount = x2-x1;
// for (var i = 0; i < dropsCount; i++){
//   fill(10,255,255,1);
//   rect(x1,y1,x2,y2);
//   drops.push(new Drop(random(x1,x2),random(y1,y2),x2,y2));
// }

if(isRain==1){
  for (var i = 0; i < z1; i++){
    drops.push(new Drop(x1,y1,x2,y2,y1,50));
  }
}

if(isSnow==1){
  for (var i = 0; i < z1; i++){
    drops.push(new Snowflake(x1,y1,x2,y2,y1,50));
  }
}

}
// drop class
function Drop(x1,y1,x2,y2,y0,level) {
    this.x = x1;
    this.y = y1;
    this.yspeed = 1;//random(0.7,2);
    this.xspeed = 1;//random(0.7,2);
    this.diameter = dropSizeSlider.elt.value;
    var mappedLevel = map(level,0,100,y2,y0+(topPadding))
    print("Level:  \t"+level+" y2: "+y2+"  y0:"+y0+" tpded: "+(topPadding*1.5) +" maps: "+mappedLevel);
    print("\n diameter:  " + dropSizeSlider.elt.value + " " + this.diameter );


    this.fall = function() {
      this.y = this.y + this.yspeed;
      this.x = this.x - this.xspeed;
      if (this.y>=y2 || this.x>x2 || this.x<x1 ) { //}|| this.x<x2  ) {
        this.y = random(y0,y2);
        this.x = random(x1,x2);
      }
    };

    this.show = function() {
    //line(this.x,this.y,this.x,this.y);
    //stroke('rgba(255,255,255, 0.9)');
    strokeWeight(0);
    //stroke('rgba(0,204,255, 0.3)');
    fill('rgba(102, 204, 255, 0.1)');
    ellipse(this.x, this.y, this.diameter, this.diameter);
    if(this.y<=mappedLevel){
      fill('rgba(255, 255, 255, 1)');
//      ellipse(this.x+1, this.y-10, this.diameter, this.diameter);
    }
    //stroke('rgba(0,204,255, 0.3)');
    //fill('rgba(255,255,255, 0.3)');
    //ellipse(this.x, this.y, this.diameter, this.diameter);
    //fill('rgba(255,255,255, 1)');
    //rect(x1,y1,x2,y2);
    //if(this.y<=mappedLevel) line(this.x,this.y-2,this.x,this.y);

    }
};

//snowflake class
function Snowflake(x1,y1,x2,y2,y3) {
  this.x = x1;
  this.y = y1;
  this.yspeed = 1;
  this.diameter = 1;

  this.fall = function() {
    this.y = this.y + this.yspeed;
    if (this.y>=y2) {
      this.y = y3;
      this.x = x1;
      stroke(255,255,255);
      //fill((255,255,255);
      line(this.x,this.y-5,this.x,this.y+5);
    }
  };

  this.show = function() {
  //ellipse(this.x, this.y, this.diameter, this.diameter);
  fill(255,255,255,255);
  //rect(x1,y1,x2,y2);
  stroke(0,204,255);
  strokeWeight(4);
  line(this.x,this.y,this.x,this.y+3);
  stroke(255,255,255);
  //fill((255,255,255);
  line(this.x,this.y-30,this.x,this.y);

  }
};

function cloud(x, y, size) {
	fill(255, 255, 255);
	stroke('rgba(0,255,0,0.25)');
  strokeWeight(0.2);
	arc(x, y, 25 * size, 20 * size, PI + TWO_PI, TWO_PI);
	arc(x + 10, y, 25 * size, 45 * size, PI + TWO_PI, TWO_PI);
	arc(x + 25, y, 25 * size, 35 * size, PI + TWO_PI, TWO_PI);
	arc(x + 40, y, 32 * size, 20 * size, PI + TWO_PI, TWO_PI);
}

 function mousePressed() {
// 	var newCloud = {
// 		xpos: mouseX,
// 		ypos: mouseY,
// 		size: random(0.8, 1.3)
// 	};
// 	clouds.push(newCloud);

 drain();
}


function drain(){
  //for (var i = 0; i < drops.length; i++){
    drops = [];
//  }
}

function draw() {
//  background(80, 180, 205);

    for(var i=0; i<drops.length; i++){
    drops[i].fall();
    drops[i].show();
    }



    for (i = 0; i < clouds.length; i++) {
    var currentObj = clouds[i];
    cloud(currentObj.xpos, currentObj.ypos, currentObj.size);
    //	currentObj.xpos += 0.5;
    //currentObj.ypos += random(-0.5, 0.5);
    }

}
