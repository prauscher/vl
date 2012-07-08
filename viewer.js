var webserver = require('./webserver.js');

var app = webserver.createServer();
app.setStart('/projector');
app.addViewer();
app.start();
