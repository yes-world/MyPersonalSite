'use strict';
const MongoClient = require('mongodb').MongoClient;
const crypto = require('crypto');
const nodemailer = require('nodemailer');

async function sendEmail(to, subject, message) {
    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'sabitov.yesworld@gmail.com',
            pass: '561202001Sa'
        }
    });

    await transporter.sendMail({
        from: '"Дамир Сабитов" <sabitov.yesworld@gmail.com>',
        to: to,
        subject: subject,
        html: message
    });
}

function sha256(data) {
    return crypto.createHash("sha256").update(data).digest("hex");
}

const mongoClient = new MongoClient("mongodb://localhost:27017/", { useUnifiedTopology: true });
let dbclient;

mongoClient.connect(function (err, client) {
    if (err) console.log(err);
    dbclient = client;
});

function authentication(req, res) {
    let email = req.body.email.trim().toLowerCase();
    const db = dbclient.db('usersdb');
    const collection = db.collection('users');
    collection.find({ email: email }).toArray(function (err, results) {
        if (err) return console.log(err);
        if (!results.length) {
            req.session.message = "Неверный логин или пароль.";
            req.session.save(() => res.redirect('/login'));
        }
        else {
            if (results[0].hashpass != sha256(req.body.password)) {
                req.session.message = "Неверный логин или пароль.";
                req.session.save(() => res.redirect('/login'));
            } else {
                req.session.login = true;
                req.session.username = results[0].name;
                req.session.surname = results[0].surname;
                req.session.email = results[0].email;
                req.session.admin = results[0].admin;
                let now = new Date();
                let statData = { date: now.toString(), user: results[0].name + ' ' + results[0].surname, email: results[0].email, operation: "input" };
                const statCollection = db.collection('statistics');
                statCollection.insertOne(statData, function (err, result) {
                    if (err) return console.log(err);
                    req.session.save(() => res.redirect('/profile'));
                });
            }
        }
    });
}

function registration(req, res) {
    let name = req.body.name.trim();
    let surname = req.body.surname.trim();
    let email = req.body.email.trim().toLowerCase();
    let hashpass = sha256(req.body.password);
    let hashemail = sha256(email);
    let user = { name: name, surname: surname, email: email, hashpass: hashpass, admin: false, hashemail: hashemail };
    const db = dbclient.db('usersdb');
    const oldcollection = db.collection('users');
    oldcollection.find({ email: email }).toArray(function (err, results) {
        if (err) return console.log(err);
        if (results.length > 0) {
            req.session.message = "Пользователь с таким email уже существует.";
            req.session.save(() => res.redirect('/login'));
        } else {
            const collection = db.collection('regUsers');
            collection.find({ email: email }).toArray(function (err, results) {
                if (err) return console.log(err);
                if (results.length > 0) {
                    collection.deleteOne({ email: email }, function (err, result) {
                        if (err) return console.log(err);
                        collection.insertOne(user, function (err, result) {
                            if (err) return console.log(err);
                            sendEmail(email, "Подтверждение email", '<html style="font-family: sans-serif;"><body style="margin: 0; font-size: x-large;"><div style="width: 100%; height: 3rem; background-color: #910083; color: white; padding-left: 3rem; padding-top: 1.25rem;"><div>yes.world</div></div><div style="margin-top: 3rem; margin-left: 3rem;"><p>Для подтверждения email адреса перейдите по ссылке:</p><p><a href="http://318041-co06405.tmweb.ru/verification?property1=' + hashemail + '&property2=' + hashpass + '" target="_blank">Подтвердить email</a></p><p style="font-size: small;">Если вы не регистрировались на этом сайте, просто проигнорируйте это письмо.</p><p style="font-size: small;">Письмо было созданно автоматически, пожалуйста не отвечайте на него.</p></div></body></html>').catch(console.error);
                            req.session.message = "На указанный электронный адрес отправлено письмо с подтверждением. Перейдите по ссылке в письме, чтобы войти в профиль.";
                            req.session.save(() => res.redirect('/login'));
                        });
                    });
                } else {
                    collection.insertOne(user, function (err, result) {
                        if (err) return console.log(err);
                        sendEmail(email, "Подтверждение email", '<html style="font-family: sans-serif;"><body style="margin: 0; font-size: x-large;"><div style="width: 100%; height: 3rem; background-color: #910083; color: white; padding-left: 3rem; padding-top: 1.25rem;"><div>yes.world</div></div><div style="margin-top: 3rem; margin-left: 3rem;"><p>Для подтверждения email адреса перейдите по ссылке:</p><p><a href="http://318041-co06405.tmweb.ru/verification?property1=' + hashemail + '&property2=' + hashpass + '" target="_blank">Подтвердить email</a></p><p style="font-size: small;">Если вы не регистрировались на этом сайте, просто проигнорируйте это письмо.</p><p style="font-size: small;">Письмо было созданно автоматически, пожалуйста не отвечайте на него.</p></div></body></html>').catch(console.error);
                        req.session.message = "На указанный электронный адрес отправлено письмо с подтверждением. Перейдите по ссылке в письме, чтобы войти в профиль.";
                        req.session.save(() => res.redirect('/login'));
                    });
                }
            });
        }
    });
}

function verification(req, res) {
    let hashemail = req.query.property1;
    let hashpass = req.query.property2;
    const db = dbclient.db('usersdb');
    const collection = db.collection('regUsers');
    collection.find({ hashemail: hashemail }).toArray(function (err, results) {
        if (err) return console.log(err);
        if (!results.length) {
            req.session.message = "Ссылка повреждена.";
            req.session.save(() => res.redirect('/login'));
        } else {
            if (results[0].hashpass != hashpass) {
                req.session.message = "Ссылка повреждена.";
                req.session.save(() => res.redirect('/login'));
            } else {
                let user = { name: results[0].name, surname: results[0].surname, email: results[0].email, hashpass: results[0].hashpass, admin: results[0].admin };
                collection.deleteOne({ hashemail: hashemail }, function (err, result) {
                    if (err) return console.log(err);
                    const newcollection = db.collection('users');
                    newcollection.insertOne(user, function (err, result) {
                        if (err) return console.log(err);
                        req.session.login = true;
                        req.session.username = user.name;
                        req.session.surname = user.surname;
                        req.session.email = user.email;
                        req.session.admin = user.admin;
                        req.session.message = "Email подтвержден."
                        req.session.save(() => res.redirect('/profile'));
                    });
                });
            }
        }
    });
}

function removeUser(req, res) {
    const db = dbclient.db('usersdb');
    const collection = db.collection('users');
    collection.deleteOne({ email: req.session.email }, function (err, result) {
        if (err) return console.log(err);
        res.redirect('/logout');
    });
}

function passwordRecovery(req, res) {
    let email = req.body.email.trim().toLowerCase();
    const db = dbclient.db('usersdb');
    const collection = db.collection('users');
    collection.find({ email: email }).toArray(function (err, results) {
        if (err) return console.log(err);
        if (!results.length) {
            req.session.message = "Пользователя с таким email не существует.";
            req.session.save(() => res.redirect('/login'));
        }
        else {
            sendEmail(email, "Восстановление пароля", '<html style="font-family: sans-serif;"><body style="margin: 0; font-size: x-large;"><div style="width: 100%; height: 3rem; background-color: #910083; color: white; padding-left: 3rem; padding-top: 1.25rem;"><div>yes.world</div></div><div style="margin-top: 3rem; margin-left: 3rem;"><p>Для восстановления пароля перейдите по ссылке:</p><p><a href="http://318041-co06405.tmweb.ru/passwordRecovery?property1=' + results[0].hashpass + '&property2=' + sha256(email) + '" target="_blank">Восстановить пароль</a></p><p style="font-size: small;">Если вы не регистрировались на этом сайте, просто проигнорируйте это письмо.</p><p style="font-size: small;">Письмо было созданно автоматически, пожалуйста не отвечайте на него.</p></div></body></html>').catch(console.error);
            req.session.message = "На указанный электронный адрес выслано письмо с ссылкой на восстановление пароля.";
            req.session.save(() => res.redirect('/login'));
        }
    });
}

function passwordRecoveryStep2(req, res) {
    let hashpass = req.query.property1;
    let hashemail = req.query.property2;
    const db = dbclient.db('usersdb');
    const collection = db.collection('users');
    collection.find({ hashpass: hashpass }).toArray(function (err, results) {
        if (err) return console.log(err);
        if (!results.length) {
            req.session.message = "Ссылка повреждена.";
            req.session.save(() => res.redirect('/login'));
        } else {
            if (sha256(results[0].email) != hashemail) {
                req.session.message = "Ссылка повреждена.";
                req.session.save(() => res.redirect('/login'));
            } else {
                res.render('passRec', { email: results[0].email });
            }
        }
    });
}

function passwordRecoveryStep3(req, res) {
    let email = req.body.email;
    let hashpass = sha256(req.body.password);
    const db = dbclient.db('usersdb');
    const collection = db.collection('users');
    collection.updateOne({ email: email }, { $set: { hashpass: hashpass } }, function (err, result) {
        if (err) return console.log(err);
        req.session.message = "Пароль успешно изменён.";
        req.session.save(() => res.redirect('/login'));
    });
}

function changeName(req, res) {
    let name = req.body.name.trim();
    let surname = req.body.surname.trim();
    const db = dbclient.db('usersdb');
    const collection = db.collection('users');
    collection.updateOne({ email: req.session.email }, { $set: { name: name } }, function (err, result) {
        if (err) return console.log(err);
        collection.updateOne({ email: req.session.email }, { $set: { surname: surname } }, function (err, result) {
            if (err) return console.log(err);
            req.session.username = name;
            req.session.surname = surname;
            req.session.message = "Изменения успешны.";
            req.session.save(() => res.redirect('/profile'));
        });
    });
}

function changePassword(req, res) {
    let hashpass = sha256(req.body.oldpass);
    let newHashpass = sha256(req.body.newpass);
    const db = dbclient.db('usersdb');
    const collection = db.collection('users');
    collection.find({ email: req.session.email }).toArray(function (err, results) {
        if (err) return console.log(err);
        if (results[0].hashpass != hashpass) {
            req.session.message = "Неверно был введён старый пароль. Изменения не приняты.";
            req.session.save(() => res.redirect('/profile'));
        } else {
            collection.updateOne({ email: req.session.email }, { $set: { hashpass: newHashpass } }, function (err, result) {
                if (err) return console.log(err);
                req.session.message = "Пароль успешно изменён.";
                req.session.save(() => res.redirect('/profile'));
            });
        }
    });
}

function feedback(req, res) {
    let now = new Date();
    let message = { date: now.toString(), author: req.session.username + ' ' + req.session.surname, email: req.session.email, subject: req.body.subject, message: req.body.message };
    const db = dbclient.db('usersdb');
    const collection = db.collection('messages');
    collection.insertOne(message, function (err, result) {
        if (err) return console.log(err);
        sendEmail('d.sabitov@mail.ru', "Получена обратная связь", '<html style="font-family: sans-serif;"><body style="margin: 0; font-size: x-large;"><div style="width: 100%; height: 3rem; background-color: #910083; color: white; padding-left: 3rem; padding-top: 1.25rem;"><div>yes.world</div></div><div style="margin-top: 3rem; margin-left: 3rem;"><p>' + message.date + '</p><p>' + message.author + '</p><p>' + message.email + '</p><p>' + message.subject + '</p><p>' + message.message + '</p></div></body></html>').catch(console.error);
        req.session.message = "Сообщение отправлено. Постараемся ответить вам как можно скорее."
        req.session.save(() => res.redirect('/contacts'));
    });
}

function logout(req, res) {
    let now = new Date();
    let statData = { date: now.toString(), user: req.session.username + ' ' + req.session.surname, email: req.session.email, operation: "output" };
    const db = dbclient.db('usersdb');
    const statCollection = db.collection('statistics');
    statCollection.insertOne(statData, function (err, result) {
        if (err) return console.log(err);
        res.clearCookie('connect.sid', { path: '/' });
        req.session.destroy(() => res.redirect('/'));
    });
}

exports.authentication = authentication;
exports.registration = registration;
exports.verification = verification;
exports.removeUser = removeUser;
exports.passwordRecovery = passwordRecovery;
exports.passwordRecoveryStep2 = passwordRecoveryStep2;
exports.passwordRecoveryStep3 = passwordRecoveryStep3;
exports.changeName = changeName;
exports.changePassword = changePassword;
exports.feedback = feedback;
exports.logout = logout;
