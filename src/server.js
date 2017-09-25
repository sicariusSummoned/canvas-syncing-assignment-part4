const http = require('http');
const socketio = require('socket.io');

const fs = require('fs');

const PORT = process.env.PORT || process.env.NODE_PORT || 3000;

const handler = (request, response) => {
  fs.readFile(`${__dirname}/../client/index.html`, (err, data) => {
    if (err) {
      throw err;
    }

    response.writeHead(200);
    response.write(data);
    response.end();
  });
};


const app = http.createServer(handler);

const io = socketio(app);

app.listen(PORT);


const onConnection = (sock) => {
  const socket = sock;

  socket.on('join', () => {
    socket.join('room1');
    console.log('User Joined');
  });
};


const onDraw = (sock) => {
  const socket = sock;

  socket.on('draw', (data) => {
    io.sockets.in('room1').emit('message', data);
    console.log('Received draw from client');
    console.dir(data);
  });
};


io.on('connection', (socket) => {
  onConnection(socket);
  onDraw(socket);
});


console.log(`Server opened at 127.0.0.1:${PORT}`);
