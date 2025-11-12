const passport = require("passport");
const { Strategy: JwtStrategy, ExtractJwt } = require("passport-jwt");
const Credentials = require("../models/credentials");
const TokenJti = require("../models/tokenJti");
const Patient = require("../models/patientSchema");

require("dotenv").config();

const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET
};

// passport.use(
//   new JwtStrategy(opts, async (jwt_payload, done) => {
//     try {
//       console.log("JWT PayLoad:", jwt_payload);
//       const user = await Credentials.findById(jwt_payload.id).populate("user");
//       if (user) return done(null, user);
//       return done(null, false);
//     } catch (err) {
//       return done(err, false);
//     }
//   })
// );
// passport.use(
//   new JwtStrategy(opts, async (jwt_payload, done) => {
//     try {
//       // If payload.id is a Patient ID
//       const user = await Patient.findById(jwt_payload.id);
//       if (user) return done(null, user);

//       // Or if you want to check Credentials by patientId
//       const credentials = await Credentials.findOne({ user: jwt_payload.id }).populate("user");
//       if (credentials) return done(null, credentials);

//       return done(null, false);
//     } catch (err) {
//       return done(err, false);
//     }
//   })
// );

passport.use(
  new JwtStrategy(opts, async (jwt_payload, done) => {
    try {
      // 1. Revocation check
      const tokenDoc = await TokenJti.findOne({ jti: jwt_payload.jti });
      if (tokenDoc) {
        return done(null, false, { message: "Token revoked" });
      }

      // 2. Lookup Credentials by ID
      const credentials = await Credentials.findById(jwt_payload.id).populate("user");
      if (credentials) return done(null, credentials);

      return done(null, false);
    } catch (err) {
      return done(err, false);
    }
  })
);



module.exports = passport;