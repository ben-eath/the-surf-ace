;(function(exports) {
	// stores things like:
	// whether the game is running

	var SURFER_SPAWN_SPEED = 1000 * 3;
	var SCORE_PADDING = 70;
	var SCORE_MARGIN = 40;
	var SCORE_Y = 40;
	var BOAT_SPAWN_SPEED = 1000 * 30;

	exports.Control = function(game, settings) {
		this.c = game.c;
		initObject(this, settings);
		this.state = "WAITING_FOR_PLAYERS";
		this.spawnSurferTime = 0;
		this.boatSpawnTime = 0;
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
						var boats = this.c.entities.all(Boat);
						for (var b in boats) {
							boats[b].die(false);
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
					ctx.fillText('Server Password: ' + roomID, this.center.x, this.center.y+73);
					ctx.fillStyle = 'white';
					ctx.fillText('Server Password: ' + roomID, this.center.x, this.center.y+70);
				}
			},
			INTRO_START: {
				init: function() {
					this.age = 0;
					this.ben = this.createBen();
					this.dialogue = this.createDialogue("SUP, DUDES AND DUDETTES! I'M BEN, AND I'M THE ACE SURFER THIS SIDE OF THE SHORELINE. LET'S RIDE SOME WAVES AND CATCH SOME SUN!");
				},
				update: function(dt) {
					this.age += dt;
					if(this.c.inputter.isPressed(68)){
						this.next();
					}
				},
				next: function() {
					if(this.age < 2000) return;
					this.changeState('INTRO_END');
				},
				draw: function(ctx) {
					this.showServerPass(ctx);
				}
			},
			INTRO_END: {
				init: function() {
					this.age = 0;
					this.dialogue.text = "WATCH OUT FOR SHARKS! I HATE SHARKS!";
				},
				update: function(dt) {
					this.age += dt;
					if(this.c.inputter.isPressed(68)){
						this.next();
					}
					if(this.dialogue.length === 0) {
						this.changeState('ROUND_1');
					}
				},
				next: function() {
					if(this.age < 1000) return;
					this.dialogue.dialogueUp = false;
					this.ben.onScreen = false;
				},
				draw: function(ctx) {
					this.showServerPass(ctx);
				}
			},
			ROUND_1: {
				init: function() {

				},
				update: function(dt) {
					this.spawnSurferLoop(dt * 1.5);
				},
				draw: function(ctx) {
					this.showServerPass(ctx);
					this.drawScores(ctx);
				},
				next: function() {

				}
			}
		},
		showServerPass: function(ctx) {
			ctx.font = '20pt VT323';
			ctx.fillStyle = 'black';
			var roomID = this.c.sock.roomID === null ? "Unknown!" : this.c.sock.roomID;
			ctx.fillText(roomID, 5, 20);
			ctx.fillStyle = 'white';
			ctx.fillText( roomID, 5, 20);
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
		next: function() {
			if(this.states[this.state].next) {
				this.states[this.state].next.call(this);
			}
		},
		createDialogue: function(text) {
			return this.c.entities.create(DialogueBox, {
				text: text,
				center: {
					x: this.size.x / 2,
					y: this.size.y + 100
				},
				size: {
					x: this.size.x,
					y: 200
				},
				finalY: this.size.y - 200
			});
		},
		createBen: function() {
			var width = this.size.x;
			var height = this.size.y;
			return this.c.entities.create(BenEath, {
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
		},
		spawnSurferLoop: function(dt){
			this.spawnSurferTime += dt;
			this.boatSpawnTime += dt;
			if (this.boatSpawnTime >= BOAT_SPAWN_SPEED) {
				this.boatSpawnTime = 0;
				this.c.entities.create(Boat, {
					center: {
						x: Math.random() * this.size.x,
						y: 1
					}
				});
			} else if (this.spawnSurferTime >= SURFER_SPAWN_SPEED) {
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
		},
		drawScores: function(ctx) {
			var scores = this.c.scores;
			var x = SCORE_MARGIN;
			var y = this.size.y - SCORE_Y;

			ctx.textAlign = 'left';
			for (var i in scores) {
				ctx.font = '30pt VT323';
				ctx.fillStyle = 'black';
				ctx.fillText("" + scores[i], x, y+3);
				ctx.fillStyle = PLAYER_COLORS[i];
				ctx.fillText("" + scores[i], x, y);
				x += SCORE_PADDING;
			}
		}
	};

})(window);
