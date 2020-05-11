'use strict';
const express = require('express');
const router = express.Router();

const db = require('./db');

router.get('/', function (req, res) {
    if (req.session.login) res.render('index', { username: req.session.username, login: true });
    else res.render('index', { login: false });
});

router.get('/contacts', function (req, res) {
    if (req.session.login) {
        let message = req.session.message;
        req.session.message = "";
        req.session.save(() => res.render('contacts', { username: req.session.username, login: true, message: message }));
    } else {
        let message = req.session.message;
        req.session.message = "";
        req.session.save(() => res.render('contacts', { login: false, message: message }));
    }
});

router.post('/contacts', function (req, res) {
    db.feedback(req, res);
});

router.get('/login', function (req, res) {
    if (req.session.login) res.redirect('/profile');
    else {
        let message = req.session.message;
        req.session.message = "";
        req.session.save(() => res.render('login', { message: message }));
    }
});

router.post('/login', function (req, res) {
    db.authentication(req, res);
});

router.get('/logout', function (req, res) {
    if (!req.session.login) res.redirect('/');
    else db.logout(req, res);
});

router.post('/registration', function (req, res) {
    db.registration(req, res);
});

router.get('/verification', function (req, res) {
    db.verification(req, res);
});

router.get('/removeUser', function (req, res) {
    if (!req.session.login) res.redirect('/login');
    else db.removeUser(req, res);
});

router.get('/profile', function (req, res) {
    if (!req.session.login) res.redirect('/login');
    else {
        let message = req.session.message;
        req.session.message = "";
        req.session.save(() => res.render('profile', { username: req.session.username, surname: req.session.surname, email: req.session.email, message: message }));
    }
});

router.get('/passwordRecovery', function (req, res) {
    if (req.session.login) res.redirect('/profile');
    else {
        db.passwordRecoveryStep2(req, res);
    }
});

router.post('/passwordRecovery', function (req, res) {
    db.passwordRecovery(req, res);
});

router.post('/passwordRecoveryStep3', function (req, res) {
    db.passwordRecoveryStep3(req, res);
});

router.post('/changeName', function (req, res) {
    db.changeName(req, res);
});

router.post('/changePassword', function (req, res) {
    db.changePassword(req, res);
});

module.exports = router;
