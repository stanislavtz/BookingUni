const bcrypt = require('bcrypt');

const User = require('../models/User');

const { JWT_SECRET } = require('../utils/constants');
const { jwtSign } = require('../utils/jwtUtil');

function register(data) {
    const { email, username, password, rePassword } = data;

    if (password !== rePassword) {
        throw { message: 'Password don\'t match' }
    }

    return User.create({ email, username, password });
}

async function login(data) {
    const { email, password } = data;
    if (!email) {
        throw { message: 'Email is required' }
    }

    if (!password) {
        throw { message: 'Password is required' }
    }

    const user = await User.findOne({ email });
    if (!user) {
        throw { message: 'Invalid email or password' }
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
        throw { message: 'Invalid email or password' }
    }

    const token = jwtSign({ _id: user._id, username: user.username, email }, JWT_SECRET, { expiresIn: '1d' });

    return token;
}

module.exports = {
    register,
    login
}