;(function(exports) {

	exports.Ocean = function(game, settings) {
		this.c = game.c;
		var defaults = {
			zindex: -100,
			pos: {
				x: 0,
				y: 0
			},
			size: {
				x: 800,
				y: 600
			},
			color: {
				r: 0,
				g: 128,
				b: 255
			}
		};
		initObject(this, defaults, settings);
		console.log(this);
	};

	exports.Ocean.prototype = {
		draw: function(ctx){
			ctx.setFillColor("rgb(" +
				this.color.r + "," +
				this.color.g + "," +
				this.color.b + ")");
			ctx.fillRect(
				this.pos.x,
				this.pos.y,
				this.size.x,
				this.size.y);
		}
	};

})(window);
