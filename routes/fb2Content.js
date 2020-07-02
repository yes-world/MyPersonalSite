const fs = require('fs');

function getContent(path, cashName, callback) {
    fs.readFile(path, 'utf8', function (err, data) {
        if (err) return callback(err);
        while (true) {
            let i = data.indexOf('<binary');
            if (i === -1) break;
            let endBinary = data.indexOf('</binary>', i) + 9;
            let leftId = data.indexOf('id="', i) + 4;
            let rightId = data.indexOf('"', leftId);
            let id = data.slice(leftId, rightId);
            if (id.indexOf('.') === -1) {
                let leftHref = data.indexOf('"#' + id + '"') + 2;
                let rightHref = data.indexOf('"', leftHref);
                let leftContentType = data.indexOf('content-type="', i) + 14;
                let rightContentType = data.indexOf('"', leftContentType);
                let contentType = data.slice(leftContentType, rightContentType);
                if (contentType === 'image/jpeg') {
                    id += '.jpg';
                } else if (contentType === 'image/png') {
                    id += '.png';
                } else {
                    continue;
                }
                data = data.slice(0, leftHref) + id + data.slice(rightHref);
            }
            let leftImage = data.indexOf('>', i) + 1;
            let rightImage = data.indexOf('<', leftImage);
            let image = data.slice(leftImage, rightImage);
            let buff = new Buffer.from(image, 'base64');

            fs.writeFile('./public/img/' + cashName + '/' + id, buff, function (err) {
                if (err) {
                    fs.mkdir('./public/img/' + cashName, function (err) {
                        fs.writeFile('./public/img/' + cashName + '/' + id, buff, function (err) {
                            if (err) return console.log(err);
                        });
                    });
                }
            });

            data = data.slice(0, i) + data.slice(endBinary);
        }

        let content = '<div id="book"' + data.slice(data.indexOf('<body') + 5, data.indexOf('</body') + 2) + 'div>';
        while (true) {
            let i = content.indexOf('<title>');
            if (i === -1) break;
            content = content.slice(0, i) + '<h3>' + content.slice(i + 7);
        }
        while (true) {
            let i = content.indexOf('</title>');
            if (i === -1) break;
            content = content.slice(0, i) + '</h3>' + content.slice(i + 8);
        }
        while (true) {
            let i = content.indexOf('<empty-line />');
            if (i === -1) break;
            content = content.slice(0, i) + content.slice(i + 14);
        }
        while (true) {
            let i = content.indexOf('<empty-line/>');
            if (i === -1) break;
            content = content.slice(0, i) + content.slice(i + 13);
        }
        while (true) {
            let i = content.indexOf('<emphasis>');
            if (i === -1) break;
            content = content.slice(0, i) + '<i>' + content.slice(i + 10);
        }
        while (true) {
            let i = content.indexOf('</emphasis>');
            if (i === -1) break;
            content = content.slice(0, i) + '</i> ' + content.slice(i + 11);
        }
        while (true) {
            let i = content.indexOf('<subtitle>');
            if (i === -1) break;
            content = content.slice(0, i) + '<h4>' + content.slice(i + 10);
        }
        while (true) {
            let i = content.indexOf('</subtitle>');
            if (i === -1) break;
            content = content.slice(0, i) + '</h4> ' + content.slice(i + 11);
        }
        while (true) {
            let i = content.indexOf('<image');
            if (i === -1) break;
            let leftHref = content.indexOf('href="#', i) + 7;
            let rightHref = content.indexOf('"', leftHref);
            let href = content.slice(leftHref, rightHref);
            let endImage = content.indexOf('>', rightHref);
            content = content.slice(0, i) + '<img class="lazy img-fluid" data-src="/img/' + cashName + '/' + href + '">' + content.slice(endImage + 1);
        }
        while (true) {
            let i = content.indexOf('<epigraph>');
            if (i === -1) break;
            content = content.slice(0, i) + '<strong>' + content.slice(i + 10);
        }
        while (true) {
            let i = content.indexOf('</epigraph>');
            if (i === -1) break;
            content = content.slice(0, i) + '</strong> ' + content.slice(i + 11);
        }
        while (true) {
            let i = content.indexOf('<text-author>');
            if (i === -1) break;
            content = content.slice(0, i) + '<i>' + content.slice(i + 13);
        }
        while (true) {
            let i = content.indexOf('</text-author>');
            if (i === -1) break;
            content = content.slice(0, i) + '</i> ' + content.slice(i + 14);
        }
        while (true) {
            let i = content.indexOf('l:href');
            if (i === -1) break;
            content = content.slice(0, i) + content.slice(i + 2);
        }
        while (true) {
            let i = content.indexOf('type="note"');
            if (i === -1) break;
            content = content.slice(0, i) + 'style="display: none;"' + content.slice(i + 11);
        }

        callback(null, content);
    });
}

exports.getContent = getContent;