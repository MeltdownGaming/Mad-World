const app = require('express')(); 
const server = require('http').createServer(app);
const io = require('socket.io')(server);

var games = {}
var gameCount = 1

app.get('/', (req, res) => {
    res.sendFile(__dirname + "/public/index.html")
});

app.get('/main.js', (req, res) => {
    res.sendFile(__dirname + "/public/main.js")
});

io.on('connection', (socket) => {
  console.log('a user connected');

  var playerNumber
  var gameNo = gameCount

  if(games[gameCount] == null) {
    games[gameCount] = {players: 1, bullets: 0, playerPositions: {1: {x: 0, y: 0, z: 0}}, playerNames: {1: "Player 1"}, scores: {1: 0}}
    playerNumber = 1
  }
  else {
    games[gameCount].players ++

    playerNumber = games[gameCount].players

    games[gameCount].playerPositions[playerNumber] = {x: 0, y: 0, z: 0}
    games[gameCount].playerNames[playerNumber] = "Player " + playerNumber

    games[gameCount].scores[playerNumber] = 0

    if(games[gameCount].players == 4) {
      gameCount ++
    }
  }

  socket.join(gameNo)

  socket.emit("data", {type: "config", player: playerNumber})

  socket.on('data', (msg) => {
    if(msg.type == "name") {
      games[gameNo].playerNames[playerNumber] = msg.name
      socket.broadcast.to(gameNo).emit("data", {type: "name", "player": playerNumber, "name": msg.name})

      for(player in games[gameNo].playerNames) {
        if(player != playerNumber) {
          socket.emit("data", {type: "name", "player": player, "name": games[gameNo].playerNames[player], past: true})
        }
      }
    }
    else if(msg.type == "msg") {
      if(msg.msg != null) {
        var message = msg.msg

        if(message.length > 65) {
          message = message.substring(0, 62) + "..."
        }

        io.to(gameNo).emit("data", {type: "msg", msg: message, player: playerNumber})
      }
    }
  });

  socket.on('position', (msg) => {
    if(Array.isArray(msg) && msg.length == 3) {
      if(typeof msg[0] == "number" && typeof msg[1] == "number" && typeof msg[2] == "number") {
        games[gameNo].playerPositions[playerNumber].x = msg[0]
        games[gameNo].playerPositions[playerNumber].y = msg[1]
        games[gameNo].playerPositions[playerNumber].z = msg[2]

        msg.push(playerNumber)
        socket.broadcast.to(gameNo).emit("position", msg)
      }
    }
  });

  socket.on('shoot', (msg) => {
    if(Array.isArray(msg) && msg.length == 4) {
      if(typeof msg[0] == "number" && typeof msg[1] == "number" && typeof msg[2] == "number" && typeof msg[3] == "object") {
        games[gameNo].bullets ++
        msg.push(games[gameNo].bullets)
        io.to(gameNo).emit("shoot", msg)

        msg[0] += 4 * msg[3].x
        msg[1] += 4 * msg[3].y
        msg[2] += 4 * msg[3].z

        bulletCollisionCheck(msg[0], msg[1], msg[2], gameNo, playerNumber)
        
        var count = 0
        var interval = setInterval(function() {
          count ++

          msg[0] += msg[3].x
          msg[1] += msg[3].y
          msg[2] += msg[3].z

          bulletCollisionCheck(msg[0], msg[1], msg[2], gameNo, playerNumber)

          io.to(gameNo).emit("shoot", msg)

          if(count == 100) {
            clearInterval(interval)
            io.to(gameNo).emit("shoot", [msg[4]])
          }
        }, 10);
      }
    }
  });

  socket.on('disconnect', () => {
    console.log('user disconnected');

    io.to(gameNo).emit("data", {type: "disconnected", player: playerNumber})

    games[gameNo].players -= 1
  });
});

function bulletCollisionCheck(x, y, z, gameNo, playerNumber) {
  var playerCollisions = []
  for(player in games[gameNo].playerPositions) {
    var thisPlayer = games[gameNo].playerPositions[player]
    var inXMargin = isInMargin(thisPlayer.x, x)
    var inYMargin = isInMargin(thisPlayer.y, y)
    var inZMargin = isInMargin(thisPlayer.z, z)

    if(inXMargin && inYMargin && inZMargin) {
      if(player != playerNumber) {
        if(!playerCollisions.includes(player)) {
          io.to(gameNo).emit("data", {type: "bul col", player: player, attacker: playerNumber})
          games[gameNo].scores[playerNumber] += 1
          playerCollisions.push(player)
        }
      }
    }
  }
}

function isInMargin(playerPos, bulletPos) {
  var marginSize = 5
  var bottomMargin = bulletPos - (marginSize / 2)
  var topMargin = bulletPos + (marginSize / 2)

  if((playerPos > bottomMargin) && (playerPos < topMargin)) {
    return true
  }
  else {
    return false
  }
}

server.listen(3000);