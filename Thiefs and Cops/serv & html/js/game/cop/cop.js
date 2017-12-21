function Cop(options) {

    var timer = new Timer();
    var server = options.server;
    
    var player = options.data.player;
    var rang = options.data.rang;
    var nickname = options.data.nickname;

    var startGettingStatus = (options && options.callbacks && options.callbacks.startGettingStatus instanceof Function) ? options.callbacks.startGettingStatus : function () { };
    var changeType = (options && options.callbacks && options.callbacks.changeType instanceof Function) ? options.callbacks.changeType : function () { };

    var span = "";

    function createButtons() {
        $('#actions').empty();
        $('#actions').append('<input id="movesCop"  type="button" class="btn btn-secondary action-buttons" value="Перейти" />');
        $('#actions').append('<input id="payTax"    type="button" class="btn btn-secondary action-buttons" value="Заплатить налоги" />');
        $('#actions').append('<input id="inspect"   type="button" class="btn btn-secondary action-buttons" value="Осмотреться" />');
        $('#actions').append('<input id="grieve"    type="button" class="btn btn-secondary action-buttons" value="Пожопить" />');
        $('#actions').append('<input id="witnesses"    type="button" class="btn btn-secondary action-buttons" value="Позвать понятых" />');
        $('#actions').append('<input id="logoutCop" type="button" class="btn btn-secondary action-buttons" value="Выход" />');
    }

    function fillStatBar(data) {
        $('#bodytbl').empty();
        var row = "<tr><th>" + "Вас зовут: " + data.nickname + "</th> <th>" + "Вы коп по жизни " + "</th> <th>" + "Ваш ранг: " + data.rang + "</th> <th>" + "Кол-во Вашего опыта: " + data.player.exp + "</th> <th>" + "Ваши деньги: " + data.player.money + "</th> </tr>";
        $('#bodytbl').append(row);
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

    function callWitnesses() {
        var money = $('#command').val() - 0;
        if (!isNaN(money)) {
            server.action('callWitnesses', money).done(function (data) {
                if (data) {
                    $('#command').val('');
                    if (typeof (data) === 'string') {
                        span = "<span id='span'>" + data + "</span>";
                        $('#screen').append(span);
                        $('#command').val("");
                        setTimeout(function () { $('#span').remove(); }, 2000);
                    }
                    if (typeof (data.action) === 'string') {
                        span = "<span id='span'>" + data.action + "</span>";
                        $('#screen').append(span);
                        setTimeout(function () { $('#span').remove(); }, 2000);
                    } else {
                        span = "<span id='span'>" + "Вы нашли свидетелей!" + "</span>";
                        $('#screen').append(span);
                        fillStatBar(data);
                        setTimeout(function () { $('#span').remove(); }, 2000);
                        player = data.player;
                    }
                }
            });
        }
    }

    function inspect() {//осматриваем комнату в поисках вора
        server.action('inspect').done(function (data) {
            if (data) {
                if (typeof (data) === 'string') {
                    span = "<span id='span'>" + data + "</span>";
                    $('#screen').append(span);
                    $('#command').val("");
                    setTimeout(function () { $('#span').remove(); }, 2000);
                }
                if (typeof (data.action) !== 'string') {
                    fillStatBar(data);
                    span = "<span id='span'>" + "Вы немного увеличили опыт!" + "</span>";
                    $('#screen').append(span);
                    $('#command').val("");
                    setTimeout(function () { $('#span').remove(); }, 2000);
                } else {
                    span = "<span id='span'>" + "Кажется, вы нашли вора( " + data.action + " )" + "</span>";
                    $('#screen').append(span);
                    setTimeout(function () { $('#span').remove(); }, 2000);
                }
            }
        });
    }

    function toKnowResultCop(nickname) {
        if (nickname) {
            server.action('toKnowResultCop', null, nickname).done(function (data) {
                if (data) {
                    if (typeof (data.action) === 'string') {
                        var span = "<span id='span'>" + data.action + "</span>";
                        $('#screen').append(span);
                        $('#command').val("");
                        fillStatBar(data);
                        setTimeout(function () { $('#span').remove(); }, 2000);
                    }
                }
            });
            return;
        }
        server.action('toKnowResultCop').done(function (data) {
            if (data) {
                if (typeof (data.action) === 'object') {
                    if (player.exp <= data.action.exp) {
                        span = "<span id='span'>" + "Вас пытались пожопить, но не смогли!" + "</span>";
                        $('#screen').append(span);
                        $('#command').val("");
                        fillStatBar(data);
                        setTimeout(function () { $('#span').remove(); }, 2000);
                    }
                    if (player.exp <= data.action.exp) {
                        span = "<span id='span'>" + "Вас пожопили!" + "</span>";
                        $('#screen').append(span);
                        $('#command').val("");
                        fillStatBar(data);
                        setTimeout(function () { $('#span').remove(); }, 2000);
                    }
                }
            }
        });
    }

    function grieve() {//пожопить
        var nickname = $('#command').val();
        server.action('grieve', null, nickname).done(function (data) {
            if (data) {
                if (typeof (data) === 'string') {
                    span = "<span id='span'>" + data + "</span>";
                    $('#screen').append(span);
                    $('#command').val("");
                    setTimeout(function () { $('#span').remove(); }, 2000);
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
                            toKnowResultCop(nickname);
                        });
                }
                if (typeof (data.action) === 'string') {
                    span = "<span id='span'>" + data.action + "</span>";
                    $('#screen').append(span);
                    $('#command').val("");
                    setTimeout(function () { $('#span').remove(); }, 2000);
                }
            }
        });
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
        createButtons();
        actionsHundler();
    }

    this.getType = function () {
        return player.type;
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
                var elem = "<ol>" + "Вам бросили предъяву, подождите 10 секунд: " + sec + "</ol>";
                $('#listSec').append(elem);
            }, function () {
                $('#listSec').remove();
                $('#command').val("");
                toKnowResultCop();
                startGettingStatus();
            });
        }
        normal();
    };

    init();
}