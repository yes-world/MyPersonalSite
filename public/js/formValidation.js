$(document).ready(function () {
    $("#regForm").validate({
        rules: {
            name: {
                required: true,
            },
            surname: {
                required: true,
            },
            email: {
                required: true,
                email: true,
            },
            password: {
                required: true,
                minlength: 6,
            },
            confirmPassword: {
                required: true,
                equalTo: '#inNewPassword',
            },
        },
        messages: {
            name: {
                required: 'Заполните поле',
            },
            surname: {
                required: 'Заполните поле',
            },
            email: {
                required: 'Заполните поле',
                email: 'Некорректный email',
            },
            password: {
                required: 'Заполните поле',
                minlength: 'Минимум 6 символов',
            },
            confirmPassword: {
                required: 'Заполните поле',
                equalTo: 'Пароли не совпадают',
            },
        },
        errorElement: 'div',
        errorPlacement: function (error, element) {
            error.addClass('validMessage');
            error.insertAfter(element);
        },
        highlight: function (element, errorClass, validClass) {
            $(element).addClass("is-invalid").removeClass("is-valid");
        },
        unhighlight: function (element, errorClass, validClass) {
            $(element).addClass("is-valid").removeClass("is-invalid");
        }
    });

    $("#auntForm").validate({
        rules: {
            email: {
                required: true,
                email: true,
            },
            password: {
                required: true,
            },
        },
        messages: {
            email: {
                required: 'Заполните поле',
                email: 'Некорректный email',
            },
            password: {
                required: 'Заполните поле',
            },
        },
        errorElement: 'div',
        errorPlacement: function (error, element) {
            error.addClass('validMessage');
            error.insertAfter(element);
        },
        highlight: function (element, errorClass, validClass) {
            $(element).addClass("is-invalid").removeClass("is-valid");
        },
        unhighlight: function (element, errorClass, validClass) {
            $(element).addClass("is-valid").removeClass("is-invalid");
        }
    });

    $("#feedbackForm").validate({
        rules: {
            subject: {
                required: true,
            },
            message: {
                required: true,
            },
        },
        messages: {
            subject: {
                required: 'Заполните поле',
            },
            message: {
                required: 'Заполните поле',
            },
        },
        errorElement: 'div',
        errorPlacement: function (error, element) {
            error.addClass('validMessage');
            error.insertAfter(element);
        },
        highlight: function (element, errorClass, validClass) {
            $(element).addClass("is-invalid").removeClass("is-valid");
        },
        unhighlight: function (element, errorClass, validClass) {
            $(element).addClass("is-valid").removeClass("is-invalid");
        }
    });

    $("#passRecForm").validate({
        rules: {
            email: {
                required: true,
                email: true,
            },
        },
        messages: {
            email: {
                required: 'Заполните поле',
                email: 'Некорректный email',
            },
        },
        errorElement: 'div',
        errorPlacement: function (error, element) {
            error.addClass('validMessage');
            error.insertAfter(element);
        },
        highlight: function (element, errorClass, validClass) {
            $(element).addClass("is-invalid").removeClass("is-valid");
        },
        unhighlight: function (element, errorClass, validClass) {
            $(element).addClass("is-valid").removeClass("is-invalid");
        }
    });

    $("#passRecForm2").validate({
        rules: {
            password: {
                required: true,
                minlength: 6,
            },
            confirmPassword: {
                required: true,
                equalTo: '#inPassword',
            },
        },
        messages: {
            password: {
                required: 'Заполните поле',
                minlength: 'Минимум 6 символов',
            },
            confirmPassword: {
                required: 'Заполните поле',
                equalTo: 'Пароли не совпадают',
            },
        },
        errorElement: 'div',
        errorPlacement: function (error, element) {
            error.addClass('validMessage');
            error.insertAfter(element);
        },
        highlight: function (element, errorClass, validClass) {
            $(element).addClass("is-invalid").removeClass("is-valid");
        },
        unhighlight: function (element, errorClass, validClass) {
            $(element).addClass("is-valid").removeClass("is-invalid");
        }
    });

    $("#changeNameForm").validate({
        rules: {
            name: {
                required: true,
            },
            surname: {
                required: true,
            },
        },
        messages: {
            name: {
                required: 'Заполните поле',
            },
            surname: {
                required: 'Заполните поле',
            },
        },
        errorElement: 'div',
        errorPlacement: function (error, element) {
            error.addClass('validMessage');
            error.insertAfter(element);
        },
        highlight: function (element, errorClass, validClass) {
            $(element).addClass("is-invalid").removeClass("is-valid");
        },
        unhighlight: function (element, errorClass, validClass) {
            $(element).addClass("is-valid").removeClass("is-invalid");
        }
    });

    $("#changePasswordForm").validate({
        rules: {
            oldpass: {
                required: true,
            },
            newpass: {
                required: true,
                minlength: 6,
            },
            confirmPassword: {
                required: true,
                equalTo: '#inNewPassword',
            },
        },
        messages: {
            oldpass: {
                required: 'Заполните поле',
            },
            newpass: {
                required: 'Заполните поле',
                minlength: 'Минимум 6 символов',
            },
            confirmPassword: {
                required: 'Заполните поле',
                equalTo: 'Пароли не совпадают',
            },
        },
        errorElement: 'div',
        errorPlacement: function (error, element) {
            error.addClass('validMessage');
            error.insertAfter(element);
        },
        highlight: function (element, errorClass, validClass) {
            $(element).addClass("is-invalid").removeClass("is-valid");
        },
        unhighlight: function (element, errorClass, validClass) {
            $(element).addClass("is-valid").removeClass("is-invalid");
        }
    });

    $("#phoneForm").validate({
        rules: {
            phone: {
                required: true,
            },
        },
        messages: {
            phone: {
                required: 'Заполните поле',
            },
        },
        errorElement: 'div',
        errorPlacement: function (error, element) {
            error.addClass('validMessage');
            error.insertAfter(element);
        },
        highlight: function (element, errorClass, validClass) {
            $(element).addClass("is-invalid").removeClass("is-valid");
        },
        unhighlight: function (element, errorClass, validClass) {
            $(element).addClass("is-valid").removeClass("is-invalid");
        }
    });

    $("#changeBookMetaForm").validate({
        rules: {
            author: {
                required: true,
            },
            bookTitle: {
                required: true,
            },
        },
        messages: {
            author: {
                required: 'Заполните поле',
            },
            bookTitle: {
                required: 'Заполните поле',
            },
        },
        errorElement: 'div',
        errorPlacement: function (error, element) {
            error.addClass('validMessage');
            error.insertAfter(element);
        },
        highlight: function (element, errorClass, validClass) {
            $(element).addClass("is-invalid").removeClass("is-valid");
        },
        unhighlight: function (element, errorClass, validClass) {
            $(element).addClass("is-valid").removeClass("is-invalid");
        }
    });
});