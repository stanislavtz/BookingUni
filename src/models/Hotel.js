const mongoose = require('mongoose');

const hotelSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [, 'Name is required'],
        unique: true
    },
    city: {
        type: String,
        required: [true, 'City is required']
    },
    imgUrl: {
        type: String,
        required: [true, 'Image url is required']
    },
    freeRooms: {
        type: Number,
        required: [true, 'Number of rooms is required'],
        min: 1,
        max: 100
    },
    clients: [
        {
            type: mongoose.Types.ObjectId,
            ref: 'User'
        }
    ],
    owner: {
        type: mongoose.Types.ObjectId,
        ref: 'User',       
        required: true
    }
});

const Hotel = mongoose.model('Hotel', hotelSchema);

module.exports = Hotel;