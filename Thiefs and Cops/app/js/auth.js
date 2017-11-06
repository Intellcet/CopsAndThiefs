function authorization() {
    var user = {
        login: $('#login').val(),
        pass: $('#pass').val()
    }
    if(user.pass != '' && user.login != '' && user.pass.length >= 6 && user.login.length >= 6) {
        //отправка запроса на сервак
        //... если успешно то
        $('.form-signin').attr("action", "gamePage.html");
    } else {
        $('#error').text('Вы ввели неверный логин и(или) пароль!');
    }
}