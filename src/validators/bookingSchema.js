const { checkSchema } = require('express-validator');

const bookingSchema = checkSchema({
    registrationNumber: {
    in: ['body'],
    notEmpty: { errorMessage: 'Registration number is required' },
    matches: {
      options: /^[A-Z0-9]{6,12}$/,
      errorMessage: 'Registration number must be 6–12 characters, alphanumeric uppercase'
    },
    trim: true
  },
  patientId: {
    in: ['body'],
    notEmpty: { errorMessage: 'Patient ID is required' },
    isMongoId: { errorMessage: 'Invalid patientId format' }
  },
  date: {
    in: ['body'],
    notEmpty: { errorMessage: 'Date is required' },
    custom: {
      options: value => {
        const regex = /^\d{4}-\d{2}-\d{2}$/;
        if (!regex.test(value)) {
          throw new Error('Date must be in YYYY-MM-DD format');
        }
        const inputDate = new Date(value);
        const today = new Date();
        today.setHours(0, 0, 0, 0); // normalize to midnight
        if (inputDate < today) {
          throw new Error('Date must be today or in the future');
        }
        return true;
      }
    }
  },
  startTime: {
    in: ['body'],
    notEmpty: { errorMessage: 'Start time is required' },
    custom: {
      options: value => {
        const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;
        if (!timeRegex.test(value)) {
          throw new Error('Start time must be in HH:mm format');
        }
        return true;
      }
    }
  },
  endTime: {
    in: ['body'],
    notEmpty: { errorMessage: 'End time is required' },
    custom: {
      options: (value, { req }) => {
        const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;
        if (!timeRegex.test(value)) {
          throw new Error('End time must be in HH:mm format');
        }
        const [startH, startM] = req.body.startTime.split(':').map(Number);
        const [endH, endM] = value.split(':').map(Number);
        const startTotal = startH * 60 + startM;
        const endTotal = endH * 60 + endM;
        if (endTotal <= startTotal) {
          throw new Error('End time must be after start time');
        }
        return true;
      }
    }
  }
});

module.exports = bookingSchema;
