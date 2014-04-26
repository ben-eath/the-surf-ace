;(function(exports) {

	exports.Surfer = function(game, settings) {
		this.c = game.c;
		var defaults = {
			pos: {
				x: 100,
				y: 0
			},
			size: {
				x: 64,
				y: 128
			},
			dead: false,
			color: 'yellow'
		};
		initObject(this, defaults, settings);
	};

	exports.Shark.prototype = {
		draw: function(ctx){
			ctx.setFillColor(this.color);
			ctx.fillRect(
				this.pos.x,
				this.pos.y,
				this.size.x,
				this.size.y);
		}
	};

})(window);
