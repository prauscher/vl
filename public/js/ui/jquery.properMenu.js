// vim:noet:sw=8:

$.widget("custom.properMenu", {
	options: {},

	addItem: function (itemid, parentid, position) {
		var self = this;

		var parentList;
		if (parentid == null) {
			parentList = this.menu;
		} else {
			var parent = this.menu.find("." + parentid);
			parentList = parent.children("ol");
			if (parent.children("ol").length == 0) {
				parentList = $("<ol>").hide();
				parent.children("a")
					.mouseover(function (e) {
						parentList
							.css({
								position: "absolute",
								top: e.offsetY,
								left: e.offsetX - 150
							})
							.show();
					})
					.mouseout(function () {
						parentList.hide();
					})
				parent.append(parentList);
			}
		}

		var item = $("<li>").addClass(itemid)
			.append($("<a>")
				.click(function() {
					self.menu.hide();
				}) );

		if (!position) {
			parentList.append(item);
		} else if (position == 0) {
			parentList.prepend(item);
		} else {
			parentList.children("li:eq(" + (position-1) + ")").after(item);
		}
	},

	setItem: function (itemid, options) {
		this.menu.find("." + itemid).toggle(!options.hidden);
		this.menu.find("." + itemid).children("a").attr("href", options.href).text(options.title);
	},

	removeItem: function (itemid) {
		this.menu.find("." + itemid).remove();
	},

	_create: function () {
		var self = this;
		this.menu = $("<ol>").hide();
		$("body").append(this.menu);
		this.element.click(function (e) {
			$(self.menu)
				.css({
					position: "absolute",
					left: e.pageX,
					top: e.pageY
				})
				.show();
		});
		$(this.options.menu).hide();
	}
});
