require('./style/loader.css');
require('./style/switcher.css');
require('./style/style.css');
var switcher = require('./containerSwitcher.js');
var drawChart = require('./chart.js');

switcher.init();
drawChart();


