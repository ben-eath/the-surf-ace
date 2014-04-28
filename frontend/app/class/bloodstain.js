;(function(exports){

	var STARTING_RADIUS = 10;
	var EXPAND_SPEED = 1;
	var MOVE_SPEED = 2;
	var ENDING_RADIUS = 100;
	var EPSILON = 0.01;
	var SIZING_RATIO = 32;
	var SERPENTINE_AMOUNT = 1;

	exports.Bloodstain = function(game, settings) {
		this.c = game.c;
		initObject(this, settings);

		this.sizingTime = 6;
		this.bloods = [];
		this.bloodImage = new Image();
		this.bloodImage.src = './resource/blood/blood1.png';
		for(var i=0; i<10; i++) {
			this.bloods.push({
				x: this.center.x,
				y: this.center.y,
				s: 0,
				r: Math.random() * Math.PI * 2,
				a: 0.6,
				vx: Math.random() / 10 - 1/20,
				vy: Math.random() * 0.3 + 0.4,
				vr: Math.random() / 40 - 1/80,
				va: (Math.random() + 0.2) / -120,
				vs: Math.random(),
				serp: Math.random(),
				vserp: Math.random() * 0.03 + 0.003
			});
		}
		this.color = {
			r: 100,
			g: 0,
			b: 0,
			a: 1
		};
	};

	exports.Bloodstain.prototype = {
		zindex: -15,
		center: {
			x: 0,
			y: 0
		},
		bloodImage: new Image(),
		draw: function(ctx) {
			for (var i in this.bloods) {
				var b = this.bloods[i];
				if (b === null) {continue;}
				ctx.globalAlpha = b.a;
				drawRotatedImage(ctx,this.bloodImage, b.x, b.y, b.r, b.s, b.s);
			}
			ctx.globalAlpha = 1;
		},
		update: function(dt){
			if (this.sizingTime > 0) this.sizingTime--;
			var ratio = (this.sizingTime > 0) ? SIZING_RATIO : 1;
			for (var i in this.bloods) {
				var b = this.bloods[i];
				if (b === null) {continue;}
				b.x += b.vx;
				b.serp += b.vserp;
				b.x += Math.sin(b.serp) * SERPENTINE_AMOUNT;
				b.y += b.vy;
				b.a += b.va;
				b.r += b.vr;
				b.s += b.vs * ratio;
				if (b.a <= 0) {
					this.bloods[i] = null;
				}
			}
		}
	};
})(window);
