;(function(exports) {
	var Game = function() {
		var width = $(window).width();
		var height = $(window).height();
		this.c = new Coquette(this, "canvas", width, height, "#000");
		this.sock = new Sock(function(data) {
			// callback on data
		});

		this.c.entities.create(Ocean, {size: { x:width, y:height }});
		this.c.entities.create(Shark, {});
	};

	window.addEventListener('load', function() {
		new Game();
	});
})();
