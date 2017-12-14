function Thief(_data, _server) {

    var server = _server;
    var timer = new Timer();

    var player = _data.player;
    var rang = _data.rang;
    var nickname = _data.nickname;
    var intervalStatus;
    var intervalRoom;

    function createButtons() {
        $('#actions').html("");
        $('#actions').append('<input id="movesThief"  type="button" class="btn btn-secondary action-buttons" value="Перейти" />');
        $('#actions').append('<input id="giveaway"    type="button" class="btn btn-secondary action-buttons" value="Скинуть деньги в общак" />');
        $('#actions').append('<input id="steal"       type="button" class="btn btn-secondary action-buttons" value="Украсть" />');
        $('#actions').append('<input id="search"      type="button" class="btn btn-secondary action-buttons" value="Прошарить комнату" />');
        $('#actions').append('<input id="lawyer"      type="button" class="btn btn-secondary action-buttons" value="Вызвать адвоката" />');
        $('#actions').append('<input id="logoutThief" type="button" class="btn btn-secondary action-buttons" value="Выход" />');
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

    function getWays(id_room) {
        if (id_room) {
            server.getWays(id_room).done(function (data) {
                if (data) {
                    $('#screen').append("<span>Можно выйти в следующие комнаты: </span><br />");
                    $('#screen').append("<ol id='list'></ol>");
                    for (var i = 0; i < data.rooms.length; i++) {
                        var list = "<li>" + data.rooms[i] + "</li>";
                        $('#screen').append(list);
                    }
                }
            });
        }
    }

    function toRoom() {//двигаемся в другую комнату
        var name_room = $('#command').val();//получаем значение с командной строки, куда двигаться
        server.action('toRoom', null, null, name_room).done(function (data) {
            if (data) {
                player = data.player;
                getRoom(data.action.id);
                getWays(data.action.id);
                $('#command').val("");
            }
        });
    }

    function giveMoney() {//отдаем деньги
        var money = $('#command').val() - 0;
        if (!isNaN(money)) {
            server.action('giveaway', money).done(function (data) {
                if (data) {
                    if (typeof (data.action) === 'string') {
                        var span = "<span>" + data.action + "</span>";
                        $('#screen').html(span);
                        $('#command').val("");
                        setTimeout(function () { $('#screen').html(""); }, 2000);
                    }
                    if (typeof (data.action) === 'object') {
                        fillStatBar(data);
                        $('#command').val("");
                    }
                }
            });
        } else {
            var span = "<span>" + "Вы ввели не числовое значение!" + "</span>";
            $('#screen').html(span);
            $('#command').val("");
            setTimeout(function () { $('#screen').html(""); }, 2000);
        }
    }

    function search() {//обыскиваем комнату
        server.action('search').done(function (data) {
            if (data) {
                if (typeof (data.action) === 'string') {
                    var span = "<span>" + data.action + "</span>";
                    $('#screen').html(span);
                    $('#command').val("");
                    setTimeout(function () { $('#screen').html(""); }, 2000);
                }
                if (typeof (data.action) === 'object') {
                    fillStatBar(data);
                    $('#command').val("");
                    player = data.player;
                }
            }
        });
    }

    function steal() {//крадем деньги
        var nickname = $('#command').val();
        server.action('steal', null, nickname).done(function (data) {
            if (data) {
                if (typeof (data.action) === 'string') {
                    var span = "<span>" + data.action + "</span>";
                    $('#screen').html(span);
                    $('#command').val("");
                    setTimeout(function () { $('#screen').html(""); }, 2000);
                }
                if (typeof (data.action) === 'object') {
                    fillStatBar(data);
                    $('#command').val("");
                    player = data.player;
                }
            }
        });
    }

    function lawyer() {//вызываем адвоката
        var money = $('#command').val() - 0;
        if (!isNaN(money)) {
            server.action('lawyer', money).done(function (data) {
                if (data) {
                    $('#command').val('');
                    if (typeof (data.action) === 'string') {
                        $('#screen').html(data.action);
                        setTimeout(function () { $('#screen').html(""); }, 2000);
                    } else {
                        $('#screen').html("Вы успешно увеличили уровень адвоката");
                        fillStatBar(data);
                        setTimeout(function () { $('#screen').html(""); }, 2000);
                        player = data.player;
                    }
                }
            });
        }
    }

    function toKnowResultThief() {
        server.action('toKnowResultThief').done(function (data) {
            if (data) {
                if (player.exp < data.player.exp) {
                    $('#screen').html("Вас не смогли пожопить!");
                    fillStatBar(data);
                    setTimeout(function () { $('#screen').html(""); }, 2000);
                    interval = setInterval(getStatus, 3000);
                }
                if (player.exp >= data.player.exp) {
                    $('#screen').html("Вас пожопили!");
                    fillStatBar(data);
                    setTimeout(function () { $('#screen').html(""); }, 2000);
                    interval = setInterval(getStatus, 3000);
                }
            }
        });
    }

    function inFight() {
        $('#movesThief').prop('disabled', true);
        $('#giveaway').prop('disabled', true);
        $('#steal').prop('disabled', true);
        $('#search').prop('disabled', true);
        $('#lawyer').prop('disabled', false);
        $('#logoutThief').prop('disabled', true);
    }
    function normal() {
        $('#movesThief').prop('disabled', false);
        $('#giveaway').prop('disabled', false);
        $('#steal').prop('disabled', false);
        $('#search').prop('disabled', false);
        $('#lawyer').prop('disabled', true);
        $('#logoutThief').prop('disabled', false);
    }

    function changeType() {
        server.action("changeType").done(function (data) {
            if (data.action) {
                var human = {};
                human.player = data.player;
                human.rang = data.rang;
                human.nickname = data.nickname;
                clearInterval(intervalStatus);
                clearInterval(intervalRoom);
                player = new Human(human, server);
            }
        });
    }

    function getStatus() {
        server.getStatus().done(function (data) {
            if (data) {
                if (data === "жопят") {
                    inFight();
                    timer.start(10, function (sec) {
                        $('#screen').html("Вам бросили предъяву, у вас есть 10 секунд на вызов адвоката: " + sec);
                    }, function () {
                        $('#screen').html("");
                        $('#command').val("");
                        toKnowResultThief();
                    });
                    return;
                }
                if (data === "терпите") {
                    changeType();
                    return;
                }
                normal();
            }
        });
    }

    function actionsHundler() {
        $('#movesThief').on('click', toRoom);
        $('#giveaway').on('click', giveMoney);
        $('#steal').on('click', steal);
        $('#search').on('click', search);
        $('#lawyer').on('click', lawyer);
    }

    function init() {
        var row = "<tr><th>" + "nickname: " + nickname + "</th> <th>" + "type: " + player.type + "</th> <th>" + "rang: " + rang + "</th> <th>" + "exp: " + player.exp + "</th> <th>" + "money: " + player.money + "</th> </tr>";
        $("#bodytbl").html(row);//заполняем "статбар" игрока
        createButtons();
        actionsHundler();
        intervalStatus = setInterval(getStatus, 3000);
        intervalRoom = setInterval(getRoom, 3000, player.id_room);
    }

    this.stopGetStatus = function () {
        clearInterval(intervalStatus);
        clearInterval(intervalRoom);
    };

    init();
}