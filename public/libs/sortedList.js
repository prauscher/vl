// vim:noet:sw=8:

$.widget("custom.sortedList", {
	options: {
		item : "*"
	},
	
	add: function (position, item) {
		if (position == 0) {
			this.element.prepend(item);
		} else {
			this.element.children(this.options.item + ":eq(" + (position-1) + ")").after(item);
		}
	},
});
