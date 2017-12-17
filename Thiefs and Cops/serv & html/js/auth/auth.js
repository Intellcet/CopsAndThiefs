function Auth(options) {

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

    function signIn() {
        $('.wrapper').empty();
        $('#signIn').on('click', function (event) {
            var login = $('#login').val();
            var pass = $('#pass').val();
            if (login && pass) {
                server.login(login, pass).done(function (data) {
                    if (data.token != false) {
                        showBlock('gamePage');
                        loginSuccess(data.token);
                    } else {
                        $('#error').remove();
                        span = "<span id='error' class='alert-danger'>" + "Неверный логин и(или) пароль!" + "</span>";
                        $('.wrapper').append(span);
                    }
                });
                $('#login').val('');
                $('#pass').val('');
            } else {
                $('#error').remove();
                span = "<span id='error' class='alert-danger' style='margin-top:5px;'>" + "Не ввели логин и(или) пароль!" + "</span>";
                $('.wrapper').append(span);
            }
        });
    }

    function logIn() {
        $('#registrationSpan').on('click', function (event) {
            showBlock('registration');
            $('.wrapper').empty();
            $('#registrationBtn').on('click', function (event) {
                var loginReg = $('#loginReg').val();
                var passReg = $('#passReg').val();
                var nickname = $('#nickname').val();
                var passAgain = $('#passAgain').val();
                if (passReg === passAgain) {
                    if (loginReg && passReg && nickname) {
                        server.registration(loginReg, passReg, nickname).done(function (data) {
                            if (data) {
                                $('#loginReg').val(''); $('#nickname').val('');
                                $('#passReg').val(''); $('#passAgain').val('');
                                $('#error').remove();
                                span = "<span id='error' class='text-success' style='margin-top:5px;'>" + "Вы успешно зарегистрировались!" + "</span>";
                                $('.wrapper').append(span);
                                setTimeout(function () { $('.wrapper').remove(); showBlock('validation'); signIn(); }, 3000);
                            }
                        });
                    } else {
                        $('#error').remove();
                        span = "<span id='error' class='alert-danger' style='margin-top:5px;'>" + "Не ввели логин и(или) ник, и(или) пароль!!!" + "</span>";
                        $('.wrapper').append(span);
                    }
                } else {
                    $('#error').remove();
                    span = "<span id='error' class='alert-danger' style='margin-top:5px;'>" + "Пароли не совпадают!!!" + "</span>";
                    $('.wrapper').append(span);
                    $('#passAgain').val('');
                }
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