;(function(exports) {
	// stores things like:
	// whether the game is running

	var SURFER_SPAWN_SPEED = 1000 * 3;
	var DIALOGUE_SPEED = 0.13;
	var DIALOGUE_HEIGHT = 200;
	var DIALOGUE_PADDING = 20;

	exports.Control = function(game, settings) {
		this.c = game.c;
		this.gameState = this.states.WAITING;
		initObject(this, settings);
		this.dialoguePortrait = new SpriteSheet('./resource/ben_eath_portrait/ben_eath', 2, COLOR_MATRIX_IDENTITY, 0.07);
	};

	exports.Control.prototype = {
		states: { WAITING: 1, BETWEEN_WAVES: 2, PLAY: 3 },
		waveNumber: 1,
		cutSceneNumber: undefined,
		zindex: 100,
		dialogueY: 0,
		dialogueUp: false,
		dialogueText: "Ben Eath:\nBump into those tasty swimmers for a tasty snack! Simple swim up and bump into them to consume them, stealing their soul. It's tasty *and* nutritious!",
		center: {
			x: 0,
			y: 0
		},
		size: {
			x: 800,
			y: 600
		},
		color: {
			r: 0,
			g: 128,
			b: 255,
			a: 0
		},
		draw: function(ctx) {
			if (!this.isRunning) {
				ctx.font = '64pt VT323';
				ctx.textAlign = 'center';
				ctx.fillStyle = 'black';
				ctx.fillText('Ben Eath: Surf Ace', this.center.x, this.center.y+3);
				ctx.fillStyle = 'white';
				ctx.fillText('Ben Eath: Surf Ace', this.center.x, this.center.y);
			}
			if (this.dialogueY > 0) {
				var y = this.size.y - this.dialogueY * DIALOGUE_HEIGHT;
				var textX = DIALOGUE_HEIGHT;
				var textY = y + DIALOGUE_PADDING + 30;
				var textW = this.size.x - DIALOGUE_HEIGHT - DIALOGUE_PADDING;
				ctx.fillStyle = 'rgba(0,0,0,0.35)';
				ctx.fillRect(0, y, this.size.x, DIALOGUE_HEIGHT);
				ctx.font = '30pt VT323';
				ctx.textAlign = 'left';
				ctx.fillStyle = 'black';
				wrapText(ctx, this.dialogueText, textX, textY+3, textW, 38);
				ctx.fillStyle = 'white';
				wrapText(ctx, this.dialogueText, textX, textY, textW, 38);
				this.dialoguePortrait.draw(ctx,
          {x: DIALOGUE_HEIGHT/2, y: y + DIALOGUE_HEIGHT/2},
          {x: DIALOGUE_HEIGHT - DIALOGUE_PADDING * 2, y: DIALOGUE_HEIGHT - DIALOGUE_PADDING * 2},
          true);
			}
		},
		update: function() {
			// TODO REPLACE WITH SOCKET STARTING
			if (!this.isRunning && this.c.inputter.isDown(83)) {
				var surfers = this.c.entities.all(Surfer);
				for (var s in surfers) {
					this.c.entities.destroy(surfers[s]);
				}
				this.c.entities.create(Shark, {});
				this.isRunning = true;
			}

			if (this.dialogueUp === true && this.dialogueY < 1) {
				this.dialogueY += DIALOGUE_SPEED;
			} else if (this.dialogueUp === false && this.dialogueY > 0) {
				this.dialogueY -= DIALOGUE_SPEED;
			}
			if (this.dialogueY > 1) {this.dialogueY = 1;}
			if (this.dialogueY < 0) {this.dialogueY = 0;}
		}
	};

})(window);
