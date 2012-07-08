$(function () {
	$.widget("custom.selectProjector", {
		options : {
			prefix : "Projector ",
			clickProjector : null,
			selectedProjector : {}
		},

		addProjector : function (data) {
			this._addProjector.apply(this, data);
		},
		_addProjector : function (projectorid, projector) {
			var self = this;
			this.element.append($("<img>")
				.attr("src", "/images/empty.gif")
				.addClass("select-projector")
				.addClass("select-projector-" + projectorid)
				.css("background-color", projector.color)
				.attr("title", this.options.prefix + projector.title)
				.toggle(currentlyPickedProjector == null || currentlyPickedProjector == projectorid)
				.toggleClass("active", !!this.options.selectedProjector[projectorid])
				.click(function () {
					self.options.clickProjector && self.options.clickProjector(projectorid, $(this).hasClass("active"));
				}) );
		},

		updateProjector : function (data) {
			this._updateProjector.apply(this, data);
		},
		_updateProjector : function (projectorid, projector) {
			this.element.find(".select-projector-" + projectorid)
				.css("background-color", projector.color)
				.attr("title", this.options.prefix + projector.title);
		},

		deleteProjector : function (data) {
			this._deleteProjector.apply(this, data);
		},
		_deleteProjector : function (projectorid) {
			this.element.find(".select-projector-" + projectorid).remove();
		},

		toggleActive : function (data) {
			this._toggleActive.apply(this, data);
		},
		_toggleActive : function (projectorid, active) {
			this.options.projectorActive[projectorid] = active;
			this.element.find(".select-projector-" + projectorid).toggleClass("active", active);
		},

		_create : function () {
			var self = this;
			this.options.projectorActive = {};
			this.element.addClass("select-beamers");
			apiClient.eachProjector(function (projectorid, projector) {
				self._addProjector(projectorid, projector);
			});
		}
	});

	apiClient.on("initProjector", function (projectorid, projector) {
		$(":custom-selectProjector").selectProjector("addProjector", [ projectorid, projector ]);
	});

	apiClient.on("updateProjector", function (projectorid, projector) {
		$(":custom-selectProjector").selectProjector("updateProjector", [ projectorid, projector ]);
	});

	apiClient.on("deleteProjector", function (projectorid) {
		$(":custom-selectProjector").selectProjector("deleteProjector", [ projectorid ]);
	});
});
