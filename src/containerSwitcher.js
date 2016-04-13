var globalSwitcher = document.querySelector('.containerSwitcher-global');
var allChartsContainer = document.querySelector('.allChartsContainer');
var localSwitchers = [];
var drawChart = require('./chart.js');

module.exports = {
	init: function() {
		globalSwitcher.addEventListener('change', switchGlobalView);
	},
	createSwitcher: createSwitcher
};

function closest(element, selector) {
	while (element && element.nodeType === 1) {
		if (element.matches(selector)) {
			return element;
		}
		element = element.parentNode;
	}
	return null;
}

function switchView(e) {
	switchLocalView(e.target);
}

function switchLocalView(switcher, override, showIt) {
	var chartContainer = closest(switcher, '.chartContainer');
	var options = closest(switcher, '.containerSwitcher').querySelectorAll('input');

	var id = chartContainer ? chartContainer.id : null;
	showIt = override ? showIt : options[0].checked;

	if (showIt) {
		drawChart.drawCommon(id);
	} else {
		drawChart.drawIt(id);
	}

	if (override) {
		options[0].checked = showIt;
		options[1].checked = !showIt;
	}
}

function switchGlobalView(e) {
	var options = closest(e.target, '.containerSwitcher').querySelectorAll('input');
	var newState = options[0].checked;
	localSwitchers.forEach(function(switcher) {
		switchLocalView(switcher, true, newState);
	})
}

function createSwitcher(container) {
	var newSwitcher = globalSwitcher.cloneNode(true);
	newSwitcher.classList.remove('containerSwitcher-global');

	localSwitchers.push(newSwitcher);

	newSwitcher.innerHTML = newSwitcher.innerHTML
		.replace(/"((common)|(it)|(sphere))"/g, '$1' + localSwitchers.length);

	container.appendChild(newSwitcher);

	newSwitcher.addEventListener('change', switchView);
}