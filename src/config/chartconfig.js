module.exports = {
	focusTarget: 'category',
	backgroundColor: {fill: 'transparent'},
	colors: ['#008FCC', '#E82258'],
	fontName: 'Open Sans',
	chartArea: {
		left: 70,
		top: 20,
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
		maxValue: 100,
		baselineColor: '#DDD',
		format: '##,###₽',
		textStyle: {
			fontSize: 11,
			fontWeight: 'normal'
		}
	},
	legend: {
		position: 'bottom',
		textStyle: {
			fontName: 'Open Sans',
			fontSize: 14
		}
	},
	titleTextStyle: {
		fontName: 'Open Sans',
		fontSize: 14,
		fontWeight: '400'
	},
	animation: {
		duration: 200
	}
};