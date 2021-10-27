const { jwtVerify } = require('../utils/jwtUtil');
const { COOKIE_NAME, JWT_SECRET } = require('../utils/constants');
const hotelsService = require('../services/hotelsService');

exports.auth = () => async function (req, res, next) {
    const token = req.cookies[COOKIE_NAME];
    if (!token) {
        return next();
    }

    try {
        const decoded = await jwtVerify(token, JWT_SECRET);
        req.user = decoded;
        res.locals.user = decoded;
        next();
    } catch (error) {
        res.locals.error = error;
        res.render('home');
    }
}

exports.isGuest = function (req, res, next) {
    if (!req.user) {
        return next();
    }

    res.locals.error = { message: 'You are logged in' }
    res.status(401).render('home');
}

exports.isAuthenticated = function (req, res, next) {
    if (req.user) {
        return next();
    }

    res.locals.error = { message: 'You are not authenticated' }
    res.redirect('/users/login');
}

exports.isAuthorized = async function (req, res, next) {
    const hotel = await hotelsService.getOne(req.params.hotelId);
    
    if(req.user._id == hotel.owner) {
        return next();
    }

    res.locals.error = { message: 'You are not authorized' }
    res.redirect('/');
}