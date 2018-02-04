
define(
	[
		'jquery'
	], function(
		$
	) {

	var Main = function(){};

	Main.prototype.init = function(element) {
		console.log('Main.js is ready');
	};

	return Main;

});