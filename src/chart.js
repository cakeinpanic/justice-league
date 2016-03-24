var config = require('./chartConfig.js');
var getSalaryData = require('./dataGetter.js');
var container = document.querySelector('.chartContainer');

module.exports = function() {
	google.load('visualization', '1', {packages: ['corechart']});
	google.setOnLoadCallback(draw);

	function draw() {
		getSalaryData().then(drawCharts);
	}
};

function drawCharts(data) {
	container.classList.add('loaded');
	var prepared = prepareData(data);
	drawOneChart(prepared.roubles);
	drawOneChart(prepared.dollars);

}

function prepareData(data) {
	var columns = ['Currency', 'Men', 'Women'];
	var dollars = [data.men.dollars, data.women.dollars];
	var roubles = [data.men.roubles, data.women.roubles];
	dollars.unshift('Dollars');
	roubles.unshift('Roubles');
	return {
		roubles: [columns, roubles],
		dollars: [columns, dollars]
	};
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