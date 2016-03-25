var config = require('./chartConfig.js');
var getAllData = require('./dataGetter.js').getAllData;
var analyze = require('./analyze.js');
var avg = require('./analyze.js').getAverageSalaryOfGroup;

var container = document.querySelector('.chartContainer');

module.exports = function() {
	google.load('visualization', '1.0', {packages: ['corechart']});
	google.setOnLoadCallback(draw);

	function draw() {
		getAllData()
			.then(prepareCommonData)
			.then(drawCharts);
	}
};

function prepareCommonData(data) {
	var roubles = prepareDataByCurrency(analyze.getRoubles(data));
	return [
		prepareOneChartData([roubles.men, roubles.women], 'Currency', 'Везде'),
		prepareOneChartData([roubles.spb.men, roubles.spb.women], 'City', 'В Питере'),
		prepareOneChartData([roubles.msk.men, roubles.msk.women], 'City', 'В Москве')
	];
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
	container.classList.add('loaded');
	data.forEach(drawOneChart);
}

function prepareOneChartData(data, columnName, columnValue) {
	var columns = [columnName, 'Мужчины', 'Женщины'];
	data.unshift(columnValue);
	return [columns, data];
}

function createChartElement() {
	var chartElement = document.createElement('div');
	chartElement.classList.add('chart');
	container.appendChild(chartElement);
	return chartElement;
}

function drawOneChart(data) {
	var chartElement = createChartElement();

	var barData = google.visualization.arrayToDataTable(data);
	var formatter = new google.visualization.NumberFormat({fractionDigits: 0});
	formatter.format(barData, 1);
	formatter.format(barData, 2);

	var view = new google.visualization.DataView(barData);
	var barChart = new google.visualization.ColumnChart(chartElement);
	barChart.draw(view, config);
}