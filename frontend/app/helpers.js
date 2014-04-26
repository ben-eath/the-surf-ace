;(function(exports){
	exports.initObject = function(obj, defaults, settings) {
		for (var def in defaults) {
			if (settings[def] === undefined) {
				obj[def] = defaults[def];
			} else {
				obj[def] = settings[def];
			}
		}
	};
})(window);
