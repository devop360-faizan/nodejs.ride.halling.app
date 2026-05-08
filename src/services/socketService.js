const jwt = require('jsonwebtoken');
const prisma = require('../utils/prisma');

const initSocket = (io) => {
  io.use((socket, next) => {
    const token = socket.handshake.auth.token || socket.handshake.query.token;

    if (!token) {
      return next(new Error('Token nahi mila'));
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      socket.user = decoded;
      next();
    } catch (error) {
      return next(new Error('Token galat hai'));
    }
  });

  io.on('connection', (socket) => {
    console.log(`User connect hua: ${socket.user.id}`);

    socket.on('join_room', async (roomId) => {
      try {
        const member = await prisma.roomMember.findUnique({
          where: {
            userId_roomId: {
              userId: socket.user.id,
              roomId: roomId
            }
          }
        });

        if (!member) {
          socket.emit('error', 'Pehle room join karo API se');
          return;
        }

        // User ka data fetch karo
        const user = await prisma.user.findUnique({
          where: { id: socket.user.id },
          select: { id: true, name: true }
        });

        socket.join(`room_${roomId}`);
        
        // Sabko batao ke ye user join ho gaya
        io.to(`room_${roomId}`).emit('joined', {
          message: `${user.name} room mein aa gaye!`,
          user: user
        });
        
        console.log(`✅ User ${user.name} joined room ${roomId}`);

      } catch (error) {
        console.error("JOIN_ROOM_ERROR:", error);
        socket.emit('error', 'Kuch gadbad hui');
      }
    });

    socket.on('send_message', async ({ roomId, content }) => {
      try {
        const member = await prisma.roomMember.findUnique({
          where: {
            userId_roomId: {
              userId: socket.user.id,
              roomId: roomId
            }
          }
        });

        if (!member) {
          socket.emit('error', 'Tum is room ke member nahi ho');
          return;
        }

        // Pehle user ka data fetch karo
        const user = await prisma.user.findUnique({
          where: { id: socket.user.id },
          select: { id: true, name: true }
        });

        const message = await prisma.message.create({
          data: {
            content,
            userId: socket.user.id,
            roomId: roomId
          }
        });

        // Message ke saath user ka data attach karo
        const messageWithUser = {
          ...message,
          user: user
        };

        console.log(`📨 Message sent by ${user.name}:`, messageWithUser);
        io.to(`room_${roomId}`).emit('new_message', messageWithUser);

      } catch (error) {
        console.error("SEND_MESSAGE_ERROR:", error);
        socket.emit('error', 'Message send nahi hua');
      }
    });

    socket.on('leave_room', (roomId) => {
      socket.leave(`room_${roomId}`);
      socket.emit('left', `Room ${roomId} se nikal gaye`);
    });

    socket.on('disconnect', () => {
      console.log(`User disconnect hua: ${socket.user.id}`);
    });
  });
};

module.exports = { initSocket };