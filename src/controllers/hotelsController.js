const router = require('express').Router();
const { isAuthenticated, isAuthorized } = require('../middlewares/authMiddleware');
const hotelsService = require('../services/hotelsService');
const usersService = require('../services/usersService');

function getCreateHotelPage(req, res) {
    res.render('booking/create');
}

async function createHotel(req, res) {
    try {
        const data = Object.assign(req.body, { owner: req.user._id });
        await hotelsService.create(data);
        res.redirect('/');
    } catch (error) {
        res.locals.error = error;
        res.render('booking/create', { ...req.body });
    }
}

async function getHotelDetailsPage(req, res) {
    try {
        const hotel = await hotelsService.getOne(req.params.hotelId);
        if (!hotel) {
            throw { message: 'Hotel is not available anymore' }
        }

        if (hotel.owner == req.user._id) {
            res.locals.isOwner = true;
        }

        const clients = hotel.clients.map(cl => cl.username);
        if (clients.includes(req.user.username)) {
            res.locals.user.isClient = true;
        }

        res.render('booking/details', { hotel });
    } catch (error) {
        console.error(error);
    }
}

async function getEditHotelPage(req, res) {
    const hotel = await hotelsService.getOne(req.params.hotelId);
    if (!hotel) {
        throw { message: 'Hotel is not available anymore' }
    }

    res.render('booking/edit', { ...hotel });
}

async function editHotel(req, res) {
    try {
        await hotelsService.update(req.params.hotelId, req.body);
        res.redirect(`/`);
    } catch (error) {
        console.error(error);
        res.redirect(`/`);
    }
}

async function deleteHotel(req, res) {
    await hotelsService.deleteOne(req.params.hotelId);
    res.redirect('/')
}

async function bookHotel(req, res) {
    try {
        const hotel = await hotelsService.getOne(req.params.hotelId);
        const user = await usersService.getOne(req.user._id);
        const clients = hotel.clients.map(cl => cl.username);

        if(!clients.includes(req.user.username)){
            if (hotel.freeRooms == 0) {
                throw { message: 'There is no free room at the moment' }
            }

            hotel.freeRooms -= 1;
            hotel.clients.push(req.user._id);
            user.bookedHotels.push(hotel._id);

            await hotelsService.update(hotel._id, hotel);
            await usersService.update(user._id, user);
        } else {
            res.locals.user.isClient = true;
        }

        res.redirect('/');
    } catch (error) {
        console.error(error);
        res.redirect('/');
    }
}

router.get('/create', isAuthenticated, getCreateHotelPage);
router.post('/create', isAuthenticated, createHotel);

router.get('/:hotelId/edit', isAuthenticated, isAuthorized, getEditHotelPage);
router.post('/:hotelId/edit', isAuthenticated, isAuthorized, editHotel);

router.get('/:hotelId/details', isAuthenticated, getHotelDetailsPage);

router.get('/:hotelId/delete', isAuthenticated, isAuthorized, deleteHotel);

router.get('/:hotelId/book', isAuthenticated, bookHotel);

module.exports = router;