require('./loader.css');
require('./switcher.css');
require('./style.css');
var switcher = require('./containerSwitcher.js');
var drawChart = require('./chart.js');
var getAllData = require('./dataGetter.js').getAllData;


switcher.init();
drawChart();

