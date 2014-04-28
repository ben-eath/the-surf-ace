;(function(exports) {
	// stores things like:
	// whether the game is running
	var SCORE_PADDING = 150;
	var SCORE_MARGIN = 40;
	var SCORE_Y = 40;
	var DIALOGUE_MIN_TIME = 800;
	var SCORE_SPEED = 1;

	exports.Control = function(game, settings) {
		this.c = game.c;
		initObject(this, settings);
		this.state = "WAITING_FOR_PLAYERS";
		this.surferSpawnTime = 0;
		this.boatSpawnTime = 0;
		this.fontLoadWait = 200; //LOL HAX
		this.timer = 0;
		this.drawnScores = [];
		this.boatSpawnSpeed = 0;
		this.surferSpawnSpeed = 0;
		this.currentLevelTime = 0;

		this.states[this.state].init.call(this);
	};

	exports.Control.prototype = {
		zindex: 90,
		states: {
			WAITING_FOR_PLAYERS: {
				init: function() {
					this.surferSpawnSpeed = 1000 * 3;
					this.setSharksVisible(true);
				},
				update: function(dt) {
					this.spawnSurferLoop(dt);
					this.fontLoadWait -= dt;
					if ((this.c.inputter.isPressed(68))) {
						this.next();
					}
				},
				next: function() {
					if(this.c.sock.data.sharks && this.c.sock.data.sharks.length) {
						this.clearScreen();
						this.changeState("ORIENTATION");
						this.c.sock.gameStarted = true;
					}
				},
				draw: function(ctx){
					if(this.fontLoadWait < 0) { //LOL HAX
						this.drawLargeText(ctx, "Ben Eath, the Surf Ace");
					}
					ctx.font = '30pt VT323';
					ctx.fillStyle = 'black';
					//SERVER URL
					var url = "Visit HTTP://BEN.RL.IO on your mobile phone";
					ctx.fillText('' + url, this.center.x, this.center.y+73);
					ctx.fillStyle = 'white';
					ctx.fillText('' + url, this.center.x, this.center.y+70);
					//SERVER PASS
					ctx.fillStyle = 'black';
					var roomID = this.c.sock.roomID === null ? "Connecting to server..." : this.c.sock.roomID;
					ctx.fillText('Room ID: ' + roomID, this.center.x, this.center.y+138);
					ctx.fillStyle = 'yellow';
					ctx.fillText('Room ID: ' + roomID, this.center.x, this.center.y+135);

					if(this.c.sock.data.sharks && this.c.sock.data.sharks.length) {
						var nPlayers = this.c.sock.data.sharks.length;
						var text = nPlayers + " players. Tap to start.";
						ctx.fillStyle = 'black';
						ctx.fillText('' + text, this.center.x, this.center.y+173);
						ctx.fillStyle = '#ff0';
						ctx.fillText('' + text, this.center.x, this.center.y+170);
					}
				}
			},
			ORIENTATION: {
				init: function() {
					this.dialogue = this.createDialogue(
						"TAP TO BITE AND CONTINUE.\nEAT EVERYTHING BUT EACH OTHER.\nYOU DIE IF YOUR SCORE HITS 0.",
						new SpriteSheet('./resource/orientation/orientation', 35, undefined, 0.2)
					);
					this.setSharksVisible(true);
				},
				update: function(dt) {
					this.age += dt;
					if(this.c.inputter.isPressed(68)){
						this.next();
					}
				},
				next: function() {
					if(this.age < DIALOGUE_MIN_TIME * 2) return;
					this.dialogue.dialogueUp = false;
					delete this.orientationSprite;
					this.changeState('INTRO_START');
				},
				draw: function(ctx) {

				}
			},
			INTRO_START: {
				init: function() {
					this.age = 0;
					this.setSharksVisible(false);
					this.ben = this.createBen(true);
					this.dialogue = this.createDialogue("SUP, DUDES AND DUDETTES! I'M BEN, AND I'M THE ACE SURFER THIS SIDE OF THE SHORELINE. LET'S RIDE SOME WAVES AND CATCH SOME SUN!");
				},
				update: function(dt) {
					this.age += dt;
					if(this.c.inputter.isPressed(68)){
						this.next();
					}
				},
				next: function() {
					if(this.age < DIALOGUE_MIN_TIME) return;
					this.dialogue.dialogueUp = false;
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
					this.dialogue.dialogueUp = true;
					this.setSharksVisible(false);
				},
				update: function(dt) {
					this.age += dt;
					if(this.c.inputter.isPressed(68)){
						this.next();
					}
					if (this.c.entities.all(BenEath).length === 0) {
						this.changeState('ROUND_1');
					}
				},
				next: function() {
					if(this.age < DIALOGUE_MIN_TIME) return;
					this.dialogue.dialogueUp = false;
					this.ben.onScreen = false;
				},
				draw: function(ctx) {
					this.showServerPass(ctx);
				}
			},
			ROUND_1: {
				init: function() {
					this.currentLevelTime = 60000;
					this.surferSpawnSpeed = 1000 * 2;
					this.boatSpawnSpeed = 0;
					this.setSharksVisible(true);
					this.timer = 0;
				},
				update: function(dt) {
					this.spawnSurferLoop(dt);
					if(this.c.inputter.isPressed(68)){
						this.timer = this.currentLevelTime;
					}
				},
				draw: function(ctx) {
					this.showServerPass(ctx);
					this.drawScores(ctx);
					this.drawTimer(ctx);
					this.next();
				},
				next: function() {
					if (this.timer > this.currentLevelTime) {
						this.changeState('AFTER_1');
						this.clearScreen();
					}
				}
			},
			AFTER_1: {
				init: function() {
					this.age = 0;
					this.ben = this.createBen(true);
					this.dialogue = this.createDialogue("TOTALLY NOT TUBULAR! ALL MY SURF BROS GETTIN' ATE. CALL THE COAST GUARD!");
					this.setSharksVisible(false);
				},
				update: function(dt) {
					this.age += dt;
					if(this.c.inputter.isPressed(68)){
						this.next();
					}
					if(this.c.entities.all(BenEath).length === 0){
						this.changeState('ROUND_2');
					}
				},
				next: function() {
					if(this.age < DIALOGUE_MIN_TIME) return;
					this.ben.onScreen = false;

				},
				draw: function(ctx) {
					this.showServerPass(ctx);
				}
			},
			ROUND_2: {
				init: function() {
					this.dialogue.dialogueUp = false;
					this.surferSpawnSpeed = 1000 * 1.5;
					this.boatSpawnSpeed = 1000 * 15;
					this.currentLevelTime = 120000;
					this.setSharksVisible(true);
					this.timer = 0;
				},
				update: function(dt) {
					this.spawnSurferLoop(dt);
					if(this.c.inputter.isPressed(68)){
						this.timer = this.currentLevelTime;
					}
				},
				draw: function(ctx) {
					this.showServerPass(ctx);
					this.drawScores(ctx);
					this.drawTimer(ctx);
					this.next();
				},
				next: function() {
					if (this.timer > this.currentLevelTime) {
						this.changeState('AFTER_2');
						this.clearScreen();
					}
				}
			},
			AFTER_2: {
				init: function() {
					this.age = 0;
					this.ben = this.createBen(true);
					this.dialogue = this.createDialogue("THOSE RAUNCHOUS SHARKS ARE HARSHING MY SURF! GET THEM, DUDES AND DUDETTES!");
					this.setSharksVisible(false);
				},
				update: function(dt) {
					this.age += dt;
					if(this.c.inputter.isPressed(68)){
						this.next();
					}
					if(this.c.entities.all(BenEath).length === 0){
						this.changeState('ROUND_3');
					}
				},
				next: function() {
					if(this.age < DIALOGUE_MIN_TIME) return;
					this.ben.onScreen = false;

				},
				draw: function(ctx) {
					this.showServerPass(ctx);
				}
			},
			ROUND_3: {
				init: function() {
					this.dialogue.dialogueUp = false;
					this.surferSpawnSpeed = 1000 * 1.5;
					this.boatSpawnSpeed = 1000 * 8;
					this.currentLevelTime = 120000;
					this.setSharksVisible(true);
					this.timer = 0;
				},
				update: function(dt) {
					this.spawnSurferLoop(dt);
					if(this.c.inputter.isPressed(68)){
						this.timer = this.currentLevelTime;
					}
				},
				draw: function(ctx) {
					this.drawTimer(ctx);
					this.showServerPass(ctx);
					this.drawScores(ctx);
					this.next();
				},
				next: function() {
					if (this.timer > this.currentLevelTime) {
						this.changeState('AFTER_3');
						this.clearScreen();
					}
				}
			},
			AFTER_3: {
				init: function() {
					this.age = 0;
					this.ben = this.createBen(true);
					this.dialogue = this.createDialogue("WHAT THE SURF? LOOKS LIKE IF YOU WANT SOMETHING DONE RIGHT, YOU HAVE TO SURF IT YOURSELF. I'M THE SURF ACE!");
					this.setSharksVisible(false);
				},
				update: function(dt) {
					this.age += dt;
					if(this.c.inputter.isPressed(68)){
						this.next();
					}
					if(this.c.entities.all(BenEath).length === 0){
						this.changeState('BOSS');
					}
				},
				next: function() {
					if(this.age < DIALOGUE_MIN_TIME) return;
					this.ben.onScreen = false;
				},
				draw: function(ctx) {
					this.showServerPass(ctx);
				}
			},
			BOSS: {
				init: function() {
					this.dialogue.dialogueUp = false;
					this.ben.onScreen = false;
					this.ben = this.createBen(false);
					this.boatSpawnSpeed = 0;
					this.surferSpawnSpeed = 0;
					this.setSharksVisible(true);
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
			},
		},
		showServerPass: function(ctx) {
			ctx.font = '20pt VT323';
			ctx.fillStyle = 'black';
			var roomID = this.c.sock.roomID === null ? "Unknown!" : this.c.sock.roomID;
			ctx.fillText(roomID, 5, 20);
			ctx.fillStyle = 'white';
			ctx.fillText( roomID, 5, 20);
		},
		drawTimer: function(ctx) {
			ctx.font = '20pt VT323';
			ctx.fillStyle = 'black';
			ctx.fillText(((this.currentLevelTime - this.timer) / 1000) | 0, this.center.x, 20);
			ctx.fillStyle = 'white';
			ctx.fillText(((this.currentLevelTime - this.timer) / 1000) | 0, this.center.x, 20);
		},
		clearScreen: function() {
			var surfers = this.c.entities.all(Surfer);
			for (var s in surfers) {
				surfers[s].die(false);
			}
			var boats = this.c.entities.all(Boat);
			for (var b in boats) {
				boats[b].die(false);
			}
		},
		setSharksVisible: function(bool) {
			var sharks = this.c.entities.all(Shark);
			for(var s in sharks) {
				sharks[s].temphidden = !bool;
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
			this.timer += dt;
			this.states[this.state].update.call(this, dt);
		},
		next: function() {
			if(this.states[this.state].next) {
				this.states[this.state].next.call(this);
			}
		},
		createDialogue: function(text, spriteSheet) {
			return this.c.entities.create(DialogueBox, {
				dialoguePortrait: spriteSheet,
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
		createBen: function(displayOnly) {
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
				displayOnly: displayOnly
			});
		},
		highestScore: function() {
			var scores = this.c.scores;
			var maxScore = 0;
			for (var i in scores) {
				if (scores[i] > maxScore) {maxScore = scores[i];}
			}
			return maxScore;
		},
		spawnSurferLoop: function(dt){
			this.surferSpawnTime += dt;
			this.boatSpawnTime += dt;
			if (this.boatSpawnSpeed && this.boatSpawnTime >= this.boatSpawnSpeed) {
				this.boatSpawnTime = 0;
				this.c.entities.create(Boat, {
					center: {
						x: Math.random() * (this.size.x - 50) + 25,
						y: 1
					}
				});
			} else if (this.surferSpawnSpeed && this.surferSpawnTime >= this.surferSpawnSpeed) {
				this.surferSpawnTime = 0;
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

			for (var i in scores) {
				if (this.drawnScores[i] === undefined) {
					this.drawnScores[i] = 0;
				} else if (this.drawnScores[i] < scores[i]) {
					this.drawnScores[i] += SCORE_SPEED;
					if (this.drawnScores[i] > scores[i]) this.drawnScores[i] = scores[i];
				} else if (this.drawnScores[i] > scores[i]) {
					this.drawnScores[i] -= SCORE_SPEED;
					if (this.drawnScores[i] < scores[i]) this.drawnScores[i] = scores[i];
				}
			}

			var x = SCORE_MARGIN;
			var y = this.size.y - SCORE_Y;
			ctx.textAlign = 'left';
			for (var j in this.drawnScores) {
				ctx.font = '30pt VT323';
				ctx.fillStyle = 'black';
				ctx.fillText(this.c.sock.getSharkData(j).name + ": " + this.drawnScores[j], x, y+3);
				ctx.fillStyle = PLAYER_COLORS[j];
				ctx.fillText(this.c.sock.getSharkData(j).name + ": " + this.drawnScores[j], x, y);
				x += SCORE_PADDING;
			}
		}
	};

})(window);
