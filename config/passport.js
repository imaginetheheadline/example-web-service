const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const User = require('../models/user');

passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_SECRET,
            callbackURL: process.env.GOOGLE_CALLBACK,
        },
        async function (accessToken, refreshToken, profile, cb) {
            try {
                let user = await User.findOne({ 'googleAuth.id': profile.id });
                if (user) return cb(null, user);
                user = await User.create({
                    name: profile.displayName,
                    googleAuth: {
                        id: profile.id,
                        email: profile.emails[0].value,
                        avatar: profile.photos[0].value,
                        name: profile.displayName,
                    },
                });
                return cb(null, user);
            } catch (e) {
                return cb(e);
            }
        }
    )
);

passport.serializeUser((user, cb) => {
    cb(null, user._id);
});

passport.deserializeUser(async (userId, cb) => {
    cb(null, await User.findById(userId));
});
