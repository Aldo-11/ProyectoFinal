const express = require('express');
const { getWeather } = require('../controllers/weatherController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

//router.get('/weather', authMiddleware, getWeather);
router.get('/weather', getWeather);

module.exports = router;