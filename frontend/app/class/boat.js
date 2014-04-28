;(function(exports) {

	var SPEED = 1;
	var SERPENTINE_AMOUNT = 0.3;
	var SPRITES_MAX = 1;
	var getDirectionToNearestShark = function(center, sharks) {
		var oldSharkSqDist = Infinity;
		var finalSharkDir = {x: 5, y: 0};
		for (shark in sharks) {
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
	}

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
		this.sprites = new SpriteSheet('./resource/boat', SPRITES_MAX, this.colorMatrix);

		this.shadow = this.c.entities.create(Shadow, {
			obj: this,
			src: 'board.png',
			size: {
				x: this.size.x * 1.5,
				y: this.size.y * 2.2
			},
			yOffset: 73
		});
		this.zindex = Math.random();
	};

	exports.Boat.prototype = {
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
		shootFrequency: 0.01,
		invincible: 0,
		draw: function(ctx) {
			if(!this.sprites.isReady()) return;
			this.sprites.draw(ctx, this.center, this.size);
		},
		update: function(dt) {
			this.center.y += SPEED;
			this.serpentine += this.serpentineSpeed;
			this.center.x += Math.sin(this.serpentine) * SERPENTINE_AMOUNT;
      			if (this.invincible > 0) {
				this.invincible -= dt;
			} else {
				this.invincible = 0;
			}
			if (this.center.y > 1000) { //PLACEHOLDER
				this.die(false);
			}
			if (Math.random < shootFrequency) {
				this.c.entities.create(Sharknet, {
					center: this.center,
					speed: nearestSharkSpeed(this.center, c.entities.all(Shark))
					}
				});
			}
		},
		hurt: function() {
			if (this.invincible == 0){
				this.health -= 1;
				this.invincible = 1000;
				if (this.health == 0) {
					this.die(true);	
				}
			}
		}
		die: function(showblood){
			this.c.entities.destroy(this.shadow);
			this.c.entities.destroy(this);
			if(showblood) {
				this.c.entities.create(Bloodstain, {
					center: this.center

				});
			}
		}
	};

})(window);
