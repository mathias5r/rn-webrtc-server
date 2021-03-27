import express from 'express';
import { Server } from 'socket.io';
import http from 'http';
import roomList from './roomList';
import createRoom from './room';

const app = express();
app.set('port', process.env.PORT || 3000);

const httpServer = http.createServer(app);
const io = new Server(httpServer);

io.on('connection', function (socket) {
  console.log('Client connected.');

  socket.on('disconnect', function () {
    console.log('Client disconnected.');
  });

  socket.on('create_or_join', createOrJoin(socket));

  socket.on('offer', onOffer(socket));

  socket.on('answer', onAnswer(socket))

  socket.on('candidate', onCandidate(socket));

  socket.on('error', (error) => {
    console.log(error);
  });
});

httpServer.listen(3000, () => {
  console.log('listening on *:3000');
});

const createOrJoin = (socket) => (args) => {
  const { roomID } = args;
  const room = roomList.getById(roomID);

  // Create a new room
  if (!room) {
    const newRoom = createRoom(roomID);
    newRoom.push(socket);
    roomList.push(newRoom);
    socket.emit('created', { roomID, socketID: socket.id });
    return;
  }

  //Room already exists
  if (room.getPeers().length < 5) {
    room.push(socket);
    socket.emit('joined', { roomID, socketID: socket.id });
    room.getMaster().emit('ready', { roomID, peer: socket.id });
    return;
  }

  socket.emit('full');
};

const onOffer = (socket) => (args) => {
  console.log('onOffer');
  const { description, roomID, peer: peerID } = args;
  const room = roomList.getById(roomID);
  const master = room.getMaster();
  if (socket === master) {
    const peer = room.getPeerById(peerID);
    peer.emit('offer', { description, ...args });
    return;
  }
  master.emit('offer', { description, ...args });
};

const onAnswer = (socket) => (args) => {
  console.log('onAnswer');
  const { description, roomID, peer: peerID } = args;
  const room = roomList.getById(roomID);
  const master = room.getMaster();
  if (socket === master) {
    const peer = room.getPeerById(peerID);
    peer.emit('answer', { description, ...args });
    return;
  }
  master.emit('answer', { description, ...args });
};

const onCandidate = (socket) => (args) => {
  console.log('onCandidate');
  const { description, roomID, peer: peerID } = args;
  const room = roomList.getById(roomID);
  const master = room.getMaster();
  if (socket === master) {
    const peer = room.getPeerById(peerID);
    peer.emit('candidate', { description, ...args });
    return;
  }
  master.emit('candidate', { description, ...args });
};


