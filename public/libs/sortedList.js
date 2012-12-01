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
		item.addClass(this.options.classPrefix + id).addClass(this.options.classPrefix + "pos" + position).data("pos", position);
		if (this.get(id).length == 0) {
			if (position == null) {
				this.element.append(item);
			} else {
				if (this.getByIndex(position).length > 0) {
					var maxPosition = parseInt(this.element.children("li").last().data("pos"));
					for (var pos = maxPosition; pos >= position; pos--) {
						this.getByIndex(pos)
							.removeClass(this.options.classPrefix + "pos" + pos)
							.addClass(this.options.classPrefix + "pos" + (pos+1))
							.data("pos", pos+1);
					}
				}

				var preItem = null;
				for (var pos = position; pos >= 0 && preItem == null; pos--) {
					preItem = this.getByIndex(pos);
					if (preItem.length == 0) {
						preItem = null;
					}
				}
				if (preItem == null) {
					this.element.prepend(item);
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
		return this.element.children(this.options.item).filter("." + this.options.classPrefix + "pos" + index);
	},

	remove: function (id) {
		var position = parseInt(this.get(id).data("pos"));
		var maxPosition = parseInt(this.element.children("li").last().data("pos"));
		for (var pos = position; pos <= maxPosition; pos++) {
			this.getByIndex(pos)
				.removeClass(this.options.classPrefix + "pos" + pos)
				.addClass(this.options.classPrefix + "pos" + (pos-1))
				.data("pos", pos-1);
		}

		this.get(id).remove();
	}
});
