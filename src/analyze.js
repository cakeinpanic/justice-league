var objectAssign = require('object-assign');
var fakeList = require('./config/fakeList.js').fake;
var multiplyList = require('./config/fakeList.js').multiplyOnThousand;
var itJobsKeywords = require('./config/itKeywords.js');
var DOLLAR_COST = 70;
module.exports = {
	addFullSalary: countFullSalary,
	getAllStats: prepareAllStats,
	isFake: isFake,
	needToMultiply: needToMultiply,
	getIT: getIT,
	getAllInRoubles: getAllInRoubles
};

function countAverageYearSalary(item) {
	var newItem = objectAssign({}, item);
	newItem.fullSalary = item.salary * 12 + item.monthlyBonus * 12 + item.yearlyBonus;
	newItem.averageSalary = newItem.fullSalary / 12;
	return newItem;
}
function isFake(timestamp) {
	return fakeList.some(function(fakeTimestamp) {
		return fakeTimestamp === timestamp;
	});
}
function needToMultiply(timestamp) {
	return multiplyList.some(function(multiplyTimestamp) {
		return multiplyTimestamp === timestamp;
	});
}
function getCities(data) {
	var spbAlias = ['санкт-петербург', 'питер', 'спб'];
	var mskAlias = ['москва', 'moscow', 'мск'];

	var cityChecker = function(cityAliasArray, city) {
		return cityAliasArray.some(function(cityAlias) {
			return cityAlias === city
		})
	};
	var saintP = [];
	var moscow = [];
	var allOther = [];

	data.forEach(function(item) {
		var city = (item.city || '').toLowerCase();

		var isSpb = cityChecker(spbAlias, city);
		var isMsk = cityChecker(mskAlias, city);
		var isOther = !(isMsk || isSpb);
		if (isSpb) {
			saintP.push(item)
		}
		if (isMsk) {
			moscow.push(item)
		}
		if (isOther) {
			allOther.push(item)
		}
	});

	return {
		msk: moscow,
		spb: saintP,
		allOther: allOther
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

function convertDollarsToRoubles(data) {
	return data.map(function(item) {
		var newItem = objectAssign({}, item);
		newItem.averageSalary = item.averageSalary * DOLLAR_COST;
		return newItem;
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

function getIT(data) {
	return data.filter(function(item) {
		return itJobsKeywords.some(function(job) {
			return item.job.indexOf(job) !== -1;
		})
	})

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
	if (!data.length) {
		return 0;
	}
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

function groupByExperience(data) {
	var result = [];

	data.forEach(function(item) {
		if (item.fullExp) {
			var exp = Math.round(+item.fullExp);
			if (!result[exp]) {
				result[exp] = []
			}
			result[exp].push(item);
		}
	});
	for (var i = 0; i < result.length; i++) {
		result[i] = !result[i] ? [] : result[i];
	}
	return result;

}

function getMax(obj) {
	var max = 0;
	for (var key in obj) {
		var value = obj[key];
		var toNumber = typeof value === 'object' ? getMax(value) : value;
		if (toNumber > max) {
			max = toNumber;
		}
	}
	return max;
}

function createTitle(i, step, groupNumber) {
	return (i !== groupNumber - 1) ?
	(i * step + 1) + '-' + (i * step + step) :
	i * step + '+';
}
function getExpStats(data) {
	var groupedResult = {};
	var groupsNumber = 6;
	var step = 3;
	var lastGroup = [];
	for (var i = 0; i < groupsNumber - 1; i++) {

		//@todo use step variable
		var groupedByExperience = data[i + 3].concat(data[i + 1]).concat(data[i + 2]);
		groupedResult[createTitle(i, step, groupsNumber)] = {
			men: getMedianSalary(getMen(groupedByExperience)),
			women: getMedianSalary(getWomen(groupedByExperience))
		}
	}
	for (var j = i * step; j < data.length; j++) {
		lastGroup = lastGroup.concat(data[j]);
	}
	groupedResult[createTitle(i, step, groupsNumber)] = {
		men: getMedianSalary(getMen(lastGroup)),
		women: getMedianSalary(getWomen(lastGroup))
	};
	return groupedResult;

}
function prepareAllStats(data) {
	var men = getMen(data);
	var women = getWomen(data);
	var groupedByExp = groupByExperience(data);
	var cities = getCities(data);
	var avg = getMedianSalary;

	var stats = {
		men: avg(men),
		women: avg(women),
		exp: getExpStats(groupedByExp),
		cities: {
			spb: {
				men: avg(getMen(cities.spb)),
				women: avg(getWomen(cities.spb))
			},
			msk: {
				men: avg(getMen(cities.msk)),
				women: avg(getWomen(cities.msk))
			},
			allOther: {
				men: avg(getMen(cities.allOther)),
				women: avg(getWomen(cities.allOther))
			}
		}
	};
	stats.maxAverage = getMax(stats);
	return stats;
}

function getAllInRoubles(data) {
	var roublesData = getRoubles(data);
	var dollarsData = getDollars(data);
	return roublesData.concat(convertDollarsToRoubles(dollarsData));

}