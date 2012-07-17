// vim:noet:sw=8:

$.widget("custom.sortedList", {
	options: {
		item : "*",
		classPrefix : "item-"
	},
	
	add: function (id, position, item) {
		if (typeof position == "object") {
			item = position;
			position = null;
		}
		item.addClass(this.options.classPrefix + id);
		if (this.get(id).length == 0) {
			if (position == null) {
				this.element.append(item);
			} else if (position == 0) {
				this.element.prepend(item);
			} else {
				this.getByIndex(position - 1).after(item);
			}
		}
	},

	get: function (id) {
		return this.element.children(this.options.item).filter("." + this.options.classPrefix + id);
	},

	getByIndex: function (index) {
		return this.element.children(this.options.item).eq(index);
	},

	remove: function (id) {
		this.get(id).remove();
	}
});
