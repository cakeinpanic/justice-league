module.exports = {
	focusTarget: 'category',
	backgroundColor: 'transparent',
	colors: ['cornflowerblue', 'tomato'],
	fontName: 'Open Sans',
	chartArea: {
		left: 70,
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
		format: '##,###₽',
		textStyle: {
			fontSize: 11,
			fontWeight: 'normal'
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