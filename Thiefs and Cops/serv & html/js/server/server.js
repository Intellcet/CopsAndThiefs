function Server() {

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

    this.login = function (login, pass) {
        return getData({ method: 'login', login: login, pass: pass });
    };
    this.logout = function (token) {
        return getData({ method: 'logout', token: token });
    };
    this.startGame = function (token) {
        return getData({ method: 'startGame', token: token });
    };
    this.finishGame = function (token) {
        return getData({ method: 'finishGame', token: token });
    };
    this.getRoom = function (id_room) {
        return getData({ method: 'getRoomInfo', id_room: id_room });
    };
    this.toRoom = function (token, name_room) {
        return getData({ method: 'toRoom', token: token, name_room: name_room });
    };
}