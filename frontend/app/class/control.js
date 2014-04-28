;(function(exports) {
	// stores things like:
	// whether the game is running

	var SURFER_SPAWN_SPEED = 1000 * 3;

	exports.Control = function(game, settings) {
		this.c = game.c;
		initObject(this, settings);
		this.state = "WAITING_FOR_PLAYERS";
		this.spawnSurferTime = 0;
		this.fontLoadWait = 200; //LOL HAX
	};

	exports.Control.prototype = {
		zindex: 90,
		states: {
			WAITING_FOR_PLAYERS: {
				init: function() {
				},
				update: function(dt) {
					this.spawnSurferLoop(dt * 3);
					this.fontLoadWait -= dt;
					if ((this.c.sock.gameStarted || this.c.inputter.isPressed(68))) {
						var surfers = this.c.entities.all(Surfer);
						for (var s in surfers) {
							surfers[s].die(false);
						}
						this.changeState("INTRO_START");
					}
				},
				draw: function(ctx){
					if(this.fontLoadWait < 0) { //LOL HAX
						this.drawLargeText(ctx, "Ben Eath, the Surf Ace");
					}
					ctx.font = '30pt VT323';
					ctx.fillStyle = 'black';
					var roomID = this.c.sock.roomID === null ? "Connecting to server..." : this.c.sock.roomID;
					ctx.fillText('' + roomID, this.center.x, this.center.y+73);
					ctx.fillStyle = 'white';
					ctx.fillText('' + roomID, this.center.x, this.center.y+70);
				}
			},
			INTRO_START: {
				init: function() {
					var height = this.c.renderer._ctx.canvas.height;
					var width = this.c.renderer._ctx.canvas.width;
					this.c.entities.create(BenEath, {
						center: {
							x: width,
							y: height / 3
						},
						target: [
							{
								x: width / 2,
								y: width / 3
							},
							{
								x: - 200,
								y: width / 3
							},
						],
						onScreen: true,
						displayOnly: true
					});
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
					if(this.c.inputter.isPressed(68)){
						this.c.entities.all(DialogueBox)[0].dialogueUp = false;
						this.c.entities.all(BenEath)[0].onScreen = false;
					}
					if(this.c.entities.all(BenEath).length == 0) {
						this.changeState('PLAY');
					}
				},
				draw: function(ctx) {}
			},
			PLAY: {
				init: function() {

				},
				update: function(dt) {
					this.spawnSurferTime += dt;
					this.spawnSurferLoop(dt);
				},
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
		spawnSurferLoop: function(dt){
			this.spawnSurferTime += dt;
			if (this.spawnSurferTime >= SURFER_SPAWN_SPEED) {
				this.spawnSurferTime = 0;
				this.c.entities.create(Surfer, {
					center: {
						x: Math.random() * this.size.x,
						y: -100
					}
				});
			}
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
