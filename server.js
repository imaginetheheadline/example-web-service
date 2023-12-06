require('dotenv').config();
require('./config/database');
require('./config/passport');

const express = require('express');
const path = require('path');
const expressSession = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(expressSession);
const passport = require('passport');
const app = express();
const PORT = process.env.PORT || 3000;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

const sessionStore = new MongoDBStore({
    uri: process.env.DATABASE_URL,
    collection: 'sessions',
});

sessionStore.on('error', function (error) {
    console.log(error);
});

app.use(
    expressSession({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
        store: sessionStore,
    })
);

app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
    res.locals.user = req.user;
    next();
});

app.get('/', (req, res) => {
    res.render('index');
});

app.get(
    '/auth/google',
    passport.authenticate('google', {
        scope: ['profile', 'email'],
        prompt: 'select_account',
    })
);

app.get(
    '/oauth2callback',
    passport.authenticate('google', {
        successRedirect: '/',
        failureRedirect: '/',
    })
);

app.get('/logout', (req, res) => {
    req.logout(() => res.redirect('/'));
});

app.listen(PORT, () => {
    console.info(`Listening on ${PORT}`);
});
