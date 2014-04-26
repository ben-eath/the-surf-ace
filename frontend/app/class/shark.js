;(function(exports) {

	exports.Shark = function(game, settings) {
		this.c = game.c;
		initObject(this, settings);
		console.log(this);
	};

	exports.Shark.prototype = {
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
		color: 'red',
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
