const { checkSchema } = require("express-validator");

const validateUpdateDoctor = checkSchema({
  name: {
    in: ["body"],
    notEmpty: { errorMessage: "Name is required" },
    isString: { errorMessage: "Name must be a string" },
    isLength: {
      options: { min: 3, max: 50 },
      errorMessage: "Name must be between 3 and 50 characters",
    },
    trim: true,
  },
  specialty: {
    in: ["body"],
    notEmpty: { errorMessage: "Specialty is required" },
    isIn: {
      options: [
        [
          "Cardiology",
          "Dermatology",
          "Neurology",
          "Orthopedics",
          "Pediatrics",
          "General Medicine",
        ],
      ],
      errorMessage: "Invalid specialty",
    },
  },
  email: {
    in: ["body"],
    optional: true,
    isEmail: { errorMessage: "Email must be valid" },
    matches: {
      options: /^[a-zA-Z0-9._%+-]+@doctor\.com$/,
      errorMessage: "Email must be in the format name@doctor.com",
    },
    trim: true,
  },
  registrationNumber: {
    in: ["body"],
    optional: true,
    matches: {
      options: /^[A-Z0-9]{6,12}$/,
      errorMessage:
        "Registration number must be 6–12 characters, alphanumeric uppercase",
    },
    trim: true,
  },
  registrationValidUpto: {
    in: ["body"],
    optional: true,
    isISO8601: { errorMessage: "registrationValidUpto must be a valid date" },
    toDate: true,
  },
});

module.exports = validateUpdateDoctor;
