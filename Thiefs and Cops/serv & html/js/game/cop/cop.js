function Cop(data, _server) {

    var timer = new Timer();
    var server = _server;

    var player = data.player;
    var rang = data.rang;
    var nickname = data.nickname;
    var interval;

    function createButtons() {
        $('#actions').html("");
        $('#actions').append('<input id="movesCop"  type="button" class="btn btn-secondary action-buttons" value="Перейти" />');
        $('#actions').append('<input id="payTax"    type="button" class="btn btn-secondary action-buttons" value="Заплатить налоги" />');
        $('#actions').append('<input id="inspect"   type="button" class="btn btn-secondary action-buttons" value="Осмотреться" />');
        $('#actions').append('<input id="grieve"    type="button" class="btn btn-secondary action-buttons" value="Пожопить" />');
        $('#actions').append('<input id="logoutCop" type="button" class="btn btn-secondary action-buttons" value="Выход" />');
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

    function inspect() {//осматриваем комнату в поисках вора
        server.action('inspect', null, null).done(function (data) {
            if (data) {
                if (typeof (data.action) !== 'string') {
                    fillStatBar(data);
                    $('#screen').html("Вы немного увеличили опыт!");
                    $('#command').val("");
                    setTimeout(function () { $('#screen').html(""); }, 2000);
                } else {
                    $('#screen').html("Кажется, вы нашли вора( " + data.action + " )");
                    setTimeout(function () { $('#screen').html(""); }, 2000);
                }
            }
        });
    }

    function toKnowResultCop(nickname) {
        server.action('toKnowResultCop', null, nickname).done(function (data) {
            if (data) {
                if (typeof (data.action) === 'string') {
                    $('#screen').html(data.action);
                    $('#command').val("");
                    fillStatBar(data);
                    setTimeout(function () { $('#screen').html(""); }, 2000);

                }
            }
        });
    }

    function grieve() {//пожопить
        var nickname = $('#command').val();
        server.action('grieve', null, nickname).done(function (data) {
            if (data) {
                if (typeof (data.action) === 'boolean') {
                    timer.start(10,
                        function (sec) {
                            $('#screen').html("Предъява брошена, у вас есть 10 секунд: " + sec);
                        },
                        function () {
                            $('#screen').html("");
                            $('#command').val("");
                            toKnowResultCop(nickname);
                        });
                }
                if (typeof (data.action) === 'string') {
                    $('#screen').html(data.action);
                    $('#command').val("");
                    setTimeout(function () { $('#screen').html(""); }, 2000);
                }
            }
        });
    }

    function inFight() {
        $('#movesCop').prop('disabled', true);
        $('#payTax').prop('disabled', true);
        $('#inspect').prop('disabled', true);
        $('#grieve').prop('disabled', true);
        $('#logoutCop').prop('disabled', true);
    }
    function normal() {
        $('#movesCop').prop('disabled', false);
        $('#payTax').prop('disabled', false);
        $('#inspect').prop('disabled', false);
        $('#grieve').prop('disabled', false);
        $('#logoutCop').prop('disabled', false);
    }

    function getStatus() {
        server.getStatus().done(function (data) {
            if (data) {
                console.log(data);
                if (data === "жопит") {
                    inFight();
                    return;
                }
                normal();
            }
        });
    }

    function actionsHundler() {
        $('#movesCop').on('click', toRoom);
        $('#payTax').on('click', giveMoney);
        $('#inspect').on('click', inspect);
        $('#grieve').on('click', grieve);
    }

    function init() {
        var row = "<tr><th>" + "nickname: " + nickname + "</th> <th>" + "type: " + player.type + "</th> <th>" + "rang: " + rang + "</th> <th>" + "exp: " + player.exp + "</th> <th>" + "money: " + player.money + "</th> </tr>";
        $("#bodytbl").html(row);//заполняем "статбар" игрока
        createButtons();
        actionsHundler();
        interval = setInterval(getStatus, 3000);
    }

    this.stopGetStatus = function () {
        clearInterval(interval);
    };

    init();
}