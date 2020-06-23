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
        req.session.save(() => db.profileDB(req, res, message));
    }
});

router.get('/passwordRecovery', function (req, res) {
    if (req.session.login) res.redirect('/profile');
    else db.passwordRecoveryStep2(req, res);
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

router.get('/admin', function (req, res) {
    if (!req.session.admin) res.redirect('/');
    else res.render('admin', { username: req.session.username });
});

router.get('/admin/users', function (req, res) {
    if (!req.session.admin) res.redirect('/');
    else db.outputDB(req, res, 'users');
});

router.get('/admin/regUsers', function (req, res) {
    if (!req.session.admin) res.redirect('/');
    else db.outputDB(req, res, 'regUsers');
});

router.get('/admin/messages', function (req, res) {
    if (!req.session.admin) res.redirect('/');
    else db.outputDB(req, res, 'messages');
});

router.get('/admin/statistics', function (req, res) {
    if (!req.session.admin) res.redirect('/');
    else db.outputDB(req, res, 'statistics');
});

router.get('/marvel', function (req, res) {
    res.render('marvelIndex');
});

router.get('/marvel/films', function (req, res) {
    db.marvelFilmsDB(req, res);
});

module.exports = router;
