/*
//OpenWeather API Key bcbb1535e010ecf8a195d60261f8b63c

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
var meanTemp5Days;
var barHeight;
var drops = [];
var inputCity;
var button;
var topPadding = 40;
var bottomPadding = 10;
var isPreLoadDone = false;

//functions
function preload() {
  getWeatherData();
  isPreLoadDone = true;
}

function setup() {

  inputCity = createInput();
  button = createButton(' forecast ');
  forecastr();

}

function windowResized() {
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
   }
  //get current weather data
  urlWeather = url+urlWeather+city+api+unit;
  weather = loadJSON(urlWeather);
  //get 5 day weather forecast data
  urlForecast = url+urlForecast+city+api+unit;
  forecast = loadJSON(urlForecast,forecastr);
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

  dayWidth = displayWidth-20;
  displayHeight = dayHeight * 5 + topPadding + bottomPadding;

  var canvas = createCanvas(displayWidth, displayHeight);
  background(230, 255, 255);
  findMinMax();
  drawForm();
  drawDays();
  textDates();
  drawTemp();
  textTimeSlots();

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
    if(int(forecast.list[i].dt_txt.substring(8,10))>dayOfDate || (int(forecast.list[i].dt_txt.substring(5,7))>monthOfDate && int(forecast.list[i].dt_txt.substring(8,10))<dayOfDate)){
      monthOfDate = int(forecast.list[i].dt_txt.substring(5,7));
      dayOfDate = int(forecast.list[i].dt_txt.substring(8,10));
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
    var monthOfDate = int(forecast.list[0].dt_txt.substring(5,7));
    var timeSlot = (int(forecast.list[0].dt_txt.substring(11,13))/3)+1;
    var temp_max = 0;
    var temp_min = 0;

    noStroke();

    for(var i=0;i<forecast.cnt;i++){
    hourOfDate = forecast.list[i].dt_txt.substring(11,13);
    timeSlot = (int(forecast.list[i].dt_txt.substring(11,13))/3)+1;

    if(int(forecast.list[i].dt_txt.substring(8,10))>dayOfDate || (int(forecast.list[i].dt_txt.substring(5,7))>monthOfDate && int(forecast.list[i].dt_txt.substring(8,10))<dayOfDate)){
      dayOfDate = int(forecast.list[i].dt_txt.substring(8,10))
      monthOfDate = int(forecast.list[0].dt_txt.substring(5,7));
      dayOfFive++;
    }

    temp_max = map(forecast.list[i].main.temp_max,minTemp5Days-5,maxTemp5Days+5,100,0);
    temp_min = map(forecast.list[i].main.temp_min,minTemp5Days-5,maxTemp5Days+5,100,0);
    var y0 = (dayOfFive*dayHeight)+topPadding+10;
    var x1 = (dayWidth/9)*(timeSlot);
    var y1 = (dayOfFive*dayHeight)+temp_max+topPadding+10;
    var x2 =  ((dayWidth/9)*(timeSlot))+(dayWidth/9.2);
    var y2 = (dayOfFive*dayHeight)+temp_max;

    var widthRect = x2 - x1;
    var heightRect = (dayHeight)-temp_max-20;

    //		fill('rgba(0,255,0, 0.3)');
    //    rect(x1, y1, widthRect, heightRect);
    fill('rgba(153, 153, 255, 0.6)')
    rect( x1, y1, widthRect, heightRect);
    //  print(x1 +" "+ y1 +" "+ widthRect +" "+ heightRect);
    //    fill('rgba(0, 0, 0, 0.6)')
    //    rect( x1, y0, widthRect, dayHeight-20);
    if( widthRect>50){
    var descriptionTextSize = map (widthRect,50,80,10,14)
    if(widthRect>80) descriptionTextSize = 14;
    textSize(descriptionTextSize);
    text(forecast.list[i].weather[0].description+"",  x1+5, y0,  widthRect, dayHeight-20);
    }
    // print(x1 +" "+ y1 +" "+ x2 +" "+ y2)
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
    //print(forecast.list[i].weather[0].id)
    if(forecast.list[i].weather[0].id>=500 && forecast.list[i].weather[0].id <532)
    {
      rain (x1+15, (dayOfFive*dayHeight)+30, x1+widthRect, y1+heightRect-10)
    }

    x1 = (dayWidth/10)*(timeSlot+1);
    y1 = (dayOfFive*dayHeight)+temp_min+10;
    x2 =  ((dayWidth/10)*(timeSlot+1))+25;
    y2 = (dayOfFive*dayHeight)+temp_min;
    var heightRect = (dayHeight)-temp_min;

    fill('rgba(255,255,0, 0.3)');
    //rect(x1, y1, widthRect, heightRect);


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

  for(var i=0;i<forecast.cnt;i++){
      if (forecast.list[i].main.temp_min < minTemp5Days) minTemp5Days = forecast.list[i].main.temp_min;
      if (forecast.list[i].main.temp_max > maxTemp5Days) maxTemp5Days = forecast.list[i].main.temp_max;
  }
  meanTemp5Days = (maxTemp5Days-minTemp5Days)/2
  barHeight = ceil(maxTemp5Days) - floor(minTemp5Days)
}

function draw() {
//  forecastr();
}
function makeItRain(){
  for(var i=0; i<drops.length; i++){
    drops[i].fall();
    drops[i].show();
    }
}

function rain(x1,y1,x2,y2){
  for (var i = 0; i < 100; i++){
    drops.push(new Drop(random(x1,x2),random(y1,y2),x2,y2));
  }
}

// drop class
function Drop(x1,y1,x2,y2) {
    this.x = x1;
    this.y = y1;
    this.yspeed = random(0.7,4);
    this.diameter = 1;

    this.fall = function() {
      this.y = this.y + this.yspeed;
      if (this.y>=y2) {
        this.y = y1;
        this.x = random(x1,x2);
      }
    };

    this.show = function() {
    //ellipse(this.x, this.y, this.diameter, this.diameter);
    fill(255,255,255,255);
    //rect(x1,y1,x2,y2);
    stroke(0,204,255);
    line(this.x,this.y,this.x,this.y+3);
    stroke(255,255,255);
    //fill((255,255,255);
    line(this.x,this.y-5,this.x,this.y);

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
