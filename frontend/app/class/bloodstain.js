;(function(exports){

	var STARTING_RADIUS = 10;
	var EXPAND_SPEED = 1;

	exports.Bloodstain = function(game, settings) {
		this.c = game.c;
		initObject(this, settings);
	};

	exports.Bloodstain.prototype = {
		color: 'darkred',
		pos: {
			x: 0,
			y: 0
		},
		radius: STARTING_RADIUS,
		draw: function(ctx) {
			ctx.setFillColor(this.color);
			ctx.beginPath();
			ctx.arc(this.pos.x,this.pos.y,this.radius,0,2*Math.PI);
			ctx.stroke();
		}
	};
})(window);
