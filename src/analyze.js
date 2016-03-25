var objectAssign = require('object-assign');
module.exports = {
	getCities: getCities,
	addFullSalary: countFullSalary,
	getRoubles: getRoubles,
	getDollars: getDollars,
	getWomen: getWomen,
	getMen: getMen,
	getAverageSalaryOfGroup: getAverageSalary

};
function countAverageYearSalary(item) {
	var newItem = objectAssign({}, item);
	newItem.fullSalary = item.salary * 12 + item.monthlyBonus * 12 + item.yearlyBonus;
	newItem.averageSalary = newItem.fullSalary / 12;
	return newItem;
}
function getCities(data) {
	var saintP = data.filter(function(item) {
		var city = (item.city || '').toLowerCase();
		return !!item.city && (city === 'санкт-петербург' || city === 'питер' || city === 'спб');
	});
	var moscow = data.filter(function(item) {
		var city = (item.city || '').toLowerCase();
		return !!item.city && (city === 'москва' || city === 'moscow');
	});
	return {
		msk: moscow,
		spb: saintP
	}
}

function getRoubles(data) {
	return data.filter(function(item) {
		return item.isRoubles;
	});
}

function getDollars(data) {
	return data.filter(function(item) {
		return !item.isRoubles
	});
}

function getMen(data) {
	return data.filter(function(item) {
		return !item.isWoman
	});
}

function getWomen(data) {
	return data.filter(function(item) {
		return item.isWoman
	});
}
function countFullSalary(data) {
	return data.map(countAverageYearSalary)
}

function getAverageSalary(data) {
	var res = 0;
	data.forEach(function(item) {
		res += item.averageSalary;
	});
	return (res / data.length);
}