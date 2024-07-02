import { Server } from 'socket.io';

const socket = (io: Server) => {
  io.on('connection', socket => {
    console.log('👤 A user connected');

    socket.on('join', userId => {
      socket.join(userId);
      console.log(`User ${userId} joined room`);
    });
    //disconnect user
    socket.on('disconnect', () => {
      console.log('A user disconnected');
    });
  });
};

export default socket;
