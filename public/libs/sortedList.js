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
		item.addClass(this.options.classPrefix + id).addClass(this.options.classPrefix + "pos" + id);
		if (this.get(id).length == 0) {
			if (position == null) {
				this.element.append(item);
			} else {
				var preItem = null;
				for (var pos = position; pos > 0 && preItem == null; pos--) {
					preItem = $(this.options.classPrefix + "pos" + pos);
					if (preItem.length == 0) {
						preItem = null;
					}
				}
				if (preItem == null) {
					preItem.prepend(item);
				} else {
					preItem.after(item);
				}
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
