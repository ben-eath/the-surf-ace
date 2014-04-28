;(function(exports) {

	exports.Jukebox = function(game) {
		this.c = game.c;
	};

	exports.Jukebox.prototype = {
		playChomp: function() {
			this.playSound('resource/sfx/chomp.wav');
		},
		playHurt: function() {
			this.playSound('resource/sfx/hurt.wav');
		},
		playSound: function(file) {
			var snd = new Audio(file);
			snd.play();
		}
	};

})(window);

