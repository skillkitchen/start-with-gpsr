/*!
 * Start with GPSR
 * Copyright 2018 Skill Kitchen
 * http://www.skillkitchen.co/
 */

requirejs.config({
	paths: {
		jquery: 'lib/jquery',
	},

	shim: {
		'jquery': { exports: 'jQuery' }
	}
});

require([
	'lib/jquery',
	'app/Main'
], function(
	J,
	Main
){
	$(function() {
		// Remove Loader
		var main = new Main().init( $('body') );
	});
});