$(document).ready(function () {

    var server = new Server();
    var auth = new Auth({ server: server, callbacks: { login : loginSuccess } });
    var game = new Game({ server: server, callbacks: { logout: logoutSuccess} });
    var chat = new Chat({ server: server, callbacks: { logout: logoutSuccess} });

    function loginSuccess(token) {
        server.setToken(token);
        chat.init();
        game.init();
    }

    function logoutSuccess(token) {
        auth.logout();
        chat.deinit();
    }
});