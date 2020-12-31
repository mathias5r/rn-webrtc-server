import express from 'express';
import { Server } from 'socket.io';
import http from 'http';

const app = express();
app.set("port", process.env.PORT || 3000);

const httpServer = http.createServer(app);
const io = new Server(httpServer);

io.on('connection', function(socket) {

  console.log('Client connected.');

  // Disconnect listener
  socket.on('disconnect', function() {
      console.log('Client disconnected.');
  });
});

io.on('message', (msg) => {
  console.log('MSG: ', msg)
})

io.on('error', (error) => {
  console.log(error)
})

httpServer.listen(3000, () => {
  console.log('listening on *:3000');
});



