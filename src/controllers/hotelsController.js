const router = require('express').Router();
const {isAuthenticated} = require('../middlewares/authMiddleware');
const hotelsService = require('../services/hotelsService');

function getCreateHotelPage(req, res) {
    res.render('booking/create');
}

async function createHotel(req, res) {
    try {
        const data = Object.assign(req.body, {owner: req.user._id});
        await hotelsService.create(data);
        res.redirect('/');
    } catch (error) {
        res.locals.error = error;
        res.render('booking/create', { ...req.body });
    }
}

router.get('/create', isAuthenticated, getCreateHotelPage);
router.post('/create', createHotel);

module.exports = router;