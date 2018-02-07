﻿function Auth(options) {

    var server = options.server;
    var loginSuccess = (options && options.callbacks && options.callbacks.login instanceof Function) ? options.callbacks.login : function () { };

    var span = "";

    function showBlock(block) {
        showImg();
        $('#validation').hide();
        $('#gamePage').hide();
        $('#registration').hide();
        $('#' + block).show();
    }

    function showImg() {
        $('body').removeClass('cop');
        $('body').removeClass('thief');
        $('body').removeClass('human');
        $('body').addClass('signIn');
    }

    this.getToken = function () {
        return token;
    };

    this.logout = function () {
        server.logout().done(function (data) {
            if (data) {
                showImg();
                $('.wrapper').empty();
                showBlock('validation');
            }
        });
    };

    function _signIn() {
        var login = $('#login').val();
        var pass = $('#pass').val();
        if (login && pass) {
            pass = md5(login + pass);
            server.login(login, pass).done(function (data) {
                if (data) {
                    if (data.token != false) {
                        showBlock('gamePage');
                        loginSuccess(data.token);
                    } else {
                        $('#error').remove();
                        span = "<span id='error' style='color: red'>" + "Неверный логин и(или) пароль!" + "</span>";
                        $('.wrapper').append(span);
                    }
                }
            });
            $('#login').val('');
            $('#pass').val('');
        } else {
            $('#error').remove();
            span = "<span id='error' style='color: red; margin-top:5px;'>" + "Не ввели логин и(или) пароль!" + "</span>";
            $('.wrapper').append(span);
        }
    }

    function signIn() {
        $('.wrapper').empty();
        $('#pass').on('keypress', function (event) {
            if (event.keyCode === 13) {
                _signIn();
            }
        });
        $('#signIn').on('click', function (event) {
            _signIn();
        });
    }

    function backToSignIn() {
        $('#signInSpan').on('click', function (event) {
            showBlock('validation');
            $('.wrapper').empty();
        });
    }

    function registr() {
        $('.wrapper').empty();
        var loginReg = $('#loginReg').val();
        var passReg = $('#passReg').val();
        var nickname = $('#nickname').val();
        var passAgain = $('#passAgain').val();
        var type = $('#type').val();
        if (passReg === passAgain) {
            if (loginReg && passReg && nickname && type) {
                passReg = md5(loginReg + passReg);
                server.registration(loginReg, passReg, nickname, type).done(function (data) {
                    if (data) {
                        if (typeof (data) === 'string') {
                            $('#error').remove();
                            span = "<span id='error' class='alert-danger' style='margin-top:5px;'>" + data + "</span>";
                            $('.wrapper').append(span);
                        } else {
                            $('#loginReg').val(''); $('#nickname').val('');
                            $('#passReg').val(''); $('#passAgain').val('');
                            $('#error').remove();
                            span = "<span id='error' style='color: green; margin-top:5px;'>" + "Вы успешно зарегистрировались!" + "</span>";
                            $('.wrapper').append(span);
                            setTimeout(function () { $('.wrapper').remove(); showBlock('validation'); signIn(); }, 1000);
                        }
                    }
                });
            } else {
                $('#error').remove();
                span = "<span id='error' style='color: red; margin-top:5px;'>" + "Не ввели логин и(или) ник, и(или) пароль, и(или) тип!!!" + "</span>";
                $('.wrapper').append(span);
            }
        } else {
            $('#error').remove();
            span = "<span id='error' class='alert-danger' style='margin-top:5px;'>" + "Пароли не совпадают!!!" + "</span>";
            $('.wrapper').append(span);
            $('#passAgain').val('');
        }
    }

    function logIn() {
        $('#registrationSpan').on('click', function (event) {
            showBlock('registration');
            $('.wrapper').empty();
            backToSignIn();
            $('#passAgain').on('keypress', function (event) {
                if (event.keyCode === 13) {
                    registr();
                }
            });
            $('#registrationBtn').on('click', function (event) {
                registr();
            });
        });
    }

    function init() {
        //show/hide blocks
        showBlock('validation');

        //event handler
        signIn();
        logIn();

    }

    init();
}