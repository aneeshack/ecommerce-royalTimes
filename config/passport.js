const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth2').Strategy;
passport.serializeUser((user,done)=>{
    done(null,user);
})

passport.deserializeUser(function(user,done){
    done(null,user);
})

passport.use(new GoogleStrategy({
    clientID:process.env.CLIENT_ID, // .env Credential in here
    clientSecret: process.env.CLIENT_SECRET,
    callbackURL:"http://localhost:5000/user/auth/google/callback",
    passReqToCallback:true,
    passReqToCallback: true,
    accessType: 'offline',
    prompt: 'consent'

},function(request,accessToken, refreshToken, profile, done) {
    if (!profile) {
        return done(new Error('No profile returned from Google'), null);
    }
    console.log('inside passport.use');
    console.log("rocess.env.CLIENT_ID",process.env.CLIENT_ID);
    console.log("rocess.env.CLIENT_ID",process.env.CLIENT_ID);

    console.log('Access Token:', accessToken);
    console.log('Refresh Token:', refreshToken);
    console.log('Profile:', profile);
    console.log('inside passport.use');
    return done(null,profile);
    
}))

// OAuth2Strategy.prototype._createOAuthError = function(message, err) {
//     console.log('OAuth Error:', err);
//     return new OAuth2Strategy.OAuthError(message, err);
//   };