'use strict';

var query = require('query')
	, classes = require('classes')
	, Emitter = require('emitter')
	, defaults = require('deeperDefaults')
	, compStyle = require('computed-style')
	, events = require('event')
	, Fx = require('fx')
;

var defaultOptions = {
	classes: {
		panel: 'side-panel'
	}
	, widthPercentage: 0.05 // 5%
	, maxWidth: 50					// pixels
	, position: 'left'
	, animationDuration: 300
};

function Panel(el, options) {

	var self = this;

	Emitter.call(self);

	self.el = el;
	self._options = defaults(options, defaultOptions);

	self.fx = new Fx(self.el, self._options.position, {
		duration: self._options.animationDuration
	});

	classes(el).add(self._options.classes.panel);

	self.showing = false;

	self._getHideOffset();

	self.fx.set(self.hideOffset);

	self.adjustPosition();

	events.bind(window, 'resize', function () {
		self._getHideOffset();
		self.adjustPosition();
	});

}

Panel.prototype.__proto__ = Emitter.prototype;

Panel.prototype._getHideWidth = function () {

	var bWidth = document.body.offsetWidth
		, cWidth = Math.round(bWidth * this._options.widthPercentage)
	;

	return cWidth > this._options.maxWidth ? this._options.maxWidth : cWidth;

};

Panel.prototype._getHideOffset = function () {

	var cWidth = this.el.offsetWidth;

	this.hideOffset = (cWidth - this._getHideWidth()) * -1;

};

Panel.prototype.adjustPosition = function () {

	if (!this.showing) {
		this.fx.to(this.hideOffset);
	} else {
		this.fx.to(0);
	}

};

Panel.prototype.show = function () {

	this.showing = true;

	this.adjustPosition();

	this.emit('show');

};

Panel.prototype.hide = function () {

	this.showing = false;

	this.adjustPosition();

	this.emit('hide');

};

module.exports = function (el, options) {
	return new Panel(el, options);
};
