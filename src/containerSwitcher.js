var globalSwitcher = document.querySelector('.containerSwitcher-global');
var allChartsContainer = document.querySelector('.allChartsContainer');
var drawChart = require('./chart.js');

var counter = 0;
module.exports = {
	init: function() {
		globalSwitcher.addEventListener('change', switchView);
	},
	createSwitcher: createSwitcher
};

function switchView(e) {
	var options = e.target.closest('.containerSwitcher').querySelectorAll('input');
	var chartConainer = e.target.closest('.chartContainer');

	var id = chartConainer ? chartConainer.id : null;
	var container = chartConainer ? chartConainer : allChartsContainer;

	if (options[0].checked) {
		container.classList.remove('chartContainer-showIt');
		drawChart.drawCommon(id);
	} else {
		drawChart.drawIt(id);
		container.classList.add('chartContainer-showIt');
	}
}

function createSwitcher(container) {
	var newSwitcher = globalSwitcher.cloneNode(true);
	var inner = newSwitcher.innerHTML;
	var suffix = '' + counter++ + '"';

	inner = inner.replace(/"common"/g, 'common' + suffix)
		.replace(/"it"/g, '"it' + suffix)
		.replace(/"sphere"/g, '"sphere' + suffix);

	newSwitcher.innerHTML = inner;
	container.appendChild(newSwitcher);
	newSwitcher.addEventListener('change', switchView)
}