var connect = require('connect');
connect.createServer(
    connect.static('/home/carl/Dev/trello-bulk/')
).listen(3000);