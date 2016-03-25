require('./loader.css');
require('./switcher.css');
require('./style.css');
var switcher = require('./containerSwitcher.js');
var drawChart = require('./chart.js');

switcher.init();
drawChart();
