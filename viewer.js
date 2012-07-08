var webserver = require('./webserver.js');

var app = webserver.createServer();
app.setStart('/beamer');
app.addViewer();
app.start();
