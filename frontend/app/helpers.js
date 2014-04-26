;(function(exports){
	exports.initObject = function(obj, settings) {
		for (var s in settings) {
			obj[s] = settings[s];
		}
	};

	exports.colorFromObject = function(color) {
		return  "rgb" + (color.a ? "a" : "") + "(" +
				color.r + "," +
				color.g + "," +
				color.b + (color.a ? "," : ")") +
				(color.a ? color.a + ")" : "");
	};
})(window);
