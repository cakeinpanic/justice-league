var $ = require('jquery');
var currencySwitcher = document.getElementById('currencySwitcher');
var container = document.querySelector('.chartContainer');
var drawChart = require('./chart.js');

module.exports = {
	init: function() {
		currencySwitcher.addEventListener('change', switchCurrency);
	}
};

function switchCurrency() {
	if (currencySwitcher.checked) {
		container.classList.remove('chartContainer-showIt');
		drawChart.drawCommon();
	} else {
		drawChart.drawIt();
		container.classList.add('chartContainer-showIt');
	}
}
