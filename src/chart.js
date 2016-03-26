var config = require('./chartConfig.js');
var getAllData = require('./dataGetter.js').getAllData;
var analyze = require('./analyze.js');
var objectAssign = require('object-assign');

var chartContainer = document.querySelector('.chartContainer');
var dollarsContainer = document.querySelector('.chartContainer--currency-dollars');
var roublesContainer = document.querySelector('.chartContainer--currency-roubles');
var bothContainer = document.querySelector('.chartContainer--currency-both');

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
	var mExpData = dataByCurrency.menExp;
	var wExpData = dataByCurrency.womenExp;

	var expData = mExpData.map(function(item, i) {
		var title = (i !== mExpData.length - 1) ? (i * 3 + 1) + '-' + (i * 3 + 3) : i * 3 + '+';
		return [title, mExpData[i] || 0, wExpData[i] || 0]
	});
	var cityData = [['Суммарно', dataByCurrency.men, dataByCurrency.women],
		['В Москве', dataByCurrency.cities.msk.men, dataByCurrency.cities.msk.women],
		['В Питере', dataByCurrency.cities.spb.men, dataByCurrency.cities.spb.women],
		['В остальных городах', dataByCurrency.cities.allOther.men, dataByCurrency.cities.allOther.women]
		];

	return [
		prepareOneChartData(expData, 'Валюта', container, 'По стажу работы'),
		prepareOneChartData(cityData, 'City', container, 'По городам')
	];
}
function prepareCommonData(data) {

	var roublesData = analyze.getRoubles(data);
	var dollarsData = analyze.getDollars(data);
	var bothData = roublesData.concat(analyze.convertDollarsToRoubles(dollarsData));
	//var roubles = analyze.prepareDataByCurrency(roublesData);
	//var dollars = analyze.prepareDataByCurrency(dollarsData);
	var bothInRoubles = analyze.prepareDataByCurrency(bothData);

	return prepareDataViews(bothInRoubles, bothContainer);
	//.concat(prepareDataViews(dollars, dollarsContainer))
	//.concat(prepareDataViews(bothInRoubles, bothContainer))
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