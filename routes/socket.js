/**
 * Created by vidit on 3/6/17.
 */

var socketIo = require('socket.io')();

socketIo.on('connection', function (socket) {
    console.log("connection event called");

    socket.on('disconnectSocket', function (data) {
        console.log("disconect event called");
        socket.conn.close();
    });

    socket.on('disconnect', function (data) {
        console.log("disconnect called by browser");
        socket.conn.close();
    });
    
});

module.exports = socketIo;