;(function(exports) {

	var SHARK_SPEED_Y_DEEP = 1.25;
	var SHARK_SPEED_Y_SURFACE = 1;
	var SHARK_SPEED_Y_AIR = 0.75;

	exports.Shark = function(game, settings) {
		this.c = game.c;
		initObject(this, settings);
	};

	exports.Shark.prototype = {
		id: 0,
		zindex: 1,
		pos: {
			x: 100,
			y: 300
		},
		size: {
			x: 64,
			y: 128
		},
		speed: {
			x: 1,
			y: 1
		},
		depth: 0,
		color: 'red',
		draw: function(ctx) {
			ctx.setFillColor(this.color);
			ctx.fillRect(
				this.pos.x,
				this.pos.y,
				this.size.x,
				this.size.y);
		},
		update: function(dt) {
			var data = this.c.sock.getSharkData(this.id);

			this.depth = this.calculateDepth(data.depth);
			if(this.depth > 1) this.speed.y = SHARK_SPEED_Y_AIR;
			else if(this.depth < 1) this.speed.y = SHARK_SPEED_Y_DEEP;
			else this.speed.y = SHARK_SPEED_Y_SURFACE;

			this.pos.x += data.direction * this.speed.x * (dt/16.66);
			this.pos.y -= data.depth * this.speed.y * (dt/16.66);
		},
		calculateDepth: function(dd) {
			if(dd > 0.35) {
				return 1;
			} else if (dd < 0.25 && dd > -0.25 ) {
				return 0;
			} else if (dd < -0.35){
				return -1;
			}
		}
	};

})(window);
