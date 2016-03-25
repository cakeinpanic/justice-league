var config = require('./chartConfig.js');
var getAllData = require('./dataGetter.js').getAllData;
var analyze = require('./analyze.js');
var avg = require('./analyze.js').getAverageSalaryOfGroup;

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
	return [
		prepareOneChartData([dataByCurrency.men, dataByCurrency.women], 'Currency', 'Везде', container),
		prepareOneChartData([dataByCurrency.spb.men, dataByCurrency.spb.women], 'City', 'В Питере', container),
		prepareOneChartData([dataByCurrency.msk.men, dataByCurrency.msk.women], 'City', 'В Москве', container)
	];
}
function prepareCommonData(data) {
	var roubles = prepareDataByCurrency(analyze.getRoubles(data));
	var dollars = prepareDataByCurrency(analyze.getDollars(data));
	return prepareDataViews(roubles, roublesContainer)
		.concat(prepareDataViews(dollars, dollarsContainer))
}
function prepareDataByCurrency(data) {
	var men = analyze.getMen(data);
	var women = analyze.getWomen(data);
	var cities = analyze.getCities(data);
	return {
		men: avg(men),
		women: avg(women),
		spb: {
			men: avg(analyze.getMen(cities.spb)),
			women: avg(analyze.getWomen(cities.spb))
		},
		msk: {
			men: avg(analyze.getMen(cities.msk)),
			women: avg(analyze.getWomen(cities.msk))
		}
	}
}
function drawCharts(data) {
	chartContainer.classList.add('loaded');
	data.forEach(drawOneChart);
}

function prepareOneChartData(data, columnName, columnValue, container) {
	var columns = [columnName, 'Мужчины', 'Женщины'];
	data.unshift(columnValue);
	return {info: [columns, data], container: container};
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
	barChart.draw(view, config);
}