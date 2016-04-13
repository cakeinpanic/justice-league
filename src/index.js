require('./style/loader.styl');
require('./style/switcher.styl');
require('./style/style.styl');
var switcher = require('./containerSwitcher.js');
var drawChart = require('./chart.js');

switcher.init();
drawChart.init();


