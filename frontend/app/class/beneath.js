;(function(exports){

	var FLY_SPEED = 10;
	var BOB_STRENGTH = 1;
	var BOB_SPEED = 0.04;

	var theta;
	var radias;

	exports.BenEath = function(game, settings) {
		this.c = game.c;
		initObject(this, settings);
		this.spriteSheet = new SpriteSheet('./resource/ben_eath_surfing/ben_eath', 1);
		this.bob = 0;
		theta = 0.0;
		radias = this.c.renderer._ctx.canvas.height/2.5;
	};

	function distance(x1,y1,x2,y2) {
		var distance = Math.sqrt(Math.pow(Math.abs(x1-x2), 2) + Math.pow(Math.abs(y1-y2), 2));
		return distance;
	}

	exports.BenEath.prototype = {
		size: {
			x: 256,
			y: 256
		},
		getDistance: function(x, y, threshold) {
			var sharks = this.c.entities.all(Shark);
			var sumVecX = 0;
			var sumVecY = 0;
			for (var s in sharks) {
				var shark = sharks[s];
				var d = distance(x, y, shark.center.x, shark.center.y);
				if (d < threshold) {

					sumVecX += (shark.center.x - x)/d;
					sumVecY += (shark.center.y - y)/d;
				}
			}

			if (!sumVecX && !sumVecY) {
				return false;
			} else {
				totalDist = distance(sumVecX, sumVecY, 0, 0);
				return {x: sumVecX/totalDist, y: sumVecY/totalDist};
			}
		},

		update: function(dt) {
			if(this.displayOnly) {
				if(this.onScreen){
					if(this.center.x > this.target[0].x) {
						this.center.x -= FLY_SPEED;
					} else {
						this.bob += BOB_SPEED;
						this.center.y += Math.sin(this.bob) * BOB_STRENGTH;
					}
				} else {
					if(this.center.x > this.target[1].x) {
						this.center.x -= FLY_SPEED;
					} else {
						this.c.entities.destroy(this);
					}
				}
			} else {
				var newX = (Math.cos(theta) * radias) + this.c.renderer._ctx.canvas.width/2;
				var newY = (Math.sin(theta) * radias) + this.c.renderer._ctx.canvas.height/2;
				theta += BOB_SPEED;
				vector = this.getDistance(this.center.x, this.center.y, 300);
				if (vector) {
					this.center.x += -vector.x * FLY_SPEED;
					this.center.y += -vector.y * FLY_SPEED;
				} else {
					var d = distance(this.center.x, this.center.y, newX, newY);

					this.center.x += (newX - this.center.x) * FLY_SPEED / d;
					this.center.y += (newY - this.center.y) * FLY_SPEED / d;
				}
				
			}

		},
		draw: function(ctx) {
			this.spriteSheet.draw(ctx, this.center, this.size);
		}
	};

})(window);
