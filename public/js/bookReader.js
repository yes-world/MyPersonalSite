let sizeFont = 3;
let darkTheme = false;

$('h3').addClass('text-center');
$('img').addClass('mx-auto d-block');
$('#book').addClass('sizeFont' + sizeFont);
if (sizeFont === 5) $('#butMore').addClass('disabled');
if (sizeFont === 1) $('#butLess').addClass('disabled');
if (darkTheme) {
    $('body').addClass('darkThemeBody');
    $('#book').addClass('darkThemeFont');
}

$('#butMore').on('click', function () {
    $('#book').removeClass('sizeFont' + sizeFont);
    sizeFont++;
    $('#book').addClass('sizeFont' + sizeFont);
    if (sizeFont === 5) $('#butMore').addClass('disabled');
    if (sizeFont === 2) $('#butLess').removeClass('disabled');
    return false;
});

$('#butLess').on('click', function () {
    $('#book').removeClass('sizeFont' + sizeFont);
    sizeFont--;
    $('#book').addClass('sizeFont' + sizeFont);
    if (sizeFont === 1) $('#butLess').addClass('disabled');
    if (sizeFont === 4) $('#butMore').removeClass('disabled');
    return false;
});

$('#butTheme').on('click', function () {
    if (!darkTheme) {
        $('body').addClass('darkThemeBody');
        $('#book').addClass('darkThemeFont');
        darkTheme = true;
        $('#butTheme').text('Светлая тема');
    } else {
        $('body').removeClass('darkThemeBody');
        $('#book').removeClass('darkThemeFont');
        darkTheme = false;
        $('#butTheme').text('Темная тема');
    }
    return false;
});

$(function () {
    $('.lazy').Lazy();
});