var url = 'https://docs.google.com/spreadsheets/d/1_hcoJyWIR2nKpSaw31SlRQ4SeMAhN57y0KI1Q6YlzIw/edit#gid=1811284584';
var sheetrock = require('../node_modules/sheetrock/dist/sheetrock.min.js');
var Promise = require('es6-promise').Promise;
var analyze = require('./analyze.js');

var DOLLAR = 'Доллары';
var ROUBLES = 'Рубли';
var MAN = 'Мужчина';
var WOMAN = 'Женщина';


module.exports = {
	getAllData: getAllData
};

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
function getAllData() {
	return getDataFromSheet('select C, D, F,G,H, I,J, K,M, A')
		.then(function(allData) {
			var data = allData.raw.table.rows;
			var result = [];

			data.forEach(function(item) {
				var dataItem = item.c.map(function(itemField) {
					return !!itemField ? itemField : {v: null};
				});
				if (!analyze.isFake(dataItem[9].f)) {
					result.push({
						city: dataItem[0].v,
						job: dataItem[1].v.toLowerCase(),
						exp: dataItem[2].v,
						fullExp: dataItem[3].v,
						salary: dataItem[4].v,
						monthlyBonus: dataItem[5].v || 0,
						yearlyBonus: dataItem[6].v || 0,
						gender: dataItem[7].v,
						currency: dataItem[8].v,
						isRoubles: (dataItem[8].v === ROUBLES),
						isWoman: (dataItem[7].v === WOMAN)
					})
				}
			});
			return result;
		})
		.then(analyze.addFullSalary);
}

