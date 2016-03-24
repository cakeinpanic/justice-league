var url = 'https://docs.google.com/spreadsheets/d/1_hcoJyWIR2nKpSaw31SlRQ4SeMAhN57y0KI1Q6YlzIw/edit#gid=1811284584';
var sheetrock = require('../node_modules/sheetrock/dist/sheetrock.min.js');
var Promise = require('es6-promise').Promise;

module.exports = getSalaryData;

function getDataFromSheet(query) {
	return new Promise(function(resolve, reject) {
		sheetrock({
			url: url,
			query: query,
			callback: function(error, options, response) {
				if (error) {
					reject(error);
					return;
				}
				resolve(response);
			}
		})
	});
}
function request(query) {
	return new Promise(function(resolve) {
		getDataFromSheet(query).then(function(response) {
			var data = response.raw.table.rows;
			var roublesSum = 0;
			var dollarSum = 0;
			var dollarCount = 0;
			var roubleCount = 0;
			data.forEach(function(item) {
				if (item.c[1].v === 'Рубли') {
					roublesSum += item.c[0].v;
					roubleCount++;
				} else {
					dollarSum += item.c[0].v;
					dollarCount++;
				}
			});
			resolve({
				dollars: dollarSum / dollarCount,
				roubles: roublesSum / roubleCount
			})
		})
	});
}

function getSalaryData() {
	var men, women;
	return request('select H, M where K = "Мужчина"')
		.then(function(menData) {
			men = menData;
		})
		.then(function() {
			return request('select H, M where K = "Женщина"')
		})
		.then(function(womenData) {
			women = womenData;
			return Promise.resolve({men: men, women: women});
		});
}

