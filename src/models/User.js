const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const { SALT_ROUNDS } = require('../utils/constants');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, 'Name is required'],
        unique: true
    },
    username: {
        type: String,
        required: [true, 'Username is required'],
        unique: true
    },
    password: {
        type: String,
        required: [true, 'Password is required']
    },
    bookedHotels: [
        {
            type: mongoose.Types.ObjectId,
            ref: 'Hotel'
        }
    ],
    offeredHotels: [
            {
                type: mongoose.Types.ObjectId,
                ref: 'Hotel'
            }
    ]
}, {timestamps: true});

userSchema.pre('save', async function (next) {
    try {
        const hash = await bcrypt.hash(this.password, SALT_ROUNDS);
        this.password = hash;
        next();
    } catch (err) {
        throw { message: 'Unsuccessful user register' }
    }
});

const User = mongoose.model('User', userSchema);

module.exports = User;