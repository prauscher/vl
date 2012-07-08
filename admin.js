var webserver = require('./webserver.js');

var app = webserver.createServer();
app.setStart('/admin/');
app.addViewer();
app.addAdmin();
app.start();
