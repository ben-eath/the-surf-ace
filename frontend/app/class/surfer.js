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
		window.initObject(this, defaults, settings);
	};

	exports.Shark.prototype = {
		draw: function(ctx){
			ctx.fillColor = this.color;
			ctx.fillRect(
				this.pos.x,
				ths.pos.y,
				this.size.x,
				this.size.y);
		}
	};

})(window);
