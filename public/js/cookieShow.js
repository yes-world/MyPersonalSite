function getCookie(name) {
    let matches = document.cookie.match(new RegExp(
        "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
    ));
    return matches ? decodeURIComponent(matches[1]) : undefined;
}

if (!getCookie("cookieShow")) {
    $('.toast').toast('show');
    $('.toast').on('hide.bs.toast', function () {
        document.cookie = "cookieShow=true; max-age=604800";
        $('.toast').remove();
    });
} else {
    $('.toast').remove();
}