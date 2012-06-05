var app = require('http').createServer(handler), 
  io = require('socket.io').listen(app), 
  fs = require('fs'),
  clients = [],
  clientId = 0,
  activeId = 0,
  actionCounter = 0;

app.listen(8080);

function handler (req, res) {
  fs.readFile(__dirname + '/index.html',
  function (err, data) {
    if (err) {
      res.writeHead(500);
      return res.end('Error loading index.html');
    }

    res.writeHead(200);
    res.end(data);
  });
}

// Socket Connection
io.sockets.on('connection', function (socket) {
  // On connection
  socket.clientId = clientId++;
  clients.push( socket );
 
  // Give all users the current user count
  io.sockets.emit('client-count-push', clients.length );
  // Tell new user which image is current
  socket.emit('image-change', activeId  );

  // === Event actions ===

  // Image change
  socket.on('image-change', function (data) {
    // Alert all other users of this action
    activeId = data;
    socket.broadcast.emit('image-change', data );
    actionCounter++;
  });

  // User disconnects
  socket.on('disconnect', function () {
    // Remove user from clients list
    var i = clients.indexOf( socket );
    clients.splice( i, 1 );

    // Alert all other users of this disconnect
    socket.broadcast.emit( 'client-count-push', clients.length );

  });

});


// Update Client Count
setInterval( function(){
    io.sockets.emit( "stats", { 
      "client-count": clients.length,
      "action-count": actionCounter 
    });
    actionCounter = 0;
}, 1000);
