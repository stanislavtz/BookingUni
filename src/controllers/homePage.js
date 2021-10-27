const router = require('express').Router();
const hotelsService = require('../services/hotelsService');

async function getHomePage(req, res) {
    res.locals.hotels = await hotelsService.getAll();
    res.render('home/index');
}

router.get('/', getHomePage);

module.exports = router;