const router = require('express').Router();
const {isAuthenticated} = require('../middlewares/authMiddleware');

function getCreateHotelPage(req, res) {
    res.render('booking/create');
}

async function createHotel(req, res) {
    try {
        await 'Create bookingsService';
    } catch (error) {
        res.locals.error = error;
        res.render('booking/create', { ...req.body });
    }
}

router.get('/create', isAuthenticated, getCreateHotelPage);
router.post('/create', createHotel)

module.exports = router;