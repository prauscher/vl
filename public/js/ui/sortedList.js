// vim:noet:ts=4:sw=4:

$.widget("custom.sortedList", {
	options: { },
	
	insert: function(index, item) {
		item.addClass('sortedList-item');
		var children = this.element.children('.sortedList-item');

		if (index == -1 || index > children.length()) {
			this.element.append(item);
		} else if (index == 0) {
			this.element.prepend(item);
		} else {
			this.getByIndex(position - 1).after(item);
		}
	},

	get: function(index) {
		return this.element.children('[data-id]').eq(index);
	},

	remove: function(index) {
		this.get(id).remove();
	},

	clear: function() {
		this.element.children('[data-id]').remove();
	}
});
