const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const prisma = require('../utils/prisma');
const { errorResponse, successResponse } = require('../utils/apiResponse');
const { userResource } = require('../resources/userResource');
const authService = require('../services/authService');
// ----------------------------------------------------------------------------------------------


const register = async (req, res) => {
    try {
        const user = await authService.registerUser(req.body);
        const responseData = userResource(user);
        return successResponse(res, "Registration successful!", responseData, 201);
    } catch (error) {
        console.error("REGISTER_ERROR:", error.message);
        const status = error.statusCode || 500;
        return errorResponse(res, error.message, status);
    }
};

const login = async (req, res) => {
    try {
        const user = await authService.loginUser(req.body);
        const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '4h' });
        const responseData = { ...userResource(user), token };
        return successResponse(res, "Login successful!", responseData);
    } catch (error) {
        console.error("LOGIN_ERROR:", error.message);
        const status = error.statusCode || 500;
        return errorResponse(res, error.message, status);
    }
}

module.exports = { register, login };