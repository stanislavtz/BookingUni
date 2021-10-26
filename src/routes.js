const router = require('express').Router();

const homePageController = require('./controllers/homePage');
const usersController = require('./controllers/usersController');
const hotelsController = require('./controllers/hotelsController');

router.use('/', homePageController);
router.use('/users', usersController);
router.use('/hotels', hotelsController);

router.all('*', (req, res) => res.render('home/index'));


module.exports = () => router;