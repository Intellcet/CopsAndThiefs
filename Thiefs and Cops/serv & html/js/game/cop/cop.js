function Cop(options) {

    var timer = new Timer();
    var server = options.server;
    
    var player = options.data.player;
    var rang = options.data.rang;
    var nickname = options.data.nickname;

    var changeType = (options && options.callbacks && options.callbacks.changeType instanceof Function) ? options.callbacks.changeType : function () { };

    var intervalRoom;

    var span = "";

    function createButtons() {
        $('#actions').empty();
        $('#actions').append('<input id="movesCop"  type="button" class="btn btn-secondary action-buttons" value="Перейти" />');
        $('#actions').append('<input id="payTax"    type="button" class="btn btn-secondary action-buttons" value="Заплатить налоги" />');
        $('#actions').append('<input id="inspect"   type="button" class="btn btn-secondary action-buttons" value="Осмотреться" />');
        $('#actions').append('<input id="grieve"    type="button" class="btn btn-secondary action-buttons" value="Пожопить" />');
        $('#actions').append('<input id="witnesses" type="button" class="btn btn-secondary action-buttons" value="Позвать понятых" />');
        $('#actions').append('<input id="logoutCop" type="button" class="btn btn-secondary action-buttons" value="Выход" />');
    }

    function fillStatBar(data) {
        $('#bodytbl').empty();
        var row = "<tr><th>" + "Вас зовут: " + data.nickname + "</th> <th>" + "Вы коп по жизни " + "</th> <th>" + "Ваш ранг: " + data.rang + "</th> <th>" + "Кол-во Вашего опыта: " + data.player.exp + "</th> <th>" + "Ваши деньги: " + data.player.money + "</th> </tr>";
        $('#bodytbl').append(row);
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

    function getRoom(id_room) {//получить данные о комнате
        if (id_room) {
            server.getRoom(id_room).done(function (data) {
                if (data) {
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
                    getWays(id_room);
                }
            });
        }
    }

    function toRoom() {//двигаемся в другую комнату
        var name_room = $('#command').val();//получаем значение с командной строки, куда двигаться
        server.action('toRoom', null, null, name_room).done(function (data) {
            if (data && data.action) {
                getRoom(data.action.id);
                player = data.player;
                $('#command').val("");
            } else {
                span = "<span class='span'>Пути в данную комнату из этой комнаты не существует! </span><br class='span' />";
                $('#screen').append(span);
                setTimeout(function () { $('.span').remove(); }, 2000);
            }
        });
    }

    function giveMoney() {//отдаем деньги
        var money = $('#command').val() - 0;
        if (!isNaN(money) && money >= 0) {
            server.action('giveaway', money).done(function (data) {
                if (data) {
                    if (typeof (data) === 'string' || typeof (data.action) === 'string') {
                        span = "<span class='span'>" + ((typeof (data) === 'string') ? data : data.action) + "</span><br class='span' />";
                        $('#screen').append(span);
                    }
                    if (typeof (data.action) === 'object') {
                        fillStatBar(data);
                    }
                }
            });
        } else {
            span = "<span class='span'>" + "Вы ввели не корректное значение!" + "</span><br class='span' />";
            $('#screen').append(span);
        }
        setTimeout(function () { $('.span').remove(); }, 2000);
        $('#command').val("");
    }

    function callWitnesses() {
        var money = $('#command').val() - 0;
        if (!isNaN(money)) {
            server.action('callWitnesses', money).done(function (data) {
                if (data) {
                    if (typeof (data) === 'string') {
                        span = "<span class='span'>" + data + "</span><br class='span' />";
                    }
                    if (typeof (data.action) === 'string') {
                        span = "<span class='span'>" + data.action + "</span><br class='span' />";
                    } else {
                        span = "<span class='span'>" + "Вы нашли свидетелей!" + "</span><br class='span' />";
                        fillStatBar(data);
                        player = data.player;
                    }
                    $('#screen').append(span);
                    $('#command').val('');
                    setTimeout(function () { $('.span').remove(); }, 2000);
                }
            });
        }
    }

    function inspect() {//осматриваем комнату в поисках вора
        server.action('inspect').done(function (data) {
            if (data) {
                if (typeof (data) === 'string') {
                    span = "<span class='span'>" + data + "</span><br class='span' />";
                } else if (typeof (data.action) !== 'string') {
                    player = data.player;
                    fillStatBar(data);
                    span = "<span class='span'>" + "Вы немного подняли деньжат!" + "</span><br class='span' />";
                } else {
                    span = "<span class='span'>" + "Кажется, вы нашли вора( " + data.action + " )" + "</span><br class='span' />";
                }
                $('#command').val("");
                $('#screen').append(span);
                setTimeout(function () { $('.span').remove(); }, 2000);
            }
        });
    }

    function toKnowResultCop(nickname) {
        if (nickname) {
            server.action('toKnowResultCop', null, nickname).done(function (data) {
                if (data) {
                    if (typeof (data.action) === 'string') {
                        var span = "<span class='span'>" + data.action + "</span><br class='span' />";
                        $('#screen').append(span);
                        $('#command').val("");
                        player = data.player;
                        fillStatBar(data);
                        setTimeout(function () { $('.span').remove(); }, 2000);
                    }
                }
            });
            return;
        }
        server.action('toKnowResultCop').done(function (data) {
            if (data) {
                if (typeof (data.action) === 'object') {
                    if (player.exp <= data.action.exp) {
                        span = "<span class='span'>" + "Вас пытались пожопить, но не смогли!" + "</span><br class='span' />";
                    }
                    if (player.exp <= data.action.exp) {
                        span = "<span class='span'>" + "Вас пожопили!" + "</span><br class='span' />";
                    }
                    $('#screen').append(span);
                    $('#command').val("");
                    player = data.player;
                    fillStatBar(data);
                    setTimeout(function () { $('.span').remove(); }, 2000);
                }
            }
        });
    }

    function grieve() {//пожопить
        var target = $('#command').val();
        console.log(nickname, target);
        if (nickname != target) {
            server.action('grieve', null, target).done(function (data) {
                if (data) {
                    if (typeof (data) === 'string') {
                        span = "<span class='span'>" + data + "</span><br class='span' />";
                        $('#screen').append(span);
                        $('#command').val("");
                        setTimeout(function () { $('.span').remove(); }, 2000);
                    }
                    if (typeof (data.action) === 'boolean') {
                        var list = "<ul id='listSec'></ul>";
                        $('#screen').append(list);
                        timer.start(10,
                            function (sec) {
                                var elem = "<ol>" + "Вы бросили предъяву, у вас есть 10 секунд: " + sec + "</ol>";
                                $('#listSec').append(elem);
                            },
                            function () {
                                $('#listSec').remove();
                                $('#command').val("");
                                toKnowResultCop(target);
                            });
                    }
                    if (typeof (data.action) === 'string') {
                        span = "<span class='span'>" + data.action + "</span><br class='span' />";
                        $('#screen').append(span);
                        $('#command').val("");
                        setTimeout(function () { $('.span').remove(); }, 2000);
                    }
                }
            });
        } else {
            span = "<span class='span'> Нельзя предъявлять самому себе! </span><br class='span' />";
            $('#screen').append(span);
            $('#command').val("");
            setTimeout(function () { $('.span').remove(); }, 2000);
        }
    }

    function inFight() {
        $('#movesCop').prop('disabled', true);
        $('#payTax').prop('disabled', true);
        $('#inspect').prop('disabled', true);
        $('#grieve').prop('disabled', true);
        $('#witnesses').prop('disabled', false);
        $('#logoutCop').prop('disabled', true);
    }
    function normal() {
        $('#movesCop').prop('disabled', false);
        $('#payTax').prop('disabled', false);
        $('#inspect').prop('disabled', false);
        $('#grieve').prop('disabled', false);
        $('#witnesses').prop('disabled', true);
        $('#logoutCop').prop('disabled', false);
    }

    function actionsHundler() {
        $('#movesCop').on('click', toRoom);
        $('#payTax').on('click', giveMoney);
        $('#inspect').on('click', inspect);
        $('#grieve').on('click', grieve);
        $('#witnesses').on('click', callWitnesses);
    }

    function init() {
        intervalRoom = setInterval(function () {
            getRoom(player.id_room);
        }, 3000);
        createButtons();
        actionsHundler();
    }

    this.getType = function () {
        return player.type;
    };

    this.getIntervalRoom = function () {
        return intervalRoom;
    };

    this.getStatus = function (data) {
        if (data === "жопит") {
            inFight();
            return;
        }
        if (data === "терпите") {
            changeType();
            return;
        }
        if (data === "жопят") {
            inFight();
            var list = "<ul id='listSec'></ul>";
            $('#screen').append(list);
            timer.start(10, function (sec) {
                var elem = "<ol>" + "Вам бросили предъяву, подождите 10 секунд на поиск понятых: " + sec + "</ol>";
                $('#listSec').append(elem);
            }, function () {
                $('#listSec').remove();
                $('#command').val("");
                toKnowResultCop();
            });
        }
        normal();
    };

    init();
}