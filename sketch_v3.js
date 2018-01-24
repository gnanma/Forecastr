/*

//OpenWeather data used along with OpenWeather icons in this version
//API Key bcbb1535e010ecf8a195d60261f8b63c

//5 day forecast OpenWeather url
//http://api.openweathermap.org/data/2.5/forecast?q=London,uk&appid=bcbb1535e010ecf8a195d60261f8b63c&unit=metric

//current weather OpenWeather url
//http://api.openweathermap.org/data/2.5/weather?q=London,uk&appid=bcbb1535e010ecf8a195d60261f8b63c

*/

//global variables
var displayWidth; // date display + equals 8 slots + 7 gaps + 2 edge gaps
var displayHeight; // equals five times day hight + some padding
var displayWidthMax=1200; //
var displayWidthMin=400; //
var displayStartX;
var displayStartY;
var dayWidth = 50;
var dayHeight = 100;
var forecast; //JSON data of 5 day weather forecast
var weather;  //JSON data of current weather
var minTemp5Days;
var maxTemp5Days;
var minRain5Days;
var maxRain5Days;
var meanTemp5Days;
var barHeight;
var drops = [];
var inputCity;
var button;
var topPadding = 40;
var bottomPadding = 10;
var isPreLoadDone = false;
var imageX = 0;
var imageY = 0;
var img = [];

//functions
function preload() {
  getWeatherData();
  loadImages();
  isPreLoadDone = true;
}

function setup() {

  inputCity = createInput();
  button = createButton(' forecast ');
  forecastr();

}

function windowResized() {
  function rain(x1,y1,x2,y2,z1){
    for (var i = 0; i < z1; i++){
      drops.push(new Drop(x1,random(y1,y2),x2,y2,y1,z1));
    }
  }
  drain();
  forecastr();

}

function getWeatherData(){

  //get current weather data

  var url = 'http://api.openweathermap.org/data/2.5/';
  var urlWeather ='weather?q=';
  var urlForecast ='forecast?q=';
  var city ='London';
  var api ='&appid=bcbb1535e010ecf8a195d60261f8b63c';
  var unit = '&units=metric';

 if(isPreLoadDone){
    if((inputCity.value()).length>0) {
      city=inputCity.value();
    }
    drain();
   }
  //get current weather data
  urlWeather = url+urlWeather+city+api+unit;
  weather = loadJSON(urlWeather);
  //get 5 day weather forecast data
  urlForecast = url+urlForecast+city+api+unit;
  forecast = loadJSON(urlForecast,forecastr);
}

function loadImages(){

  img[0] = loadImage('Icons/01d.png');
  img[1] = loadImage('Icons/01n.png');
  img[2] = loadImage('Icons/02d.png');
  img[3] = loadImage('Icons/02n.png');
  img[4] = loadImage('Icons/03d.png');
  img[5] = loadImage('Icons/03n.png');
  img[6] = loadImage('Icons/04d.png');
  img[7] = loadImage('Icons/04n.png');
  img[8] = loadImage('Icons/09d.png');
  img[9] = loadImage('Icons/09n.png');
  img[10] = loadImage('Icons/10d.png');
  img[11] = loadImage('Icons/10n.png');
  img[12] = loadImage('Icons/11d.png');
  img[13] = loadImage('Icons/11n.png');
  img[14] = loadImage('Icons/13d.png');
  img[15] = loadImage('Icons/13n.png');
  img[16] = loadImage('Icons/50d.png');
  img[17] = loadImage('Icons/50n.png');
}

function forecastr(){

  //  print(forecast);

  if (windowWidth > displayWidthMax) {
    displayStartX = 200;
    displayStartY = 200;
    displayWidth = displayWidthMax-80;
  }
  else if (windowWidth < displayWidthMin) {
    displayStartX = 200;
    displayStartY = 200;
    displayWidth = displayWidthMin-80;
  }
  else{
    displayStartX = 200;
    displayStartY = 200;
    displayWidth = windowWidth-80;
  }
  if(windowHeight > 580)
  {
    dayHeight = (windowHeight-100)/5;
    topPadding = dayHeight*0.4;

  }

  dayWidth = displayWidth-20;
  displayHeight = dayHeight * 5 + topPadding + bottomPadding;

  var canvas = createCanvas(displayWidth, displayHeight);
  //var mydiv = document.getElementById("xyz");
  //mydiv.appendChild(canvas);
  background(230, 255, 255);
  findMinMax();
  drawForm();
  drawDays();
  textDates();
  drawTemp();
  textTimeSlots();
  //makeItRain();

}

function drawForm(){


    inputCity.position((windowWidth/2) - ((inputCity.width+button.width)/2), (topPadding/2)+10);
    inputCity.value(forecast.city.name);
    button.position(inputCity.x + inputCity.width, inputCity.y);
    button.mousePressed(getWeatherData);

}

function drawDays(){

  var dayOfFive = 1;
  var dayOfDate = forecast.list[0].dt_txt.substring(8,10);
	for(var i=0;i<5;i++){
    stroke(10,10,250)
    fill(255, 255, 255);
		rect(10, topPadding+(dayHeight*i), dayWidth, dayHeight);
	}

}

function textDates(){

  var dayOfFive = 1;
  var dayOfDate = int(forecast.list[0].dt_txt.substring(8,10))
  var monthOfDate = int(forecast.list[0].dt_txt.substring(5,7))
  textSize(13);
  noStroke();
  fill(110, 10, 253, 100);
  text(dayOfDate, (dayWidth/18), topPadding+(dayHeight*dayOfFive)-(dayHeight/2));
  textSize(12);
  text(getMonth(monthOfDate), (dayWidth/18)-6, topPadding+10+(dayHeight*dayOfFive)-(dayHeight/2));


  for(var i=0;i<forecast.cnt;i++){
    if(int(forecast.list[i].dt_txt.substring(8,10))>dayOfDate){
      dayOfDate = int(forecast.list[i].dt_txt.substring(8,10))
      dayOfFive++;
      textSize(13);
      text(dayOfDate, (dayWidth/18), topPadding+(dayHeight*dayOfFive)-(dayHeight/2));
      textSize(12);
      text(getMonth(monthOfDate), (dayWidth/18)-6, topPadding+10+(dayHeight*dayOfFive)-(dayHeight/2));
    }
  }
}

function drawTemp(){

    var dayOfFive = 0;
    var dayOfDate = int(forecast.list[0].dt_txt.substring(8,10));
    var timeSlot = (int(forecast.list[0].dt_txt.substring(11,13))/3)+1;
    var temp_max = 0;
    var temp_min = 0;
    var rainIntensity = 0;
    noStroke();

    for(var i=0;i<forecast.cnt;i++){
    hourOfDate = forecast.list[i].dt_txt.substring(11,13);
    timeSlot = (int(forecast.list[i].dt_txt.substring(11,13))/3)+1;

    if(int(forecast.list[i].dt_txt.substring(8,10))>dayOfDate){
      dayOfDate = int(forecast.list[i].dt_txt.substring(8,10))
      dayOfFive++;
    }

    temp_max = map(forecast.list[i].main.temp_max,minTemp5Days-5,maxTemp5Days+5,100,0);
    temp_min = map(forecast.list[i].main.temp_min,minTemp5Days-5,maxTemp5Days+5,100,0);
    if (forecast.list[i].weather[0].id>=500 && forecast.list[i].weather[0].id <532) {
      rainIntensity = round(map(forecast.list[i].rain["3h"],0,maxRain5Days,2,150))
    }
    var y0 = (dayOfFive*dayHeight)+topPadding+10;
    var x1 = (dayWidth/9)*(timeSlot);
    var y1 = (dayOfFive*dayHeight)+temp_max+topPadding+10;
    var x2 =  ((dayWidth/9)*(timeSlot))+(dayWidth/9.2);
    var y2 = (dayOfFive*dayHeight)+temp_max;

    var widthRect = x2 - x1;
    var heightRect = (dayHeight)-temp_max-20;

    //add rain graphic
    fill(255,255,255);
    rect(x1+15, y0+20, widthRect-15, y1+heightRect-y0-20); // create small canvas
    if(forecast.list[i].weather[0].id>=500 && forecast.list[i].weather[0].id <532)
    {
      rain (x1+16, y0+20, x1+widthRect-2, y1+heightRect-5,rainIntensity);
    }


    //draw temp bar
    fill('rgba(153, 153, 255, 0.6)')
    rect( x1, y1, widthRect, heightRect);
    imageX = x1+5;
    imageY = y0;

    //write weather description
    if( widthRect>50){
      var descriptionTextSize = map (widthRect,50,80,8,12)
      if(widthRect>80) descriptionTextSize = 12;
      textSize(descriptionTextSize);
      text(forecast.list[i].weather[0].description+"",  x1+5, y0,  widthRect, dayHeight-20);
    }

    //add weather logo
    // placeWeatherLogo(forecast.list[i].weather[0].icon,imageX+5,imageY+5, widthRect*0.7, dayHeight*0.7,y0)

    textSize(9);
    noStroke();
    if (forecast.list[i].main.temp<meanTemp5Days/2)
    {
    fill('rgba(153, 153, 255,0.95)');
    text(round(forecast.list[i].main.temp)+"°", x1+1, y1-2); // temperature with degrees symbol
    }
    else {
    fill('rgba(255,255,255,0.95)');
    text(round(forecast.list[i].main.temp)+"°", x1+1, y1+10); // temperature with degrees symbol
    }
    //text(forecast.list[i].weather[0].description+"", x1+5, y1+10);
    fill('rgba(0,0,255, 0.6)');

    x1 = (dayWidth/10)*(timeSlot+1);
    y1 = (dayOfFive*dayHeight)+temp_min+10;
    x2 =  ((dayWidth/10)*(timeSlot+1))+25;
    y2 = (dayOfFive*dayHeight)+temp_min;
    var heightRect = (dayHeight)-temp_min;

    fill('rgba(255,255,0, 0.3)');
    //rect(x1, y1, widthRect, heightRect);


    }

}

function placeWeatherLogo(icon, x, y, width, height,y0){

    var selectIcon;
    switch(icon)    {
      case '01d': selectIcon =  img[0];  break;
      case '01n': selectIcon =  img[1];  break;
      case '02d': selectIcon =  img[2];  break;
      case '02n': selectIcon =  img[3];  break;
      case '03d': selectIcon =  img[4];  break;
      case '03n': selectIcon =  img[5];  break;
      case '04d': selectIcon =  img[6];  break;
      case '04n': selectIcon =  img[7];  break;
      case '09d': selectIcon =  img[8];  break;
      case '09n': selectIcon =  img[9];  break;
      case '10d': selectIcon =  img[10];  break;
      case '10n': selectIcon =  img[11];  break;
      case '11d': selectIcon =  img[12];  break;
      case '11n': selectIcon =  img[13];  break;
      case '13d': selectIcon =  img[14];  break;
      case '13n': selectIcon =  img[15];  break;
      case '50d': selectIcon =  img[16];  break;
      case '50n': selectIcon =  img[17];  break;
      }
      print(width)
     if (width>70) {

       tint(255, width*2);
       image(selectIcon, x, y,width, width);

     } else if (width>50) {
       tint(255, width*3);
       image(selectIcon, x, y0 ,width*1.1, width*1.1);

     } else {
       tint(255,255);
       image(selectIcon, x, y0 ,width*1.3, width*1.3);

     }

}

function textTimeSlots(){
  var hourOfDay = 0;
  textSize(9);
  fill(110, 10, 253, 100);
  noStroke();
  for(var i=0;i<5;i++){ //day
    for(var j=1;j<9;j++){ //timeslot
      var x1 = (dayWidth/9)*(j);
      hourOfDay = (j-1)*3;
      if (hourOfDay>12){
        text((hourOfDay-12)+"pm", x1, (i+1) * dayHeight + topPadding-3);

      }else {
        text(hourOfDay+"am", x1, (i+1) * dayHeight + topPadding-3);
      }
    }
  }
}

function findMinMax(){
  minTemp5Days = forecast.list[0].main.temp_min;
  maxTemp5Days = forecast.list[0].main.temp_max;
  minRain5Days = 1;
  maxRain5Days = 0;

  for(var i=0;i<forecast.cnt;i++){
      if (forecast.list[i].main.temp_min < minTemp5Days) minTemp5Days = forecast.list[i].main.temp_min;
      if (forecast.list[i].main.temp_max > maxTemp5Days) maxTemp5Days = forecast.list[i].main.temp_max;
      if (forecast.list[i].weather[0].id>=500 && forecast.list[i].weather[0].id <532) {
          if(minRain5Days >= forecast.list[i].rain["3h"])   minRain5Days = forecast.list[i].rain["3h"];
            if(maxRain5Days <= forecast.list[i].rain["3h"])   maxRain5Days = forecast.list[i].rain["3h"];
            //          print(maxRain5Days);
        }

  }
  meanTemp5Days = (maxTemp5Days-minTemp5Days)/2
  barHeight = ceil(maxTemp5Days) - floor(minTemp5Days)
}

function draw() {
//  forecastr();
  makeItRain();
}

function makeItRain(){
  for(var i=0; i<drops.length; i++){
    drops[i].fall();
    drops[i].show();
    }
}

function rain(x1,y1,x2,y2,z1){
  for (var i = 0; i < z1; i++){
    drops.push(new Drop(x1,random(y1,y2),x2,y2,y1,z1));
  }
}

function drain(){
  //for (var i = 0; i < drops.length; i++){
    drops = [];
//  }
}

// drop class
function Drop(x1,y1,x2,y2,y0,level) {
    this.x = x1;
    this.y = y1;
    this.yspeed = random(0.7,2);
    this.diameter = 1;
    var mappedLevel = map(level,0,100,y2,y0+(topPadding*1.5))

    this.fall = function() {
      this.y = this.y + this.yspeed;
      if (this.y>=y2) {
        this.y = y0;
        this.x = random(x1,x2);
      }
    };

    this.show = function() {
    stroke('rgba(0,204,255, 0.3)');
    line(this.x,this.y,this.x,this.y+3);
    stroke('rgba(255,255,255, 0.9)');
    //fill((255,255,255);
    //ellipse(this.x, this.y, this.diameter, this.diameter);
    //fill('rgba(255,255,255, 1)');
    //rect(x1,y1,x2,y2);
    if(this.y<=mappedLevel) line(this.x,this.y-5,this.x,this.y);

    }
};

function getMonth(monthNumber) {
  var monthNames = [
    "Jan", "Feb", "Mar",
    "Apr", "May", "Jun", "Jul",
    "Aug", "Sep", "Oct",
    "Nov", "Dec"
  ];
  var monthIndex = monthNumber-1;

  return monthNames[monthIndex];
}
