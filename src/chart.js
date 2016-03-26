var config = require('./chartConfig.js');
var getAllData = require('./dataGetter.js').getAllData;
var analyze = require('./analyze.js');
var objectAssign = require('object-assign');

var chartContainer = document.querySelector('.chartContainer');
var dollarsContainer = document.querySelector('.chartContainer--dollars');
var roublesContainer = document.querySelector('.chartContainer--roubles');

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
	var mData = dataByCurrency.menExp;
	var wData = dataByCurrency.womenExp;

	var cData = mData.map(function(item, i) {
		var title = (i !== mData.length - 1) ? (i * 3 + 1) + '-' + (i * 3 + 3) : i * 3 + '+';
		return [title, mData[i] || 0, wData[i] || 0]
	});

	return [
		prepareOneChartData(cData, 'Валюта', container, 'По стажу работы'),
		prepareOneChartData([['Везде', dataByCurrency.men, dataByCurrency.women]], 'Currency' , container),
		prepareOneChartData([['В Питере',dataByCurrency.spb.men, dataByCurrency.spb.women]], 'City', container),
		prepareOneChartData([['В Москве',dataByCurrency.msk.men, dataByCurrency.msk.women]], 'City', container)
	];
}
function prepareCommonData(data) {
	var roubles = analyze.prepareDataByCurrency(analyze.getRoubles(data));
	var dollars = analyze.prepareDataByCurrency(analyze.getDollars(data));
	return prepareDataViews(roubles, roublesContainer)
		.concat(prepareDataViews(dollars, dollarsContainer))
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
	var formatter = new google.visualization.NumberFormat({fractionDigits: 0});
	formatter.format(barData, 1);
	formatter.format(barData, 2);

	var view = new google.visualization.DataView(barData);
	var barChart = new google.visualization.ColumnChart(chartElement);
	var localConfig = data.title ? objectAssign({title:data.title}, config) : config;
	barChart.draw(view, localConfig);
}