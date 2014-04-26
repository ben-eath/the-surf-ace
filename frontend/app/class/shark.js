;(function(exports) {

	exports.Shark = function(game, settings) {
		this.c = game.c;
		var defaults = {
			zindex: 1,
			pos: {
				x: 100,
				y: 300
			},
			size: {
				x: 64,
				y: 128
			},
			submerged: true,
			color: 'red'
		};
		initObject(this, defaults, settings);
		console.log(this);
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
