(function() {
	'use strict';

	var barOptions = {
		focusTarget: 'category',
		backgroundColor: 'transparent',
		colors: ['cornflowerblue', 'tomato'],
		fontName: 'Open Sans',
		chartArea: {
			left: 50,
			top: 10,
			width: '100%',
			height: '70%'
		},
		bar: {
			groupWidth: '80%'
		},
		hAxis: {
			textStyle: {
				fontSize: 11
			}
		},
		vAxis: {
			minValue: 0,
			baselineColor: '#DDD',
			textStyle: {
				fontSize: 11
			}
		},
		legend: {
			position: 'bottom',
			textStyle: {
				fontSize: 12
			}
		},
		animation: {
			duration: 1200,
			easing: 'out',
			startup: true
		}
	};
	var container = document.querySelector('.chartContainer');
	google.load("visualization", "1", {packages: ["corechart"]});
	google.setOnLoadCallback(draw);

	function draw() {
		getSalaryData().then(drawCharts);
	}

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
		barChart.draw(view, barOptions);
	}
})();