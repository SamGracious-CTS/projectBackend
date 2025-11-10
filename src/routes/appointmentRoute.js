const express = require('express');
const router = express.Router();
const { bookAppointment } = require('../controllers/appointmentController');
const bookingSchema = require('../validators/bookingSchema');
const { validationResult } = require('express-validator');
const validateRequest = require('../middleware/validateRequest');

router.post('/bookAppointment', bookingSchema, validateRequest, bookAppointment);

module.exports = router;
