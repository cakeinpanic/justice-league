var config = require('./config/chartConfig.js');
var getAllData = require('./dataGetter.js').getAllData;
var analyze = require('./analyze.js');
var objectAssign = require('object-assign');

var chartContainer = document.querySelector('.chartContainer');
var itContainer = document.querySelector('.chartContainer--inner-it');
var roublesContainer = document.querySelector('.chartContainer--inner-roubles');
var bothContainer = document.querySelector('.chartContainer--inner-both');

module.exports = function() {
	google.load('visualization', '1.0', {packages: ['corechart']});
	google.setOnLoadCallback(draw);

	function draw() {
		getAllData()
			.then(prepareCommonData)
			.then(drawCharts);
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
		prepareOneChartData(expData, 'Валюта', container,'По стажу работы'),
		prepareOneChartData(cityData, 'City', container, 'По городам')
	];
}

function prepareCommonData(data) {
	var bothData = analyze.getAllInRoubles(data);
	var bothInRoubles = analyze.getAllStats(bothData);
	var ITOnlyInRoubles = analyze.getAllStats(analyze.getIT(bothData));

	return prepareDataViews(bothInRoubles, bothContainer)
	.concat(prepareDataViews(ITOnlyInRoubles, itContainer));
}
function drawCharts(data) {
	chartContainer.classList.add('loaded');
	data.forEach(drawOneChart);
}

function prepareOneChartData(data, columnName, container, title) {
	var columns = [columnName, 'Мужчины', 'Женщины'];
	return {info: [columns].concat(data), container: container, title: title};
}

function createChartElement(container) {
	var chartElement = document.createElement('div');
	chartElement.classList.add('chart');
	container.appendChild(chartElement);
	return chartElement;
}

function drawOneChart(data) {
	var chartElement = createChartElement(data.container);

	var barData = google.visualization.arrayToDataTable(data.info);
	var formatter = new google.visualization.NumberFormat({fractionDigits: 0, suffix: '₽'});
	formatter.format(barData, 1);
	formatter.format(barData, 2);

	var view = new google.visualization.DataView(barData);
	var barChart = new google.visualization.ColumnChart(chartElement);
	var localConfig = data.title ? objectAssign({title: data.title}, config) : config;
	barChart.draw(view, localConfig);
}