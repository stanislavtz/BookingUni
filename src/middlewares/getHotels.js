const hotelsService = require('../services/hotelsService');

exports.getAllOffers = () => async function (req, res, next) {
    try {
        const hotels = await hotelsService.getAll();
        res.locals.hotels = hotels;
        next();
    } catch (error) {
        console.error(error);
    }
}