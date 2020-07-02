const fs = require('fs');
const libxmljs = require("libxmljs");

const Parser = function (ecoding) {
    this.encoding = ecoding || 'utf-8';
}

Parser.prototype = {
    parse: function (path, cb) {
        let self = this;
        let encoding = self.encoding;
        fs.readFile(path, encoding, function (err, data) {
            if (!err) {
                let book;
                let author;
                let bookTitle = 'Название отсутствует';
                let annotation = 'Аннотация отсутствует';
                let city = null;
                let year = null;
                let date = null;
                let coverpage = null;
                let nameSpace = { FictionBook: 'http://www.gribuser.ru/xml/fictionbook/2.0' }
                let info = {};

                book = libxmljs.parseXmlString(data);

                author = '';
                let key = 0;
                let authors = book.find('//FictionBook:author', nameSpace).toString();
                while (key != -1) {
                    let leftPosFirstName, rightPosFirstName, firstName;
                    if (authors.indexOf('<first-name>', key) != -1) {
                        leftPosFirstName = authors.indexOf('<first-name>', key) + 12;
                        rightPosFirstName = authors.indexOf('<', leftPosFirstName);
                        firstName = authors.slice(leftPosFirstName, rightPosFirstName) + ' ';
                    } else {
                        firstName = '';
                    }
                    let leftPosMiddleName, rightPosMiddleName, middleName;
                    if (authors.indexOf('<middle-name>', key) != -1) {
                        leftPosMiddleName = authors.indexOf('<middle-name>', key) + 13;
                        rightPosMiddleName = authors.indexOf('<', leftPosMiddleName);
                        middleName = authors.slice(leftPosMiddleName, rightPosMiddleName) + ' ';
                    } else {
                        middleName = '';
                    }
                    let leftPosLastName, rightPosLastName, lastName;
                    if (authors.indexOf('<last-name>', key) != -1) {
                        leftPosLastName = authors.indexOf('<last-name>', key) + 11;
                        rightPosLastName = authors.indexOf('<', leftPosLastName);
                        lastName = authors.slice(leftPosLastName, rightPosLastName);
                    } else {
                        lastName = '';
                    }
                    let result = firstName + middleName + lastName;
                    if (result) {
                        if (key === 0) author += result;
                        else author += ', ' + result;
                        if (rightPosFirstName > rightPosMiddleName) {
                            if (rightPosFirstName > rightPosLastName) key = rightPosFirstName;
                            else key = rightPosLastName;
                        } else {
                            if (rightPosMiddleName > rightPosLastName) key = rightPosMiddleName;
                            else key = rightPosLastName;
                        }
                    } else {
                        key = -1;
                    }
                }
                if (book.get('//FictionBook:book-title', nameSpace)) bookTitle = book.get('//FictionBook:book-title', nameSpace).text();
                if (book.get('//FictionBook:annotation', nameSpace)) annotation = book.get('//FictionBook:annotation', nameSpace).text();
                if (book.get('//FictionBook:city', nameSpace)) city = book.get('//FictionBook:city', nameSpace).text();
                if (book.get('//FictionBook:year', nameSpace)) year = book.get('//FictionBook:year', nameSpace).text();
                if (book.get('//FictionBook:date', nameSpace)) date = book.get('//FictionBook:date', nameSpace).text();

                let posCoverpage = data.indexOf('<coverpage');
                if (posCoverpage !== -1) {
                    let leftHref = data.indexOf('"#', posCoverpage) + 2;
                    let rightHref = data.indexOf('"', leftHref);
                    coverpage = data.slice(leftHref, rightHref);
                }

                info.author = author;
                info.bookTitle = bookTitle;
                info.annotation = annotation;
                info.city = city;
                info.year = year;
                info.date = date;
                info.coverpage = coverpage;
                cb(null, info);
            } else {
                cb(err);
                console.log(err);
            }
        });
    }
}

module.exports.parse = function(filepath, encoding, callback) {
    let fb2
        , result;
    if (typeof encoding == 'function') {
        fb2 = new Parser();
        result = fb2.parse(filepath, encoding);
    } else {
        fb2 = new Parser(encoding);
        result = fb2.parse(filepath, callback);
    }
    return result;
}