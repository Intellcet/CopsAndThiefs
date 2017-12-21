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
    this.registration = function (login, pass, nickname, type) {
        return getData({ method: 'registerUser', login: login, pass: pass, nickname: nickname, type: type });
    };
    this.startGame = function () {
        return getData({ method: 'startGame', token: token });
    };
    this.finishGame = function () {
        return getData({ method: 'finishGame', token: token });
    };
    this.getStatus = function () {
        return getData({ method: 'getStatus', token: token });
    };
    this.getRoom = function (id_room) {
        return getData({ method: 'getRoomInfo', token: token, id_room: id_room });
    };
    this.getWays = function (id_room) {
        return getData({ method: 'getWays', token: token, id_room: id_room });
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
    this.action = function (action, money, nickname, name_room, type) {
        return getData({ method: 'action', token: token, action: action, money: money, nickname: nickname, name_room: name_room, type: type });
    };
}