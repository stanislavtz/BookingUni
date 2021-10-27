const router = require('express').Router();

const usersService = require('../services/usersService');
const { COOKIE_NAME } = require('../utils/constants');
const { isGuest, isAuthenticated } = require('../middlewares/authMiddleware');

function getRegisterPage(req, res) {
    res.render('users/register');
}

function getLoginPage(req, res) {
    res.render('users/login');
}

async function registerUser(req, res) {
    try {
        await usersService.register(req.body);
        await loginUser(req, res)
    } catch (error) {
        if (error.message.includes('E11000')) {
            res.locals.error = { message: `User already exist` }
        } else {
            res.locals.error = error.errors ? Object.values(error.errors)[0] : error;
        }

        res.render('users/register', { ...req.body });
    }
}

async function loginUser(req, res) {
    try {
        const token = await usersService.login(req.body);
        res.cookie(COOKIE_NAME, token, {
            httpOnly: true
        });
        res.redirect('/');
    } catch (error) {
        console.log(error)
        res.locals.error = error;
        res.render('users/login', { ...req.body });
    }
}

function logOutUser(req, res) {
    res.clearCookie(COOKIE_NAME).redirect('/');
}

async function getUserProfilePage(req, res) {
    const user = await usersService.getOne(req.user._id);
    const reservations = user.bookedHotels.map(h => h.name).join(', ');
    
    res.render('users/profile', { ...user, reservations });
}

router.get('/register', isGuest, getRegisterPage);
router.post('/register', isGuest, registerUser);

router.get('/login', isGuest, getLoginPage);
router.post('/login', isGuest, loginUser);

router.get('/:userId/profile', getUserProfilePage);

router.get('/logout', isAuthenticated, logOutUser);

module.exports = router;