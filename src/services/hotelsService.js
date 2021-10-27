const Hotel = require('../models/Hotel');

const getAll = () => Hotel.find({}).sort({ 'freeRooms': -1 }).lean();
const create = (data) => Hotel.create(data);


module.exports = {
    getAll,
    create
}