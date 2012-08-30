// vim:noet:ts=4:sw=4:

ko.bindingHandlers.miniColors = {
	init: function(element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
		var value = allBindingsAccessor().value;
		$(element).miniColors({
			value: ko.utils.unwrapObservable(value),
			change: value
		});
	},
	update: function(element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
		var value = allBindingsAccessor().value;
		$(element).miniColors("value", ko.utils.unwrapObservable(value));
	}
}
