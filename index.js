const express = require("express");
const app = express();
const server = require("http").createServer(app);
const io = require("socket.io").listen(server);

server.listen(3003);
console.log("server started");

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/index.html");
});

io.sockets.on('connection', (socket) => {
    console.log(socket.id);
    socket.on('sendmessage', (data) => {
        console.log(data);
        console.log(socket.id);
        io.sockets.emit('newmessage', { msf: data });
    })
})