;(function(exports) {
	var Game = function() {
		var width = $(document).width();
		var height = $(document).height();
		this.c = new Coquette(this, "canvas", width, height, "#000");
		this.c.sock = new Sock(this);

		this.c.renderer._ctx.imageSmoothingEnabled = false;

		this.c.entities.create(Ocean, {size: { x:width, y:height }, center: {x: width / 2, y: height / 2}});

		var waveHeight = height / 2.5;
		var i;
		for(i = 0; i * waveHeight < height + waveHeight; i++) {
			this.c.entities.create(Wave, {
				center: {x: width / 2, y: waveHeight * i},
				size: { x:width, y:waveHeight },
				maxY: height,
				speed: 1,
				zindex: -5
			});
		}
		waveHeight = height / 3;
		for(i = 0; i * waveHeight < height + waveHeight; i++) {
			this.c.entities.create(Wave, {
				center: {x: width / 2, y: waveHeight * i},
				size: { x:width, y:waveHeight },
				maxY: height,
				speed: 1.5,
				zindex: -30
			});
		}
		waveHeight = height / 2;
		for(i = 0; i * waveHeight < height + waveHeight; i++) {
			this.c.entities.create(Wave, {
				center: {x: width / 2, y: waveHeight * i},
				size: { x:width, y:waveHeight },
				maxY: height,
				speed: 3,
				zindex: -40
			});
		}

		this.c.entities.create(Surfer, {});

		this.c.entities.create(Control, {center: {x:width/2, y:height/2}, size: {x:width, y:height}});
	};

	window.addEventListener('load', function() {
		game = new Game();
		theme = new Audio('resource/theme.ogg');
		theme.play();
	});
})();
