const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User');

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: '/auth/google/callback',
    scope: ['profile', 'email']
}, async (accessToken, refreshToken, profile, done) => {
    try {
        const userEmail = profile.emails[0].value;

        // 1. Check if user exists by googleId OR by email
        let user = await User.findOne({
            $or: [
                { googleId: profile.id },
                { email: userEmail }
            ]
        });
        
        if (user) {
            // If user exists by email but doesn't have googleId linked yet, link it now
            if (!user.googleId) {
                user.googleId = profile.id;
                await user.save();
            }
            return done(null, user);
        }

        // 2. If user completely doesn't exist, create a brand new one
        user = await User.create({
            googleId: profile.id,
            name: profile.displayName,
            email: userEmail,
            profilePic: profile.photos[0]?.value,
            techStack: []
        });
        
        return done(null, user);
    } catch (error) {
        return done(error, null);
    }
}));

// Serialize user into the session cookies
passport.serializeUser((user, done) => {
    done(null, user.id);
});

// Deserialize user out of the session cookies
passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (error) {
        done(error, null);
    }
});