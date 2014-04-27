;(function(exports) {
	// stores things like:
	// whether the game is running

	var SURFER_SPAWN_SPEED = 1000 * 3;

	exports.Control = function(game, settings) {
		this.c = game.c;
		this.gameState = this.states.WAITING;
		initObject(this, settings);
	};

	exports.Control.prototype = {
		states: {WAITING: 1, BETWEEN_WAVES: 2, PLAY: 3},
		waveNumber: 1,
		cutSceneNumber: undefined,
		zindex: 100,
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
				ctx.fillStyle = 'blue';
				ctx.fillText('Ben Eath: Surf Ace', this.center.x, this.center.y);
			}
		},
		update: function() {
			if (!this.isRunning && this.c.inputter.isDown(83)) {
				this.c.entities.create(Shark, {});
				this.isRunning = true;
			};
		}
	};

})(window);
