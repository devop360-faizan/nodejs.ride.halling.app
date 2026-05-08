const roomService = require('../services/roomService');
const { errorResponse, successResponse } = require('../utils/apiResponse');
const { roomResource } = require('../resources/roomResource');


const create = async (req, res) => {
    try {
        const room = await roomService.createRoom(req.body.name);
        const responseData = roomResource(room);
        return successResponse(res, "Room created successfully!", responseData, 201);
    } catch (error) {
        console.error("CREATE_ROOM_ERROR:", error.message);
        const status = error.statusCode || 500;
        return errorResponse(res, error.message, status);
    }
};

const getAll = async (req, res) => {
    try {
        const rooms = await roomService.getAllRooms();
        const responseData = rooms.map(room => roomResource(room));
        return successResponse(res, "Rooms fetched successfully!", responseData);
    } catch (error) {
        console.error("GET_ALL_ROOMS_ERROR:", error.message);
        const status = error.statusCode || 500;
        return errorResponse(res, error.message, status);
    }
}

const join = async (req, res) => {
    try {
        const room = await roomService.joinRoom(req.user.id, req.params.id);
        return successResponse(res, "Joined room successfully!", roomResource(room));
    } catch (error) {
        console.error("JOIN_ROOM_ERROR:", error.message);
        const status = error.statusCode || 500;
        return errorResponse(res, error.message, status);
    }
}

const leave = async (req, res) => {
    try {
        const result = await roomService.leaveRoom(req.user.id, req.params.id);
        return successResponse(res, "Left room successfully!", result);
    } catch (error) {
        console.error("LEAVE_ROOM_ERROR:", error.message);
        const status = error.statusCode || 500;
        return errorResponse(res, error.message, status);
    }
}

const getMessages = async (req, res) => {
    try {
        const messages = await roomService.getRoomMessages(req.user.id, req.params.id);
        return successResponse(res, "Messages fetched successfully!", messages);
    } catch (error) {
        console.error("GET_ROOM_MESSAGES_ERROR:", error.message);
        const status = error.statusCode || 500;
        return errorResponse(res, error.message, status);
    }
}

const sendMessage = async (req, res) => {
    try {
        const { content } = req.body;
        const roomId = req.params.id;
        const userId = req.user.id;
        
        if (!content) {
            return errorResponse(res, "Content zaroori hai", 400);
        }
        
        const message = await roomService.sendMessage(userId, roomId, content);
        return successResponse(res, "Message send ho gaya!", message, 201);
    } catch (error) {
        console.error("SEND_MESSAGE_ERROR:", error.message);
        const status = error.statusCode || 500;
        return errorResponse(res, error.message, status);
    }
}

module.exports = { create, getAll, join, leave, getMessages, sendMessage };