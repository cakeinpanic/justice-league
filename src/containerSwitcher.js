var containerSwitcher = document.querySelector('.containerSwitcher');
var container = document.querySelector('.chartContainer');
var drawChart = require('./chart.js');

module.exports = {
	init: function() {
		containerSwitcher.addEventListener('change', switchView);
	}
};

function switchView() {
	var options = document.getElementsByName('sphere');
	if (options[0].checked) {
		container.classList.remove('chartContainer-showIt');
		drawChart.drawCommon();
	} else {
		drawChart.drawIt();
		container.classList.add('chartContainer-showIt');
	}
}
