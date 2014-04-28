;(function(exports) {

	var SPEED = 1;
	var SERPENTINE_AMOUNT = 0.3;
	var SPRITES_MAX = 1;

	var SHOOT_TIMER_MAX = 4000;

	var MAX_AGE = 60000;

	var getDirectionToNearestShark = function(center, sharks) {
		var oldSharkSqDist = Infinity;
		var finalSharkDir = {x: 5, y: 0};
		for (var shark in sharks) {
			if (sharks[shark].state === 5) continue;
			var sharkDistX = sharks[shark].center.x - center.x;
			var sharkDistY = sharks[shark].center.y - center.y;
			var newSharkSqDist = Math.pow(sharkDistX, 2) + Math.pow(sharkDistY, 2);
			if (newSharkSqDist < oldSharkSqDist) {
				oldSharkSqDist = newSharkSqDist;
				sharkScaleFactor = Math.sqrt(oldSharkSqDist);
				finalSharkDir.x = 5*sharkDistX/sharkScaleFactor;
				finalSharkDir.y = 5*sharkDistY/sharkScaleFactor;
			}

		}
		return finalSharkDir;
	};

	exports.Boat = function(game, settings) {
		this.c = game.c;
		initObject(this, settings);
		this.boundingBox = this.c.collider.RECTANGLE;

		var whiteness = Math.random() * 0.4 + 0.2;
		var redness = Math.random() * 0.2 + 0.7;
		if(whiteness < 0.4) redness -= 0.2;
		else if(redness > 0.8) whiteness -= 0.2;

		var suitcolor = [Math.random(), Math.random(), Math.random()];
		var boardcolor = [Math.random(), Math.random(), Math.random()];
		this.colorMatrix = [
			[redness,  boardcolor[0],  suitcolor[0]],
			[whiteness,  boardcolor[1],  suitcolor[1]],
			[whiteness,  boardcolor[2],  suitcolor[2]]
		];
		this.serpentineSpeed = Math.random() * 0.1 + 0.01;
		switch(Math.random() * 3) {

		}
		this.sprites = new SpriteSheet('./resource/boat/boat', SPRITES_MAX, this.colorMatrix);

		this.direction = 1;

		this.shadow = this.c.entities.create(Shadow, {
			obj: this,
			src: 'surfboard.png',
			size: {
				x: this.size.x * 1.5,

				y: this.size.y * 2.2
			},
			yOffset: 73
		});
		this.zindex = Math.random();
	};

	exports.Boat.prototype = {
		age: 0,
		center: {
			x: 100,
			y: 0
		},
		size: {
			x: 60,
			y: 120
		},
		health: 3,
		color: 'yellow',
		serpentine: 0,
		spriteNumber: 0,
		shootTimer: 0,
		invincible: 0,
		draw: function(ctx) {
			if(!this.sprites.isReady()) return;
			if(this.invincible % 100 < 50) {
				this.sprites.draw(ctx, this.center, this.size);
			}
		},
		update: function(dt) {
			this.center.y += SPEED * this.direction;
			this.serpentine += this.serpentineSpeed;
			this.center.x += Math.sin(this.serpentine) * SERPENTINE_AMOUNT;
			if (this.invincible > 0) {
				this.invincible -= dt;
			} else {
				this.invincible = 0;
			}
			if (this.center.y > this.c.renderer._ctx.canvas.height - this.size.y || this.center.y < 0) {
				this.direction *= -1;
			}
			this.shootTimer += dt;
			if (this.shootTimer > SHOOT_TIMER_MAX) {
				this.shootTimer = 0;
				this.c.entities.create(Sharknet, {
					center: this.center,
					speed: getDirectionToNearestShark(this.center, this.c.entities.all(Shark)),
					type: "net",
					numSprites: 29,
					lethality: 100
				});
			}

			//prevent infinite boats
			if(this.age > MAX_AGE - 2000) {
				this.zindex = -60;
				this.shootTimer = -9999;
			}
			this.age += dt;
			if (this.age > MAX_AGE) {
				this.die(false);
			}
		},
		hurt: function(shark) {
			if (this.invincible === 0){
				this.c.jukebox.playChomp();
				this.health -= 1;
				this.invincible = 1000;
				if (this.health === 0) {
					this.die(true);
					this.c.scores[shark.id] += 150;
					this.c.sock.scoreChange(shark);
				}
			}
		},
		die: function(showblood){
			this.c.entities.destroy(this.shadow);
			this.c.entities.destroy(this);
			if(showblood) {
				this.c.entities.create(Bloodstain, {
					center: this.center,
				});
			}
		}
	};

})(window);
