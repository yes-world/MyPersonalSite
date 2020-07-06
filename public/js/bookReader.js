function getCookie(name) {
    let matches = document.cookie.match(new RegExp(
        "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
    ));
    return matches ? decodeURIComponent(matches[1]) : undefined;
}

let sizeFont = 3;
let darkTheme = false;

if (getCookie('sizeFont')) sizeFont = Number(getCookie('sizeFont'));
if (getCookie('darkTheme')) darkTheme = true;

$('img').addClass('mx-auto d-block');
$('#book').addClass('sizeFont' + sizeFont);
if (sizeFont === 5) $('#butMore').prop('disabled', true);
if (sizeFont === 1) $('#butLess').prop('disabled', true);
if (darkTheme) {
    $('body').addClass('darkThemeBody');
    $('#book').addClass('darkThemeFont');
    $('.oi').removeClass('butControlLight');
    $('.oi').addClass('butControlDark');
    $('#navControl').removeClass('navControlLight');
    $('#navControl').addClass('navControlDark');
}

$('#butMore').on('click', function () {
    $('#book').removeClass('sizeFont' + sizeFont);
    sizeFont++;
    $('#book').addClass('sizeFont' + sizeFont);
    if (sizeFont === 5) $('#butMore').prop('disabled', true);
    if (sizeFont === 2) $('#butLess').prop('disabled', false);
    document.cookie = 'sizeFont=' + sizeFont + '; path=/books/read; max-age=315360000';
    return false;
});

$('#butLess').on('click', function () {
    $('#book').removeClass('sizeFont' + sizeFont);
    sizeFont--;
    $('#book').addClass('sizeFont' + sizeFont);
    if (sizeFont === 1) $('#butLess').prop('disabled', true);
    if (sizeFont === 4) $('#butMore').prop('disabled', false);
    document.cookie = 'sizeFont=' + sizeFont + '; path=/books/read; max-age=315360000';
    return false;
});

$('#butTheme').on('click', function () {
    if (!darkTheme) {
        $('body').addClass('darkThemeBody');
        $('#book').addClass('darkThemeFont');
        $('.oi').removeClass('butControlLight');
        $('.oi').addClass('butControlDark');
        $('#navControl').removeClass('navControlLight');
        $('#navControl').addClass('navControlDark');
        darkTheme = true;
        document.cookie = 'darkTheme=true; path=/books/read; max-age=315360000';
    } else {
        $('body').removeClass('darkThemeBody');
        $('#book').removeClass('darkThemeFont');
        $('.oi').removeClass('butControlDark');
        $('.oi').addClass('butControlLight');
        $('#navControl').removeClass('navControlDark');
        $('#navControl').addClass('navControlLight');
        darkTheme = false;
        document.cookie = 'darkTheme=false; path=/books/read; max-age=-1';
    }
    return false;
});

$('#butClose').on('click', function () {
    window.close();
    return false;
});

$(function () {
    $('.lazy').Lazy();
});

if (getCookie('bookScroll')) window.scrollTo(0, Number(getCookie('bookScroll')));

$(window).scroll(function () {
    document.cookie = 'bookScroll=' + window.pageYOffset + '; path=' + window.location.pathname + '; max-age=315360000';
});