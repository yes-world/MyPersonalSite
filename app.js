'use strict';
const debug = require('debug');
const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const session = require('express-session');
const FileStore = require('session-file-store')(session);

const routes = require('./routes/index');

const app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(
    session({
        cookie: {
            maxAge: 12 * 60 * 60 * 1000,
            httpOnly: true
        },
        store: new FileStore(),
        secret: 'ThisIsMyPersonalSite',
        resave: false,
        saveUninitialized: false
    })
);

app.use('/', routes);

app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    if (req.session.login) res.render('error', { username: req.session.username, message: err.message, error: err, login: true });
    else res.render('error', { message: err.message, error: err, login: false });
});

app.set('port', process.env.PORT || 80);

const server = app.listen(app.get('port'), function () {
    debug('Express server listening on port ' + server.address().port);
});
