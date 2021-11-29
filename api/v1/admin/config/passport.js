//import npm package
const
    JwtStrategy = require('passport-jwt').Strategy,
    ExtractJwt = require('passport-jwt').ExtractJwt;

//import function
import config from '../../../config/config';

var opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = config.secretOrKey;

//import model
import Admin from '../Model/admin';
import User from '../../../models/User'
export const usersAuth = (passport) => {
    passport.use("usersAuth",
        new JwtStrategy(opts, async function (jwt_payload, done) {            
            User.findById(jwt_payload._id, function (err, user) {
                if (err) { return done(err, false) }
                else if (user) {
                    let data = {
                        id: user._id,
                        name: user.name,
                    }
                    return done(null, data);
                }
                return done(null, false)
            })
        })
    )
}

export const adminAuth = (passport) => {
    console.log("check authorized")
              
    passport.use("adminAuth",
        new JwtStrategy(opts, async function (jwt_payload, done) {   
            console.log("check authorized2",opts,jwt_payload)
           
            Admin.findById(jwt_payload._id, function (err, user) {
                if (err) { return done(err, false) }
                else if (user) {
                    console.log("check authorized",jwt_payload._id)
              
                    let data = {
                        id: user._id,
                        name: user.name,
                    }
                    return done(null, data);
                }
                console.log("check authorized",jwt_payload._id)
              
                return done(null, false)
            })
        })
    )
}