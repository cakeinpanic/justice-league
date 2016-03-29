var config = require('./config/chartConfig.js');
var getAllData = require('./dataGetter.js').getAllData;
var analyze = require('./analyze.js');
var objectAssign = require('object-assign');

var chartContainer = document.querySelector('.chartContainer');
var charts = [];
var chartsData = {};

module.exports = {
	init: function() {
		google.load('visualization', '1.0', {packages: ['corechart']});
		google.setOnLoadCallback(draw);

		function draw() {
			getAllData()
				.then(prepareChartsData)
				.then(function(allData) {
					chartsData = allData;
					var numberOfCharts = chartsData.common.length;
					charts = createChartInstances(numberOfCharts);
					drawCharts(chartsData.common);
				})
		}
	},
	drawIt: function() {
		drawCharts(chartsData.itOnly);
	},
	drawCommon: function() {
		drawCharts(chartsData.common);
	}

};

function prepareDataViews(dataByCurrency, container) {
	var expStats = dataByCurrency.exp;
	var expData = Object.keys(expStats)
		.map(function(key) {
		return [key, expStats[key].men ,expStats[key].women]
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
	return [
		prepareOneChartData(expData, 'Валюта', 'По стажу работы'),
		prepareOneChartData(cityData, 'City', 'По городам')
	];
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
	chartContainer.classList.add('loaded');
	data.forEach(function(dataItem, i) {
		drawOneChart(charts[i], dataItem);
	});
}

function prepareOneChartData(data, columnName, title) {
	var columns = [columnName, 'Мужчины', 'Женщины'];
	return {info: [columns].concat(data), title: title};
}

function createChartInstance(container) {
	var chartInstance = document.createElement('div');
	chartInstance.classList.add('chart');
	container.appendChild(chartInstance);
	return chartInstance;
}

function createChartInstances(numberOfCharts) {
	var chartInstances = [];
	while (numberOfCharts) {
		var chartElement = createChartInstance(chartContainer);
		var barChart = new google.visualization.ColumnChart(chartElement);
		chartInstances.push(barChart);
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