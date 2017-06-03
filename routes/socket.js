/**
 * Created by vidit on 3/6/17.
 */

var socketIo = require('socket.io')();

socketIo.on('connection', function (socket) {
    console.log("connection event called");

    socket.emit('news', { hello: 'world' });
    
    socket.on('disconnectSocket', function (data) {
        console.log("disconect event called");
        socket.conn.close();
    });

    socket.on('disconnect', function (data) {
        console.log("disconnect called by browser");
        socket.conn.close();
    });

    socket.on('my other event', function (data) {
        console.log(data);
    });
    
});

module.exports = socketIo;