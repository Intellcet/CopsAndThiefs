function Auth(options) {

    var server = options.server;
    var loginSuccess = (options && options.callbacks && options.callbacks.login instanceof Function) ? options.callbacks.login : function () { };
    var token;

    function showAuth() {
        $('#validation').show();
        $('#gamePage').hide();
    }

    function showGame() {
        $('#validation').hide();
        $('#gamePage').show();
    }

    this.getToken = function () {
        return token;
    };

    this.logout = function (token) {
        server.logout(token).done(function (data) {
            if(data) {
                token = null;
                showAuth();
            }
        });
    };

    function init() {
        //show/hide blocks
        showAuth();

        //event handler
        $('#signIn').on('click', function (event) {
            var login = $('#login').val();
            var pass = $('#pass').val();
            if(login && pass) {
                server.login(login, pass).done(function (data) {
                    if(data && data.token) {
                        token = data.token;
                        showGame();
                        loginSuccess(token);
                    } 
                });     
                $('#login').val('');
                $('#pass').val('');
            } else {
                alert('pass or log')
            }
        });
    }

    init();
}