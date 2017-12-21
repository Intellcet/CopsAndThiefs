function Thief(options) {

    var server = options.server;
    var timer = new Timer();

    var player = options.data.player;
    var rang = options.data.rang;
    var nickname = options.data.nickname;

    var startGettingStatus = (options && options.callbacks && options.callbacks.startGettingStatus instanceof Function) ? options.callbacks.startGettingStatus : function () { };
    var startGettingRoom = (options && options.callbacks && options.callbacks.startGettingRoom instanceof Function) ? options.callbacks.startGettingRoom : function () { };
    var changeType = (options && options.callbacks && options.callbacks.changeType instanceof Function) ? options.callbacks.changeType : function () { };

    var span = "";

    function createButtons() {
        $('#actions').empty();
        $('#actions').append('<input id="movesThief"  type="button" class="btn btn-secondary action-buttons" value="Перейти" />');
        $('#actions').append('<input id="giveaway"    type="button" class="btn btn-secondary action-buttons" value="Скинуть деньги в общак" />');
        $('#actions').append('<input id="steal"       type="button" class="btn btn-secondary action-buttons" value="Украсть" />');
        $('#actions').append('<input id="search"      type="button" class="btn btn-secondary action-buttons" value="Прошарить комнату" />');
        $('#actions').append('<input id="lawyer"      type="button" class="btn btn-secondary action-buttons" value="Вызвать адвоката" />');
        $('#actions').append('<input id="logoutThief" type="button" class="btn btn-secondary action-buttons" value="Выход" />');
    }

    function fillStatBar(data) {
        $('#bodytbl').empty();
        var row = "<tr><th>" + "Вас зовут: " + data.nickname + "</th> <th>" + "Вы вор по жизни" + "</th> <th>" + "Ваш ранг: " + data.rang + "</th> <th>" + "Кол-во Вашего опыта: " + data.player.exp + "</th> <th>" + "Ваши деньги: " + data.player.money + "</th> </tr>";
        $("#bodytbl").append(row);
    }

    function getRoom(id_room) {//получить данные о комнате
        if (id_room) {
            server.getRoom(id_room).done(function (data) {
                if (data) {
                    console.log(data);
                    $("#room").empty();//чистим содержимое комнаты
                    $('#nameRoom').empty();
                    room = data.room;
                    var players = data.players;//игроки в комнате
                    var nicknames = data.nicknames;//их ники
                    span = "<span class='spanConst'>" + "&nbsp" + room.name + ":" + "</span>";
                    $('#nameRoom').append(span);//выводим название комнаты
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
                    $('#logs').empty();
                    span = "<span class='spanConst'>Можно выйти в следующие комнаты: </span><br />";
                    $('#logs').append(span);
                    var ul = "<ul id='list'></ul>";
                    $('#logs').append(ul);
                    for (var i = 0; i < data.rooms.length; i++) {
                        var list = "<li>" + data.rooms[i].name + "</li>";
                        $('#list').append(list);
                    }
                }
            });
        }
    }

    function toRoom() {//двигаемся в другую комнату
        var name_room = $('#command').val();//получаем значение с командной строки, куда двигаться
        server.action('toRoom', null, null, name_room).done(function (data) {
            if (data) {
                if (typeof (data) === 'string') {
                    span = "<span id='span'>" + data + "</span>";
                    $('#screen').append(span);
                    $('#command').val("");
                    setTimeout(function () { $('#span').remove(); }, 2000);
                }
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
                    if (typeof (data) === 'string') {
                        span = "<span id='span'>" + data + "</span>";
                        $('#screen').append(span);
                        $('#command').val("");
                        setTimeout(function () { $('#span').remove(); }, 2000);
                    }
                    if (typeof (data.action) === 'string') {
                        span = "<span id='span'>" + data.action + "</span>";
                        $('#screen').append(span);
                        $('#command').val("");
                        setTimeout(function () { $('#span').remove(); }, 2000);
                    }
                    if (typeof (data.action) === 'object') {
                        fillStatBar(data);
                        $('#command').val("");
                    }
                }
            });
        } else {
            span = "<span id='span'>" + "Вы ввели не числовое значение!" + "</span>";
            $('#screen').append(span);
            $('#command').val("");
            setTimeout(function () { $('#span').remove(); }, 2000);
        }
    }

    function search() {//обыскиваем комнату
        server.action('search').done(function (data) {
            if (data) {
                if (typeof (data) === 'string') {
                    span = "<span id='span'>" + data + "</span>";
                    $('#screen').append(span);
                    $('#command').val("");
                    setTimeout(function () { $('#span').remove(); }, 2000);
                }
                if (typeof (data.action) === 'string') {
                    span = "<span id='span'>" + data.action + "</span>";
                    $('#screen').append(span);
                    $('#command').val("");
                    setTimeout(function () { $('#span').remove(); }, 2000);
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
                if (typeof (data) === 'string') {
                    span = "<span id='span'>" + data + "</span>";
                    $('#screen').append(span);
                    $('#command').val("");
                    setTimeout(function () { $('#span').remove(); }, 2000);
                }
                if (typeof (data.action) === 'string') {
                    span = "<span id='span'>" + data.action + "</span>";
                    $('#screen').append(span);
                    $('#command').val("");
                    setTimeout(function () { $('#span').remove(); }, 2000);
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
                    if (typeof (data) === 'string') {
                        span = "<span id='span'>" + data + "</span>";
                        $('#screen').append(span);
                        $('#command').val("");
                        setTimeout(function () { $('#span').remove(); }, 2000);
                    }
                    $('#command').val('');
                    if (typeof (data.action) === 'string') {
                        span = "<span id='span'>" + data.action + "</span>";
                        $('#screen').append(span);
                        setTimeout(function () { $('#span').remove(); }, 2000);
                    } else {
                        span = "<span id='span'>" + "Вы успешно увеличили уровень адвоката" + "</span>";
                        $('#screen').append(span);
                        fillStatBar(data);
                        setTimeout(function () { $('#span').remove(); }, 2000);
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
                    span = "<span id='span'>" + "Вас не смогли пожопить!" + "</span>";
                    $('#screen').append(span);
                    fillStatBar(data);
                    setTimeout(function () { $('#span').remove(); }, 2000);
                }
                if (player.exp >= data.player.exp) {
                    span = "<span id='span'>" + "Вас пожопили!" + "</span>";
                    $('#screen').append(span);
                    fillStatBar(data);
                    setTimeout(function () { $('#span').remove(); }, 2000);
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

    function actionsHundler() {
        $('#movesThief').on('click', toRoom);
        $('#giveaway').on('click', giveMoney);
        $('#steal').on('click', steal);
        $('#search').on('click', search);
        $('#lawyer').on('click', lawyer);
    }

    function init() {
        createButtons();
        actionsHundler();
    }

    this.getType = function () {
        return player.type;
    };

    this.getStatus = function (data) {
        if (data === "жопят") {
            inFight();
            var list = "<ul id='listSec'></ul>";
            $('#screen').append(list);
            timer.start(10, function (sec) {
                var elem = "<ol>" + "Вам бросили предъяву, у вас есть 10 секунд на вызов адвоката: " + sec + "</ol>";
                $('#listSec').append(elem);
            }, function () {
                $('#listSec').remove();
                $('#command').val("");
                toKnowResultThief();
                startGettingStatus();
            });
            return;
        }
        if (data === "терпите") {
            changeType();
            return;
        }
        normal();
    };

    init();
}