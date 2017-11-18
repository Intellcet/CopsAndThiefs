$(document).ready(function () {

    var server = new Server();
    var auth = new Auth({ server: server, callbacks: { login : loginSuccess  } });
    var game = new Game({ server: server, callbacks: { logout: logoutSuccess } });

    function loginSuccess(token) {
        game.init(token);
    }

    function logoutSuccess(token) {
        auth.logout(token);
    }
});