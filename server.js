var connect = require('connect');
connect.createServer(
    connect.static('./public')
).listen(3000);