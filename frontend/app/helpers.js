;(function(exports){
	exports.initObject = function(obj, settings) {
		for (var s in settings) {
			obj[s] = settings[s];
		}
	};
})(window);
