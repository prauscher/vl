// vim:noet:ts=4:sw=4:

model = { initializers: { } };

model.register = function(name, initializer) {
	model.initializers[name] = initializer;
}

model.initialize = function(name) {
	model.initializers[name]();
}
