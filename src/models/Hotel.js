const mongoose = require('mongoose');

const hotelSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [, 'Name is required'],
        unique: true,
        min: [4, 'Name should be at least 4 characters']
    },
    city: {
        type: String,
        required: [true, 'City is required'],
        min: [3, 'City should be at least 4 characters']
    },
    imgUrl: {
        type: String,
        required: [true, 'Image url is required'],
        validate: [/https?/, 'Image url should start with http or https']
    },
    freeRooms: {
        type: Number,
        required: [true, 'Number of rooms is required'],
        min: 0,
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