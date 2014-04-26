;(function(exports){

	var STARTING_RADIUS = 10;
	var EXPAND_SPEED = 1;
	var MOVE_SPEED = 2;
	var ENDING_RADIUS = 100;
	var EPSILON = 0.01;

	exports.Bloodstain = function(game, settings) {
		this.c = game.c;
		initObject(this, settings);
	};

	exports.Bloodstain.prototype = {
		color: {
			r: 100,
			g: 0,
			b: 0,
			a: 1
		},
		center: {
			x: 0,
			y: 0
		},
		radius: STARTING_RADIUS,
		draw: function(ctx) {
			ctx.setFillColor(colorFromObject(this.color));
			ctx.beginPath();
			ctx.arc(this.center.x,this.center.y,this.radius,0,2*Math.PI);
			ctx.fill();
		},
		update: function(dt){
			this.radius += EXPAND_SPEED * (dt/16.66);
			this.color.a = ((ENDING_RADIUS - this.radius) / (ENDING_RADIUS - STARTING_RADIUS));
			this.center.y += MOVE_SPEED;
			if(this.color.a <= EPSILON){
				this.c.entities.destroy(this);
			}
		}
	};
})(window);
