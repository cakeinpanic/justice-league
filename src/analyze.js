var objectAssign = require('object-assign');
var fakeList = require('./fakeList.js').fake;
module.exports = {
	getCities: getCities,
	addFullSalary: countFullSalary,
	getRoubles: getRoubles,
	getDollars: getDollars,
	getWomen: getWomen,
	getMen: getMen,
	getAverageSalaryOfGroup: getMedianSalary,
	groupByExp: groupByExp,
	prepareDataByCurrency: prepareDataByCurrency,
	isFake: isFake
};

function countAverageYearSalary(item) {
	var newItem = objectAssign({}, item);
	newItem.fullSalary = item.salary * 12 + item.monthlyBonus * 12 + item.yearlyBonus;
	newItem.averageSalary = newItem.fullSalary / 12;
	return newItem;
}
function isFake(timestamp) {
	return fakeList.some(function(fakeTimestamp){
		return fakeTimestamp === timestamp;
	});
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
function getMedianSalary(data) {
	var tempData = data.sort(function(a, b) {
		return a.averageSalary - b.averageSalary;
	});
	var half = Math.floor(tempData.length / 2);

	if (tempData.length % 2) {
		return tempData[half].averageSalary;
	}
	else {
		return (tempData[half - 1].averageSalary + tempData[half].averageSalary) / 2;
	}
}

function groupByExp(data) {
	var result = [];
	var groupedResult = [];
	var subResult = 0;

	data.forEach(function(item) {
		if (item.fullExp) {
			var exp = item.fullExp;
			if (!result[exp]) {
				result[exp] = []
			}
			result[exp].push(item)
		}
	});

	for (var i = 0; i < result.length; i++) {
		if (!result[i]) {
			result[i] = 0
		} else {
			result[i] = getMedianSalary(result[i]);
		}
	}
	for (i = 0; i < 5; i++) {
		groupedResult[i] = (result[i + 3] + result[i + 1] + result[i + 2]) / 3;
	}
	for (var j = i; j < result.length; j++) {
		subResult += result[j];
	}
	groupedResult[i] = subResult / (result.length - i);

	return groupedResult;
}


function prepareDataByCurrency(data) {
	var men = getMen(data);
	var women = getWomen(data);
	var cities = getCities(data);
	var avg = getMedianSalary;
	return {
		men: avg(men),
		women: avg(women),
		menExp: groupByExp(men),
		womenExp: groupByExp(women),
		spb: {
			men: avg(getMen(cities.spb)),
			women: avg(getWomen(cities.spb))
		},
		msk: {
			men: avg(getMen(cities.msk)),
			women: avg(getWomen(cities.msk))
		}
	}
}

