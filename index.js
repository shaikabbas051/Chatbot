const express = require("express");
const app = express();
const server = require("http").createServer(app);
const io = require("socket.io").listen(server);
var connections = [];
server.listen(3003);
console.log("server started");
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/login.html");
});
app.get("/:name", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

io.sockets.on("connection", socket => {
  let newclient = { id: socket.id, name: socket.handshake.query.name };
  //emit to all users except sender
  socket.broadcast.emit("newuser", { data: newclient });
  //emit only to sender
  socket.emit("allusers", { data: connections });

  connections.push(newclient);
  console.log(connections);

  socket.on("sendmessage", data => {
    let name = "";
    connections.map(item => {
      if (item.id === socket.id) {
        name = item.name;
      }
    });
    socket.broadcast.emit("newmessage", {
      msg: data,
      id: socket.id,
      name: name
    });
  });

  socket.on("disconnect", () => {
    let index;
    for (let i = 0; i < connections.length; i++) {
      if (connections[i].id === socket.id) {
        index = i;
        break;
      }
    }
    socket.broadcast.emit("userdisconnected", { data: connections[index] });
    connections.splice(index, 1);
  });
});
