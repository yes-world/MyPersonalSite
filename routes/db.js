'use strict';
const MongoClient = require('mongodb').MongoClient;
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const fs = require('fs');
const fb2 = require('./fb2Meta');
const fb2Content = require('./fb2Content');

async function sendEmail(to, subject, text, message) {
    let transporter = nodemailer.createTransport({
        host: 'smtp.mail.ru',
        port: 465,
        secure: true,
        auth: {
            user: 'sabitov.yesworld@mail.ru',
            pass: '561202001Sa'
        }
    });

    await transporter.sendMail({
        from: '"Дамир Сабитов" <sabitov.yesworld@mail.ru>',
        to: to,
        subject: subject,
        text: text,
        html: message
    });
}

function sha256(data) {
    return crypto.createHash("sha256").update(data).digest("hex");
}

function nowTime() {
    function addZero(number) {
        let stNum = "";
        if (number < 10) {
            stNum += 0;
            stNum += number;
        } else {
            stNum += number;
        }
        return stNum;
    }
    let date = new Date();
    date.setHours(date.getHours() + 3);
    let x1 = addZero(date.getUTCDate());
    let x2 = addZero(date.getUTCMonth() + 1);
    let x3 = addZero(date.getUTCFullYear());
    let x4 = addZero(date.getUTCHours());
    let x5 = addZero(date.getUTCMinutes());
    let res = x1 + '.' + x2 + '.' + x3 + ' ' + x4 + ':' + x5 + ' МСК';
    return res;
}

const mongoClient = new MongoClient("mongodb://localhost:27017/", { useUnifiedTopology: true });
let dbclient;
mongoClient.connect(function (err, client) {
    if (err) console.log(err);
    dbclient = client;
});

function authentication(req, res) {
    let email = req.body.email.trim().toLowerCase();
    let page = req.session.pageToLogin;
    const db = dbclient.db('usersdb');
    const collection = db.collection('users');
    collection.find({ email: email }).toArray(function (err, results) {
        if (err) return console.log(err);
        if (!results.length) {
            req.session.message = "Неверный логин или пароль.";
            req.session.save(() => res.redirect('/login?page=' + page));
        }
        else {
            if (results[0].hashpass != sha256(req.body.password)) {
                req.session.message = "Неверный логин или пароль.";
                req.session.save(() => res.redirect('/login?page=' + page));
            } else {
                req.session.pageToLogin = '';
                req.session.login = true;
                req.session.username = results[0].name;
                req.session.surname = results[0].surname;
                req.session.email = results[0].email;
                req.session.admin = results[0].admin;
                let statData = { date: nowTime(), user: results[0].name + ' ' + results[0].surname, email: results[0].email, operation: "input" };
                const statCollection = db.collection('statistics');
                statCollection.insertOne(statData, function (err, result) {
                    if (err) return console.log(err);
                    req.session.save(() => {
                        if (page) res.redirect(decodeURIComponent(page));
                        else res.redirect('/profile');
                    });
                });
            }
        }
    });
}

function registration(req, res) {
    let name = req.body.name.trim();
    let surname = req.body.surname.trim();
    let email = req.body.email.trim().toLowerCase();
    let hashemail = sha256(email);
    let hashpass = sha256(req.body.password);
    let key = sha256(((new Date()).getTime()).toString());
    let user = { name: name, surname: surname, email: email, hashemail: hashemail, hashpass: hashpass, key: key, admin: false  };
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
                            sendEmail(email, "Подтверждение email", 'yes.world\n\nДля подтверждения email адреса перейдите по ссылке:\n\nhttp://yes-world.ru/verification?property1=' + hashemail + '&property2=' + key + '\n\nЕсли вы не регистрировались на этом сайте, просто проигнорируйте это письмо.\n\nЭто письмо было созданно автоматически. Пожалуйста, не отвечайте на него.', '<html style="font-family: sans-serif;"><body style="margin: 0; font-size: x-large;"><div style="width: 100%; height: 3rem; background-color: #910083; color: white; padding-left: 3rem; padding-top: 1.25rem;"><div>yes.world</div></div><div style="margin-top: 3rem; margin-left: 3rem; margin-right: 3rem; margin-bottom: 3rem;"><p>Для подтверждения email адреса перейдите по ссылке:</p><p><a href="http://yes-world.ru/verification?property1=' + hashemail + '&property2=' + key + '" target="_blank">Подтвердить email</a></p><p style="font-size: small;">Если вы не регистрировались на этом сайте, просто проигнорируйте это письмо.</p><p style="font-size: small;">Это письмо было созданно автоматически. Пожалуйста, не отвечайте на него.</p></div></body></html>').catch(console.error);
                            req.session.message = "На " + email + " было отправлено письмо с подтверждением. Перейдите по ссылке в письме, чтобы войти в профиль.";
                            req.session.save(() => res.redirect('/login'));
                        });
                    });
                } else {
                    collection.insertOne(user, function (err, result) {
                        if (err) return console.log(err);
                        sendEmail(email, "Подтверждение email", 'yes.world\n\nДля подтверждения email адреса перейдите по ссылке:\n\nhttp://yes-world.ru/verification?property1=' + hashemail + '&property2=' + key + '\n\nЕсли вы не регистрировались на этом сайте, просто проигнорируйте это письмо.\n\nЭто письмо было созданно автоматически. Пожалуйста, не отвечайте на него.', '<html style="font-family: sans-serif;"><body style="margin: 0; font-size: x-large;"><div style="width: 100%; height: 3rem; background-color: #910083; color: white; padding-left: 3rem; padding-top: 1.25rem;"><div>yes.world</div></div><div style="margin-top: 3rem; margin-left: 3rem; margin-right: 3rem; margin-bottom: 3rem;"><p>Для подтверждения email адреса перейдите по ссылке:</p><p><a href="http://yes-world.ru/verification?property1=' + hashemail + '&property2=' + key + '" target="_blank">Подтвердить email</a></p><p style="font-size: small;">Если вы не регистрировались на этом сайте, просто проигнорируйте это письмо.</p><p style="font-size: small;">Это письмо было созданно автоматически. Пожалуйста, не отвечайте на него.</p></div></body></html>').catch(console.error);
                        req.session.message = "На " + email + " было отправлено письмо с подтверждением. Перейдите по ссылке в письме, чтобы войти в профиль.";
                        req.session.save(() => res.redirect('/login'));
                    });
                }
            });
        }
    });
}

function verification(req, res) {
    let hashemail = req.query.property1;
    let key = req.query.property2;
    const db = dbclient.db('usersdb');
    const collection = db.collection('regUsers');
    collection.find({ hashemail: hashemail }).toArray(function (err, results) {
        if (err) return console.log(err);
        if (!results.length) {
            req.session.message = "Ссылка повреждена.";
            req.session.save(() => res.redirect('/login'));
        } else {
            if (results[0].key != key) {
                req.session.message = "Ссылка повреждена.";
                req.session.save(() => res.redirect('/login'));
            } else {
                let user = { name: results[0].name, surname: results[0].surname, email: results[0].email, hashemail: results[0].hashemail, hashpass: results[0].hashpass, admin: results[0].admin };
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
                        let statData = { date: nowTime(), user: user.name + ' ' + user.surname, email: user.email, operation: "registration" };
                        const statCollection = db.collection('statistics');
                        statCollection.insertOne(statData, function (err, result) {
                            if (err) return console.log(err);
                            req.session.save(() => res.redirect('/profile'));
                        });
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
        let statData = { date: nowTime(), user: req.session.username + ' ' + req.session.surname, email: req.session.email, operation: "removeUser" };
        const statCollection = db.collection('statistics');
        statCollection.insertOne(statData, function (err, result) {
            if (err) return console.log(err);
            res.redirect('/logout');
        });
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
        } else {
            let hashemail = results[0].hashemail;
            let key = sha256(((new Date()).getTime()).toString());
            collection.updateOne({ email: email }, { $set: { key: key } }, function (err, result) {
                if (err) return console.log(err);
                sendEmail(email, "Восстановление пароля", 'yes.world\n\nДля восстановления пароля перейдите по ссылке:\n\nhttp://yes-world.ru/passwordRecovery?property1=' + hashemail + '&property2=' + key + '\n\nЕсли вы не регистрировались на этом сайте, просто проигнорируйте это письмо.\n\nЭто письмо было созданно автоматически. Пожалуйста, не отвечайте на него.', '<html style="font-family: sans-serif;"><body style="margin: 0; font-size: x-large;"><div style="width: 100%; height: 3rem; background-color: #910083; color: white; padding-left: 3rem; padding-top: 1.25rem;"><div>yes.world</div></div><div style="margin-top: 3rem; margin-left: 3rem; margin-right: 3rem; margin-bottom: 3rem;"><p>Для восстановления пароля перейдите по ссылке:</p><p><a href="http://yes-world.ru/passwordRecovery?property1=' + hashemail + '&property2=' + key + '" target="_blank">Восстановить пароль</a></p><p style="font-size: small;">Если вы не регистрировались на этом сайте, просто проигнорируйте это письмо.</p><p style="font-size: small;">Это письмо было созданно автоматически. Пожалуйста, не отвечайте на него.</p></div></body></html>').catch(console.error);
                req.session.message = "На " + email + " было отправлено письмо с ссылкой на восстановление пароля.";
                req.session.save(() => res.redirect('/login'));
            });
        }
    });
}

function passwordRecoveryStep2(req, res) {
    let hashemail = req.query.property1;
    let key = req.query.property2;
    const db = dbclient.db('usersdb');
    const collection = db.collection('users');
    collection.find({ hashemail: hashemail }).toArray(function (err, results) {
        if (err) return console.log(err);
        if (!results.length) {
            req.session.message = "Ссылка повреждена.";
            req.session.save(() => res.redirect('/login'));
        } else {
            if (results[0].key != key) {
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
    let message = { date: nowTime(), author: req.session.username + ' ' + req.session.surname, email: req.session.email, subject: req.body.subject, message: req.body.message };
    const db = dbclient.db('usersdb');
    const collection = db.collection('messages');
    collection.insertOne(message, function (err, result) {
        if (err) return console.log(err);
        sendEmail('d.sabitov@mail.ru', "Получена обратная связь", "yes.world\n\n" + message.date + "\n\n" + message.author + "\n\n" + message.email + "\n\n" + message.subject + "\n\n" + message.message, '<html style="font-family: sans-serif;"><body style="margin: 0; font-size: x-large;"><div style="width: 100%; height: 3rem; background-color: #910083; color: white; padding-left: 3rem; padding-top: 1.25rem;"><div>yes.world</div></div><div style="margin-top: 3rem; margin-left: 3rem; margin-right: 3rem; margin-bottom: 3rem;"><p>' + message.date + '</p><p>' + message.author + '</p><p>' + message.email + '</p><p>' + message.subject + '</p><p>' + message.message + '</p></div></body></html>').catch(console.error);
        req.session.message = "Сообщение отправлено. Постараемся ответить вам как можно скорее."
        req.session.save(() => res.redirect('/contacts'));
    });
}

function logout(req, res) {
    let statData = { date: nowTime(), user: req.session.username + ' ' + req.session.surname, email: req.session.email, operation: "output" };
    const db = dbclient.db('usersdb');
    const statCollection = db.collection('statistics');
    statCollection.insertOne(statData, function (err, result) {
        if (err) return console.log(err);
        res.clearCookie('connect.sid', { path: '/' });
        req.session.destroy(() => res.redirect('/'));
    });
}

function outputDB(req, res, namedb) {
    const db = dbclient.db('usersdb');
    const collection = db.collection(namedb);
    collection.find().toArray(function (err, results) {
        if (err) return console.log(err);
        let data;
        if (namedb === "users") data = { username: req.session.username, results: results, users: true };
        if (namedb === "regUsers") data = { username: req.session.username, results: results, regUsers: true };
        if (namedb === "messages") data = { username: req.session.username, results: results, messages: true };
        if (namedb === "statistics") data = { username: req.session.username, results: results, statistics: true };
        res.render('admin-table', data);
    });
}

function removeRegUser(req, res) {
    let email = req.query.email;
    const db = dbclient.db('usersdb');
    const collection = db.collection('regUsers');
    collection.deleteOne({ email: email }, function (err, result) {
        if (err) return console.log(err);
        res.redirect('/admin/regUsers');
    });
}

function removeStat(req, res) {
    let email = req.query.email;
    let date = req.query.date;
    const db = dbclient.db('usersdb');
    const collection = db.collection('statistics');
    if (email === 'all') {
        collection.deleteMany({}, function (err, result) {
            if (err) return console.log(err);
            res.redirect('/admin/statistics');
        });
    } else {
        collection.deleteOne({ email: email, date: date }, function (err, result) {
            if (err) return console.log(err);
            res.redirect('/admin/statistics');
        });
    }
}

function removeMessage(req, res) {
    let email = req.query.email;
    let date = req.query.date;
    const db = dbclient.db('usersdb');
    const collection = db.collection('messages');
    if (email === 'all') {
        collection.deleteMany({}, function (err, result) {
            if (err) return console.log(err);
            res.redirect('/admin/messages');
        });
    } else {
        collection.deleteOne({ email: email, date: date }, function (err, result) {
            if (err) return console.log(err);
            res.redirect('/admin/messages');
        });
    }
}

function profileDB(req, res, message) {
    const db = dbclient.db('usersdb');
    const collection = db.collection('messages');
    collection.find({ email: req.session.email }).toArray(function (err, results) {
        if (err) return console.log(err);
        res.render('profile', { username: req.session.username, surname: req.session.surname, email: req.session.email, message: message, messages: results });
    });
}

function marvelFilmsDB(req, res) {
    let url = req.query.film;
    const db = dbclient.db('contentdb');
    const collection = db.collection('films');
    collection.find({ url: url }).toArray(function (err, results) {
        if (err) return console.log(err);
        let end1 = null;
        let end2 = null;
        if (results[0].director.includes(",")) end1 = "ы";
        if (results[0].screenwriter.includes(",")) end2 = "ы";
        res.render('marvelFilms', {
            url: url,
            name: results[0].name,
            originalName: results[0].originalName,
            dateWorld: results[0].dateWorld,
            dateRussia: results[0].dateRussia,
            director: results[0].director,
            screenwriter: results[0].screenwriter,
            composer: results[0].composer,
            operator: results[0].operator,
            duration: results[0].duration,
            budget: results[0].budget,
            feesInWorld: results[0].feesInWorld,
            feesInRussia: results[0].feesInRussia,
            end1: end1,
            end2: end2,
        });
    });
}

function addBooks(req, res) {
    fs.readdir('./fb2Books', function (err, result) {
        if (err) return console.log(err);
        result.forEach(function (item, index, array) {
            let cashName = sha256(item);
            fb2.parse('./fb2Books/' + item, function (err, bookMeta) {
                if (err) return console.log(err);
                const db = dbclient.db('contentdb');
                const collection = db.collection('books');
                collection.find({ cashName: cashName }).toArray(function (err, results) {
                    if (err) return console.log(err);
                    if (results.length === 0) {
                        let bookInform = { cashName: cashName, author: bookMeta.author, bookTitle: bookMeta.bookTitle, annotation: bookMeta.annotation, city: bookMeta.city, year: bookMeta.year, date: bookMeta.date, coverpage: bookMeta.coverpage };
                        collection.insertOne(bookInform, function (err, result) {
                            if (err) return console.log(err);
                            fb2Content.getContent('./fb2Books/' + item, cashName, function (err, content) {
                                if (err) return console.log(err);
                                fs.writeFile('./htmlBooks/' + cashName + '.html', content, function (err) {
                                    if (err) return console.log(err);
                                });
                            });
                        });
                    }
                });
            });
        });
        res.redirect('/admin');
    });
}

function getBooks(req, res) {
    const db = dbclient.db('contentdb');
    const collection = db.collection('books');
    collection.find({}, { cashName: true, author: true, bookTitle: true, coverpage: true }).toArray(function (err, results) {
        if (err) return console.log(err);
        if (req.session.login) res.render('books', { username: req.session.username, login: true, results: results });
        else res.render('books', { login: false, results: results });
    });
}

function readBook(req, res) {
    fs.readFile('./htmlBooks/' + req.params['bookId'] + '.html', 'utf8', function (err, data) {
        if (err) return res.render('reader', { content: '<h3>Книга не найдена</h3>' });
        res.render('reader', { content: data });
    });
}

function getBookInform(req, res) {
    let cashName = req.params['bookId'];
    const db = dbclient.db('contentdb');
    const collection = db.collection('books');
    collection.find({ cashName: cashName }).toArray(function (err, results) {
        if (err) return console.log(err);
        if (results.length === 0) {
            res.sendStatus(404);
        } else {
            if (req.session.login) res.render('book', { username: req.session.username, login: true, bookMeta: results[0], admin: req.session.admin });
            else res.render('book', { login: false, bookMeta: results[0] });
        }
    });
}

function changeBookInform(req, res) {
    let cashName = req.body.cashName.trim();
    let author = req.body.author.trim();
    let bookTitle = req.body.bookTitle.trim();
    let city = req.body.city.trim();
    let year = req.body.year.trim();
    let date = req.body.date.trim();
    let coverpage = req.body.coverpage.trim();
    let annotation = req.body.annotation;
    const db = dbclient.db('contentdb');
    const collection = db.collection('books');
    collection.updateOne({ cashName: cashName }, { $set: { author: author, bookTitle: bookTitle, city: city, year: year, date: date, coverpage: coverpage, annotation: annotation } }, function (err, result) {
        if (err) return console.log(err);
        res.redirect('/books/book/' + cashName);
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
exports.outputDB = outputDB;
exports.profileDB = profileDB;
exports.marvelFilmsDB = marvelFilmsDB;
exports.removeRegUser = removeRegUser;
exports.removeStat = removeStat;
exports.removeMessage = removeMessage;
exports.addBooks = addBooks;
exports.getBooks = getBooks;
exports.readBook = readBook;
exports.getBookInform = getBookInform;
exports.changeBookInform = changeBookInform;