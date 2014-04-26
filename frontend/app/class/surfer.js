;(function(exports) {

	exports.Surfer = function(game, settings) {
		this.c = game.c;
		initObject(this, settings);
	};

	exports.Surfer.prototype = {
		pos: {
			x: 100,
			y: 0
		},
		size: {
			x: 64,
			y: 128
		},
		dead: false,
		color: 'yellow',
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
