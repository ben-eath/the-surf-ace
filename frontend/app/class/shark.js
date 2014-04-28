;(function(exports) {

	var SHARK_SPEED_X = 5;

	var SPRITES_SWIM_SURFACE_MAX = 39;
	var SPRITES_SWIM_DEEP_MAX = 39;
	var SPRITES_LAG_SURFACE_MAX = 1;
	var SPRITES_CHOMPING_MAX = 1;

	var STATE_SWIM_SURFACE = 0; // sitting on surface, swimmming, dont move
	var STATE_SWIM_DEEP = 1; // dived deep, swimming, move up
	var STATE_LAG_SURFACE = 2; //on surface, not swimming, move back
	var STATE_CHOMPING = 3; //in air, not swimming, leap forward, lasts 1 second
	var STATE_SHOT = 4; //shot by a sharknet

	var DRIFT_SPEED = 2;
	var DRIFT_PADDING = 30;

	var MAX_CHOMP_TIME = 500; //time in ms that it takes to chomp
	var MAX_CHOMP_COOLDOWN = 1000; // cooldown of chomp time
	var MAX_BLINK_TIME = 3000; //time in ms that you're incapacitated
	var BLINK_PERIOD = 300; // duration of each blink cycle
	var BLINK_OFF_PERIOD = 100; // duration of hidden part of blink cycle

	exports.Shark = function(game, settings) {
		this.c = game.c;
		this.lockedDir = 0;
		this.chompCooldown = 0;
		this.center = settings.center || {
			x: 0,
			y: 300
		};
		this.speed = settings.speed || {
			x: 1,
			y: 1
		};
		this.state = settings.state || 0;

		initObject(this, settings);

		this.sprites = [
			new SpriteSheet('./resource/shark_swim/shark', this.spriteMaxes[STATE_SWIM_SURFACE], settings.colorMatrix, 0.5),
			new SpriteSheet('./resource/shark_swim/shark', this.spriteMaxes[STATE_SWIM_DEEP], settings.colorMatrix, 0.5),
			new SpriteSheet('./resource/shark_lag/shark', this.spriteMaxes[STATE_LAG_SURFACE], settings.colorMatrix, 0.5),
			new SpriteSheet('./resource/shark_bite/shark', this.spriteMaxes[STATE_CHOMPING], settings.colorMatrix, 0.5),
			new SpriteSheet('./resource/shark_lag/shark', this.spriteMaxes[STATE_LAG_SURFACE], settings.colorMatrix, 0.5),
		];

		this.boundingBox = this.c.collider.RECTANGLE;

		// this.shadow = this.c.entities.create(Shadow, {
		// 	obj: this,
		// 	src: 'shark.png',
		// 	size: {
		// 		x: this.size.x * 1.5,
		// 		y: this.size.y * 2.2
		// 	},
		// 	yOffset: 73
		// });
	};

	exports.Shark.prototype = {
		id: 0,
		zindex: -10,
		size: {
			x: 90,
			y: 180
		},
		sprites: [null,null,null,null,null],
		spriteMaxes: [39, 39, 1, 1, 1],
		speeds: [-0.5,3,-3,3,-0.5],
		zindexes: [-20, -50, -20, 20, -50],
		spriteNumber: 0,
		chompTime: 0,
		blinkTime: 0,
		draw: function(ctx) {
			for(var i = 0; i < this.sprites.length; i++) {
				if(!this.sprites[i].isReady()) return;
			}
			if (this.state === STATE_SHOT && (this.blinkTime % BLINK_PERIOD) < BLINK_OFF_PERIOD) {return;}
			this.sprites[this.state].draw(ctx, this.center, this.size);

			//uncomment to see collision box
			// ctx.setFillColor('blue');
			// ctx.fillRect(
			//	this.center.x - this.size.x / 3,
			//	this.center.y - this.size.y / 2,
			//	(this.size.x / 3) * 2,
			//	this.size.y / 2
			// );
		},
		update: function(dt) {
			var data = this.c.sock.getSharkData(this.id);

			this.calculateState(data.depth, dt);

			this.speeds[STATE_SWIM_SURFACE] = DRIFT_SPEED * -(this.c.entities.all(Control)[0].size.y - this.center.y - DRIFT_PADDING) / this.c.entities.all(Control)[0].size.y;
			this.zindex = this.zindexes[this.state];

			if (this.state === STATE_CHOMPING) {
				this.center.x += this.lockedDir * this.speed.x * SHARK_SPEED_X * (dt/16.66);
			} else if (this.state !== STATE_SHOT) {
				this.center.x += data.direction * this.speed.x * SHARK_SPEED_X * (dt/16.66);
			}
			this.center.y -= this.speeds[this.state] * this.speed.y * (dt/16.66);

			if (this.chompCooldown < MAX_CHOMP_COOLDOWN && this.state !== STATE_CHOMPING) {
				this.chompCooldown += dt;
			}

			if (this.center.x - this.size.x/2 < 0) { this.center.x = this.size.x/2; }
			else if (this.center.x + this.size.x/2 > this.c.renderer._ctx.canvas.width) {this.center.x = this.c.renderer._ctx.canvas.width - this.size.x/2; }

			if (this.center.y - this.size.y/2 < 0) { this.center.y = this.size.y/2; }
			else if (this.center.y + this.size.y/2 > this.c.renderer._ctx.canvas.height) {this.center.y = this.c.renderer._ctx.canvas.height - this.size.y/2; }
		},
		chomp: function() {
			if (this.state === STATE_CHOMPING || this.chompCooldown < MAX_CHOMP_COOLDOWN) return;
			this.chompTime = 0;
			this.chompCooldown = 0;
			this.state = STATE_CHOMPING;
			this.lockedDir = this.c.sock.getSharkData(this.id).direction;
		},
		calculateState: function(depth, dt) {
			if(this.state === STATE_SHOT) {
				if (this.blinkTime < MAX_BLINK_TIME) {
					this.blinkTime += dt;
					return;
				} else {
					this.state = STATE_SWIM_SURFACE;
				}
			}

			if(this.state == STATE_CHOMPING) {
				if (this.chompTime < MAX_CHOMP_TIME) {
					this.chompTime += dt;
					return;
				} else {
					this.state = STATE_SWIM_SURFACE;
				}
			}

			if (depth > 0.35) {
				this.state = STATE_SWIM_DEEP;
			} else if (depth < 0.25 && depth > -0.25 ) {
				this.state = STATE_SWIM_SURFACE;
			} else if (depth < -0.35){
				this.state = STATE_LAG_SURFACE;
			}
			if (this.state === undefined) {
				this.state = STATE_SWIM_SURFACE;
			}
		},
		collision: function(other, type) {
			if(other instanceof Surfer && this.state == STATE_CHOMPING) {
				if(
					other.center.y < this.center.y &&
					other.center.x < this.center.x + this.size.x / 3 &&
					other.center.x > this.center.x - this.size.x / 3
				) {
					other.die(true);
				}
			}
		}
	};

})(window);
