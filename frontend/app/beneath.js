;(function(exports) {
	var Game = function() {
		var width = $(document).width();
		var height = $(document).height();
		this.c = new Coquette(this, "canvas", width, height, "#000");
		this.c.sock = new Sock(this);

		this.c.renderer._ctx.imageSmoothingEnabled = false;

		this.c.entities.create(Ocean, {size: { x:width, y:height }, center: {x: width / 2, y: height / 2}});
		this.c.entities.create(OceanSurface, {size: { x:width, y:height }, center: {x: width / 2, y: height / 2}});

		this.c.entities.create(Surfer, {});

		this.c.entities.create(Control, {center: {x:width/2, y:height/2}, size: {x:width, y:height}});
	};

	window.addEventListener('load', function() {
		game = new Game();
		theme = new Audio('resource/theme.ogg');
		theme.loop = true;
		theme.play();
	});
})();
