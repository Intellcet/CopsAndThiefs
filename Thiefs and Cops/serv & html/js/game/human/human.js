function Human(data, _server) {

    var server = _server;

    var player = data.player;
    var rang = data.rang;
    var nickname = data.nickname;
    var interval;

    function createButtons() {
        $('#actions').html("");
        $('#actions').append('<input id="suffer"      type="button" class="btn btn-secondary action-buttons" value="Потерпеть" />');
        $('#actions').append('<input id="sufferBit"   type="button" class="btn btn-secondary action-buttons" value="Потерпеть в другой комнате" />');
        $('#actions').append('<input id="sufferMore"  type="button" class="btn btn-secondary action-buttons" value="Потерпеть еще чуть-чуть" />');
        $('#actions').append('<input id="changeType"  type="button" class="btn btn-secondary action-buttons" value="Сменить класс" />');
        $('#actions').append('<input id="logoutHuman" type="button" class="btn btn-secondary action-buttons" value="Выход" />');
    }

    function fillStatBar(data) {
        $('#bodytbl').html("");
        var row = "<tr><th>" + "nickname: " + data.nickname + "</th> <th>" + "type: " + data.player.type + "</th> <th>" + "rang: " + data.rang + "</th> <th>" + "exp: " + data.player.exp + "</th> <th>" + "money: " + data.player.money + "</th> </tr>";
        $("#bodytbl").html(row);
    }

    function getRoom(id_room) {//получить данные о комнате
        if (id_room) {
            server.getRoom(id_room).done(function (data) {
                if (data) {
                    $("#room").html('');//чистим содержимое комнаты
                    room = data.room;
                    var players = data.players;//игроки в комнате
                    var nicknames = data.nicknames;//их ники
                    $('#nameRoom').html("&nbsp" + room.name + ":");//выводим название комнаты
                    for (var i = 0; i < nicknames.length; i++) {
                        var elem = '<p style="margin-bottom: 5px;">' + nicknames[i] + '</p>';
                        $("#room").append(elem);//выводим ники игроков на экран
                    }
                }
            });
        }
    }

    function toRoom() {//двигаемся в другую комнату
        var name_room = $('#command').val();//получаем значение с командной строки, куда двигаться
        server.action('toRoom', null, null, name_room).done(function (data) {
            if (data) {
                getRoom(data.action.id);
                $('#command').val("");
            }
        });
    }

    function suffer() {//страдаем за терпилу
        server.action('suffer', null, null).done(function (data) {
            if (data) {
                if (typeof (data.action) === 'object') {
                    if (data.action.money <= 1000) {
                        fillStatBar(data);
                    }
                }
                if (typeof (data.action) === 'string') {
                    $('#screen').html(data.action);
                    changeClass();
                    setTimeout(function () { $('#screen').html(""); }, 2000);
                }
            }
        });
    }

    function changeType() {
        var type = $('#command').val();//получаем значение с командной строки
        server.action('changeType', null, null, null, type).done(function (data) {
            if (data) {
                if (data.player.type === "cop") {
                    var cop = {};
                    cop.player = data.player;
                    cop.rang = data.rang;
                    cop.nickname = data.nickname;
                    clearInterval(interval);
                    player = new Cop(cop, server);
                }
                if (data.player.type === "thief") {
                    var thief = {};
                    thief.player = data.player;
                    thief.rang = data.rang;
                    thief.nickname = data.nickname;
                    clearInterval(interval);
                    player = new Thief(thief, server);
                }
            }
        });
    }

    function getStatus() {
        server.getStatus().done(function (data) {
            if (data) {
                console.log(data);
                if (data === "смените класс") {
                    changeClass();
                    return;
                }
            }
        });
    }

    function actionsHundler() {
        $('#suffer').on('click', suffer);
        $('#sufferBit').on('click', toRoom);
        $('#sufferMore').on('click', suffer);
        $('#changeType').on('click', changeType);
    }

    function changeClass() {
        $('#suffer').prop('disabled', true);
        $('#sufferBit').prop('disabled', true);
        $('#sufferMore').prop('disabled', true);
        $('#changeType').prop('disabled', false);
        $('#logoutHuman').prop('disabled', true);
    }
    function normal() {
        $('#suffer').prop('disabled', false);
        $('#sufferBit').prop('disabled', false);
        $('#sufferMore').prop('disabled', false);
        $('#changeType').prop('disabled', true);
        $('#logoutHuman').prop('disabled', false);
    }

    function init() {
        var row = "<tr><th>" + "nickname: " + nickname + "</th> <th>" + "type: " + player.type + "</th> <th>" + "rang: " + rang + "</th> <th>" + "exp: " + player.exp + "</th> <th>" + "money: " + player.money + "</th> </tr>";
        $("#bodytbl").html(row);//заполняем "статбар" игрока
        createButtons();
        actionsHundler();
        if (player.status === "терпите") {
            normal();
        } else {
            changeClass();
        }
        interval = setInterval(getStatus, 3000);
    }

    this.stopGetStatus = function () {
        clearInterval(interval);
    };

    init();
}