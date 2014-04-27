;(function(exports) {
	// stores things like:
	// whether the game is running

	var SURFER_SPAWN_SPEED = 1000 * 3;

	exports.Control = function(game, settings) {
		this.c = game.c;
		initObject(this, settings);
		this.state = "WAITING_FOR_CONNECTION";
	};

	exports.Control.prototype = {
		zindex: 90,
		states: {
			WAITING_FOR_CONNECTION: {
				init: function() {

				},
				update: function() {
					if ((this.c.sock.gameStarted || this.c.inputter.isDown(83))) {

					}
				},
				draw: function() {

				}
			},
			WAITING_FOR_PLAYERS: {
				init: function() {},
				update: function(dt) {
					if ((this.c.sock.gameStarted || this.c.inputter.isDown(83))) {
						var surfers = this.c.entities.all(Surfer);
						for (var s in surfers) {
							surfers[s].die(false);
						}
						this.changeState("INTRO_START");
					}
				},
				draw: function(ctx){
					this.drawLargeText(ctx, "Ben Eath, the Surf Ace");
					ctx.font = '30pt VT323';
					ctx.fillStyle = 'black';
					var roomID = this.c.sock.roomID == null ? "Connecting to server..." : this.c.sock.roomID;
					ctx.fillText('' + roomID, this.center.x, this.center.y+73);
					ctx.fillStyle = 'white';
					ctx.fillText('' + roomID, this.center.x, this.center.y+70);
				}
			},
			INTRO_START: {
				init: function() {
					var height = this.c.renderer._ctx.canvas.height;
					var width = this.c.renderer._ctx.canvas.width;
					this.c.entities.create(DialogueBox, {
						text: "HA HA HA I'M BEN EATH AND I HATE SHARKS. BOO YAH! SURF'S UP! LET'S GRAB SOME GNARLY WAVES, DUDES!",
						center: {
							x: width / 2,
							y: height + 100
						},
						size: {
							x: width,
							y: 200
						},
						finalY: height - 200
					});
				},
				update: function(dt) {
					if(this.c.inputter.isDown(82)){
						this.changeState('PLAY');
					}
				},
				draw: function(ctx) {}
			},
			PLAY: {
				init: function() {

				},
				update: function(dt) {},
				draw: function(ctx) {}
			}
		},
		changeState: function(newState) {
			console.log(this.state + "->" + newState);
			this.state = newState;
			if(this.states[this.state].init !== undefined) {
				this.states[this.state].init.call(this);
			}
		},
		draw: function(ctx) {
			this.states[this.state].draw.call(this, ctx);
		},
		update: function(dt) {
			this.states[this.state].update.call(this, dt);
		},
		drawLargeText: function(ctx, str){
			ctx.textAlign = 'center';
			ctx.font = '64pt VT323';
			ctx.fillStyle = 'black';
			ctx.fillText(str, this.center.x, this.center.y+3);
			ctx.fillStyle = 'white';
			ctx.fillText(str, this.center.x, this.center.y);
		}
	};

})(window);
