const bcrypt = require('bcryptjs');
const prisma = require('../utils/prisma');


const registerUser = async (userData) => {
    const { name, email, password, role } = userData;
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) { 
        const error = new Error("Email already exists");
        error.statusCode = 400;
        throw error;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
        data: {
            name,
            email,
            password: hashedPassword,
            role: role || 'USER',
            status: "PENDING"
        }
    });
    return user;
}

const loginUser = async (userData) => {
    const { email, password } = userData;
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
        const error = new Error("Invalid email or password");
        error.statusCode = 401;
        throw error;
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        const error = new Error("Invalid email or password");
        error.statusCode = 401;
        throw error;
    }
    return user;
}

module.exports = { registerUser, loginUser };