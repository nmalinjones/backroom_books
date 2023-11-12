require('dotenv').config();
const express = require('express');
const app = require('express')();
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const port = process.env.PORT || 4000;
const flash = require('connect-flash');
const session = require('express-session')
const router = require('./src/routes')

app.use(session({
    cookie: { maxAge: 60000 },
    secret: 'woot',
    resave: false,
    saveUninitialized: false
}));

app.use(flash());

app.use(function(req, res, next) {
    res.locals.error_messages = req.flash('error_messages');
    next();
});

//For Parsing the HTML Files
app.set("view engine", "jade")
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cookieParser())
app.use(express.static('public'));

app.get('/', (req, res) => {
    res.render('login', {})
})

app.use('/', router);

module.exports = app