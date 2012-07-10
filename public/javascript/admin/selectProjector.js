$.widget("custom.selectProjector", {
	options : {
		prefix : "Projector ",
		clickProjector : null,
		defaultActive : false,
		except : [ ]
	},

	addProjector : function (projectorid, projector) {
		var self = this;
		this.element.append($("<img>")
			.attr("src", "/images/empty.gif")
			.addClass("select-projector")
			.addClass("select-projector-" + projectorid)
			.attr("title", this.options.prefix + projector.title)
			.toggle(currentlyPickedProjector == null || currentlyPickedProjector == projectorid)
			.toggleClass("active", this.options.defaultActive)
			.toggleClass("disabled", $.inArray(projectorid, this.options.except) != -1)
			.css("background-color", projector.color)
			.click(function () {
				self.options.clickProjector && self.options.clickProjector.apply(self, [ projectorid, $(this).hasClass("active") ]);
			}));
	},

	updateProjector : function (projectorid, projector) {
		this.element.find(".select-projector-" + projectorid)
			.css("background-color", projector.color)
			.attr("title", this.options.prefix + projector.title);
	},

	deleteProjector : function (projectorid) {
		this.element.find(".select-projector-" + projectorid).remove();
	},

	toggleActive : function (projectorid, active) {
		this.element.find(".select-projector-" + projectorid).toggleClass("active", active);
	},

	isActive : function (projectorid) {
		return this.element.find(".select-projector-" + projectorid).hasClass("active");
	},

	_create : function () {
		var self = this;
		this.element.addClass("select-beamers");
		apiClient.eachProjector(function (projectorid, projector) {
			self.addProjector(projectorid, projector);
		});
	}
});

$(function () {
	apiClient.on("initProjector", function (projectorid, projector) {
		$(":custom-selectProjector").selectProjector("addProjector", projectorid, projector);
	});

	apiClient.on("updateProjector", function (projectorid, projector) {
		$(":custom-selectProjector").selectProjector("updateProjector", projectorid, projector);
	});

	apiClient.on("deleteProjector", function (projectorid) {
		$(":custom-selectProjector").selectProjector("deleteProjector", projectorid);
	});
});
