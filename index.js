'use strict';

var classes = require('classes')
	, Emitter = require('emitter')
	, defaults = require('deeperDefaults')
	, events = require('event')
  , stylar = require('stylar')
;

var capitalize = function (str) {
	return str.charAt(0).toUpperCase() + str.slice(1);
}

var defaultOptions = {
	classes: {
		panel: 'side-panel'
	}
	, widthPercentage: 0.05 // 5%
	, maxWidth: 50					// pixels
	, position: 'left'
	, animationDuration: 300
	, padBody: false
};

function SidePanel(el, options) {

	var self = this;

	Emitter.call(self);

	self.el = el;
	self._options = defaults(options, defaultOptions);

	classes(el).add(self._options.classes.panel);

	self.showing = false;

	self._getHideOffset();

  stylar(el)
    .set(self._options.position, self.hideOffset + 'px')
    .set('transitionDuration', '300ms')
    .set('transitionTimingFunction', 'ease')
    .set('transitionProperty', self._options.position)
  ;

	self.adjustPosition();

	events.bind(window, 'resize', function () {
		self._getHideOffset();
		self.adjustPosition();
	});

}

SidePanel.prototype.__proto__ = Emitter.prototype;

SidePanel.prototype._getHideWidth = function () {

	var bWidth = document.body.offsetWidth
		, cWidth = Math.round(bWidth * this._options.widthPercentage)
	;

	return cWidth > this._options.maxWidth ? this._options.maxWidth : cWidth;

};

SidePanel.prototype._getHideOffset = function () {

	var cWidth = this.el.offsetWidth
		, hideWidth = this._getHideWidth()
	;

	this.hideOffset = (cWidth - hideWidth) * -1;

	if (this._options.padBody) {
		document.body.style['padding' + capitalize(this._options.position)] = hideWidth + 'px';
	}

};

SidePanel.prototype.adjustPosition = function () {
  
  var pos = 0;

	if (!this.showing) {
    pos = this.hideOffset;
	}

  stylar(this.el)
    .set(this._options.position, pos + 'px')
  ;

};

SidePanel.prototype.show = function () {

	this.showing = true;

	this.adjustPosition();

	this.emit('show');

};

SidePanel.prototype.hide = function () {

	this.showing = false;

	this.adjustPosition();

	this.emit('hide');

};

module.exports = function (el, options) {
	return new SidePanel(el, options);
};
