const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});
app.get('/main.js', (req, res) => {
  res.sendFile(__dirname + '/public/main.js');
});

io.on('connection', (socket) => {
  console.log('a user connected');

  socket.on('username', function(name){
    players.push(name);
    socket.broadcast.emit('syncPlayers', players)
    socket.emit('syncPlayers', players);
  });

  socket.on('updateXYpos', function(username, pos1, pos2) {
    console.log(username + ' x-' + pos1 + '-   y-' + pos2)
    socket.broadcast.emit('updatePos', username, pos1, pos2);
    socket.emit('updatePos', username, pos1, pos2);
  });
});

server.listen(3000, () => {
  console.log('listening on *:3000');
});

var players = [];
