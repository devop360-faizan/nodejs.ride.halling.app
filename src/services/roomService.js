const { parse } = require('dotenv');
const prisma = require('../utils/prisma');


const createRoom = async (name) => {
    const existing = await prisma.room.findUnique({
        where: { name }
    });
    if (existing) {
        const error = new Error('Room already exists');
        error.statusCode = 400;
        throw error;
    }
    const room = await prisma.room.create({
        data: { name }
    });
    return room;
}


const getAllRooms = async () => {
    const rooms = await prisma.room.findMany({
        include: {
            _count: {
                select: {
                    members: true,
                    messages: true
                }
            }
        }
    });
    return rooms;
}

const joinRoom = async (userId, roomId) => {
    const room = await prisma.room.findUnique({
        where: { id: roomId }
    });
    if (!room) {
        const error = new Error('Room not found');
        error.statusCode = 404;
        throw error;
    }
    const alreadyMember = await prisma.roomMember.findUnique({
        where: {
            userId_roomId: {
                userId,
                roomId
            }
        }
    });

    if (alreadyMember) {
        const error = new Error('Already a member of this room');
        error.statusCode = 400;
        throw error;
    }

    await prisma.roomMember.create({
        data: {
            userId,
            roomId
        }
    });
    return room;
}


const leaveRoom = async (userId, roomId) => {
    const member = await prisma.roomMember.findUnique({
        where:{
            userId_roomId: {
                userId,
                roomId
            }
        }
    });

    if (!member) {
        const error = new Error('Not a member of this room');
        error.statusCode = 400;
        throw error;
    }

    await prisma.roomMember.delete({
        where: {
            userId_roomId: {
                userId,
                roomId
            }
        }
    });

    return { message: 'Left room successfully' };
}


const getRoomMessages = async (userId, roomId) => {
    const member = await prisma.roomMember.findUnique({
        where:{
            userId_roomId: {
                userId,
                roomId
            }
        }
    });
    if(!member) {
        const error = new Error('Not a member of this room');
        error.statusCode = 400;
        throw error;
    }

    const messages = await prisma.message.findMany({
        where: {roomId: roomId},
        include:{
            user:{
                select: { id: true, name: true }
            }
        },
        orderBy: { created_at: 'asc' }
    });

    return messages;
}

const sendMessage = async (userId, roomId, content) => {
    // Check karo ke user room ka member hai ya nahin
    const member = await prisma.roomMember.findUnique({
        where:{
            userId_roomId: {
                userId,
                roomId
            }
        }
    });

    if (!member) {
        const error = new Error('Tum is room ke member nahi ho');
        error.statusCode = 400;
        throw error;
    }

    // Message create karo
    const message = await prisma.message.create({
        data: {
            content,
            userId,
            roomId
        },
        include: {
            user: {
                select: { id: true, name: true }
            }
        }
    });

    return message;
}

module.exports = { createRoom, getAllRooms, joinRoom, leaveRoom , getRoomMessages, sendMessage };