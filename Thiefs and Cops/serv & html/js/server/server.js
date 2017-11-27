function Server() {

    var token;

    function getData(data) {
        var deferred = $.Deferred();
        $.ajax({
            url: 'index.php',
            data: data,
            dataType: 'json',
            success: function (data) {
                deferred.resolve(data);
            }
        });
        return deferred.promise();
    }

    this.setToken = function (_token) {
        token = _token;
    };

    this.login = function (login, pass) {
        return getData({ method: 'login', login: login, pass: pass });
    };
    this.logout = function () {
        return getData({ method: 'logout', token: token });
    };
    this.startGame = function () {
        return getData({ method: 'startGame', token: token });
    };
    this.finishGame = function () {
        return getData({ method: 'finishGame', token: token });
    };
    this.getRoom = function (id_room) {
        return getData({ method: 'getRoomInfo', id_room: id_room });
    };
    this.toRoom = function (name_room) {
        return getData({ method: 'toRoom', token: token, name_room: name_room });
    };
    this.giveMoney = function (money) {
        return getData({ method: 'giveMoney', token: token, money: money });
    };
    this.setMessage = function (text) {
        return getData({ method: 'setMessage', token: token, text: text });
    };
    this.getMessages = function () {
        return getData({ method: 'getMessages', token: token });
    };
    this.action = function (action, money, nickname) {
        return getData({ method: 'action', token: token, action: action, money: money, nickname: nickname });
    }
}