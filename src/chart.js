var config = require('./config/chartConfig.js');
var getAllData = require('./dataGetter.js').getAllData;
var objectAssign = require('object-assign');
var analyze = require('./analyze.js');
var createSwitcher;

var allChartsContainer = document.querySelector('.allChartsContainer');
var wholeContainer = document.querySelector('.container');
var charts = [];
var chartsData = {};


module.exports = {
	init: function() {
		createSwitcher = require('./containerSwitcher.js').createSwitcher;
		google.load('visualization', '1.0', {packages: ['corechart']});
		google.setOnLoadCallback(draw);

		function draw() {
			getAllData()
				.then(prepareChartsData)
				.then(function(allData) {
					chartsData = allData;
					charts = createChartInstances(Object.keys(chartsData.common));
					drawCharts(chartsData.common);
				})
		}
	},
	drawIt: function(id) {
		if (!id) {
			drawCharts(chartsData.itOnly);
		} else {
			drawOneChart(charts[id], chartsData.itOnly[id]);
		}
	},
	drawCommon: function(id) {
		if (!id) {
			drawCharts(chartsData.common);

		} else {
			drawOneChart(charts[id], chartsData.common[id]);
		}
	}

};

function prepareDataViews(dataByCurrency) {
	var expStats = dataByCurrency.exp;
	var expData = Object.keys(expStats)
		.map(function(key) {
			return [key, expStats[key].men, expStats[key].women]
		});
	if (config.vAxis.maxValue < dataByCurrency.maxAverage) {
		config.vAxis.maxValue = dataByCurrency.maxAverage;
	}
	var cityData = [
		['Суммарно', dataByCurrency.men, dataByCurrency.women],
		['В Москве', dataByCurrency.cities.msk.men, dataByCurrency.cities.msk.women],
		['В Питере', dataByCurrency.cities.spb.men, dataByCurrency.cities.spb.women],
		['В остальных городах', dataByCurrency.cities.allOther.men, dataByCurrency.cities.allOther.women]
	];
	return {
		exp: prepareOneChartData(expData, 'Валюта', 'По стажу работы'),
		city: prepareOneChartData(cityData, 'City', 'По городам')
	};
}

function prepareChartsData(data) {
	var allData = analyze.getAllInRoubles(data);
	var itData = analyze.getIT(allData);

	var commonStats = analyze.getAllStats(allData);
	var itOnlyStats = analyze.getAllStats(itData);

	return {
		common: prepareDataViews(commonStats),
		itOnly: prepareDataViews(itOnlyStats)
	};
}

function drawCharts(data) {
	allChartsContainer.classList.add('loaded');
	wholeContainer.classList.add('loaded');
	Object.keys(data).forEach(function(key) {
		drawOneChart(charts[key], data[key]);
	});
}

function prepareOneChartData(data, columnName, title) {
	var columns = [columnName, 'Мужчины', 'Женщины'];
	return {info: [columns].concat(data), title: title};
}

function createChartInstance(container, id) {
	var chartContainer = document.createElement('div');
	var chartInstance = document.createElement('div');
	chartInstance.classList.add('chart');
	chartContainer.classList.add('chartContainer');
	chartContainer.id =  id;
	container.appendChild(chartContainer);
	chartContainer.appendChild(chartInstance);
	createSwitcher(chartContainer);
	return chartInstance;
}

function createChartInstances(keys) {
	var chartInstances = {};
	var numberOfCharts = keys.length;

	while (numberOfCharts) {
		var key = keys[numberOfCharts - 1];
		var chartElement = createChartInstance(allChartsContainer, key);
		var barChart = new google.visualization.ColumnChart(chartElement);
		chartInstances[key] = barChart;
		numberOfCharts--;
	}
	return chartInstances;
}


function drawOneChart(barChart, data) {
	var barData = google.visualization.arrayToDataTable(data.info);
	var formatter = new google.visualization.NumberFormat({fractionDigits: 0, suffix: '₽'});
	formatter.format(barData, 1);
	formatter.format(barData, 2);

	var view = new google.visualization.DataView(barData);
	var localConfig = data.title ? objectAssign({title: data.title}, config) : config;
	barChart.draw(view, localConfig);
	return barChart;
}