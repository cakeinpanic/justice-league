var $ = require('jquery');
var currencySwitcher = document.getElementById('currencySwitcher');
var container = document.querySelector('.chartContainer');

module.exports = {
	init: function() {
		currencySwitcher.addEventListener('change', switchCurrency);
	}
};

function switchCurrency() {
	if (currencySwitcher.checked) {
		$(container).css('left', '0');
	} else {
		$(container).css('left', '-100%');
	}
}
