# Forecastr
A simple five day weather forecast visualisation using P5.js framework on Openweather API data built by Gnan Madishetty

v1 - simple text version
v2 - standard Openweather icons used
v3(beta) - custom animations developed ~current version~


How to build and run:
---------------------
Load project folder to a web server. This is a simple HTML5/CSS3/ES6 application. The required libraries and images are included within the project folder with relative paths.
The index html page load with the latest version of forecastr app page loads. The earlier versions and the about page can be loaded by selection from the top navigation menu.

Thought process when creating the solution:
-------------------------------------------
1. Interface design to resemble a calendar view with weather visible for next 5 days.
2. Connect to API and create a simple version that has key weather information.
3. Add icons in place of calendar for a quick view of key weather information.
4. Add graphics to make weather information more intuitive and playful.

Tradeoffs made:
---------------
1. Did not display current weather information (only used forecast data)
2. Load weather data with default as 'London'
3. Limit the maximum size of the application for height and width
4. Created v2 version with boring icons  

Future implementations (features, fixes, technical debt corrections etc):
-------------------------------------------------------------------------
1. Display current weather data information
2. Add graphics for wind
3. Add graphics for sunrise and sunset  
3. Add graphics for clouds
4. Load weather data based on lat/long location

Open Source : https://github.com/gnanma/Forecastr

References:
-----------
visualisation - P5 Javascript framework: https://p5js.org/
Data Source - Openweather : https://openweathermap.org/about

More info:
Processing: https://processing.org/
