// vim:noet:sw=8:

$.widget("custom.viewerOptions", {
	options: {
		zoom: 1,
		scroll: 0,
		callback: null
	},

	_refresh: function () {
		var self = this;

		function generateCaller(zoom, scroll) {
			return function () {
				self.options.zoom = zoom;
				self.options.scroll = scroll;
				self.options.callback(zoom, scroll);
			}
		}

		this.element.children(".reset").unbind("click").click(generateCaller(1, 0));
		this.element.children(".zoom-in").unbind("click").click(generateCaller(parseFloat(this.options.zoom) * 1.1, parseInt(this.options.scroll)));
		this.element.children(".zoom-out").unbind("click").click(generateCaller(parseFloat(this.options.zoom) / 1.1, parseInt(this.options.scroll)));
		this.element.children(".scroll-up").unbind("click").click(generateCaller(parseFloat(this.options.zoom), parseInt(this.options.scroll) - 1));
		this.element.children(".scroll-down").unbind("click").click(generateCaller(parseFloat(this.options.zoom), parseInt(this.options.scroll) + 1));
	},

	_create: function () {
		this.element
			.append($("<i>").addClass("icon-repeat").addClass("reset").attr("title", "Ansicht zurücksetzen"))
			.append($("<i>").addClass("icon-zoom-in").addClass("zoom-in").attr("title", "Schrift vergrößern"))
			.append($("<i>").addClass("icon-zoom-out").addClass("zoom-out").attr("title", "Schrift verkleinern"))
			.append($("<i>").addClass("icon-chevron-up").addClass("scroll-up").attr("title", "Hinaufscrollen"))
			.append($("<i>").addClass("icon-chevron-down").addClass("scroll-down").attr("title", "Hinabscrollen"))
		this._refresh();
	},

	_setOptions: function () {
		$.Widget.prototype._setOptions.apply(this, arguments);
		this._refresh();
	}
});
