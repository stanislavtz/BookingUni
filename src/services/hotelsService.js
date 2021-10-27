const Hotel = require('../models/Hotel');

const create = (data) => Hotel.create(data);
const getAll = () => Hotel.find({}).sort({ 'freeRooms': -1 }).lean();
const getOne = (id) => Hotel.findById(id).populate('clients').lean();
const update = (id, hotel) => Hotel.findByIdAndUpdate(id, hotel, { runValidators: true });
const deleteOne = (id) => Hotel.findByIdAndDelete(id);

module.exports = {
    create,
    getAll,
    getOne,
    update,
    deleteOne
}