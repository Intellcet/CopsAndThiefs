function Timer() {
    var interval;
    var count = 0;

    function clear() {
        if (interval) {
            clearInterval(interval);
            interval = null;
            count = 0;
        }
    }

    this.start = function (seconds, everySecondCb, finishCb) {
        clear();
        if (seconds > 0) {
            count = seconds
            interval = setInterval(function () {
                count--;
                everySecondCb(count);
                if (count <= 0) {
                    clear();
                    finishCb();
                }
            }, 1000);
        }
    };
}

function Game(options) {

    var server = options.server;
    var logoutSuccess = (options && options.callbacks && options.callbacks.logout instanceof Function) ? options.callbacks.logout : function () { };

    var player;
    var nickname;
    var room;
    var interval;

    function off(type) {//выключаем кнопки
        switch (type) {
            case "thief":
                $('#movesThief').off('click');
                $('#giveaway').off('click');
                $('#steal').off('click');
                $('#search').off('click');
                $('#lawyer').off('click');
                break;
            case "cop":
                $('#movesCop').off('click');
                $('#payTax').off('click');
                $('#inspect').off('click');
                $('#grieve').off('click');
                break;
            case "human":
                $('#suffer').off('click');
                $('#sufferBit').off('click');
                $('#sufferMore').off('click');
                break;
        }
    }

    function getRoom(id_room) {//получить данные о комнате
        if(id_room) {
            server.getRoom(id_room).done(function (data) {
                if(data) {
                    $("#room").html('');//чистим содержимое комнаты
                    room = data.room;
                    var players = data.players;//игроки в комнате
                    var nicknames = data.nicknames;//их ники
                    $('#nameRoom').html("&nbsp" + room.name + ":");//выводим название комнаты
                    for(var i = 0; i < nicknames.length; i++) {
                        var elem = '<p style="margin-bottom: 5px;">' + nicknames[i] + '</p>';
                        $("#room").append(elem);//выводим ники игроков на экран
                    }
                }
            });
        }
    }

    function startGame() {
        server.startGame().done(function (data) {
            if (data) {
                //проверка на тип
                if (data.player.type === "thief") {
                    player = new Thief(data, server);

                }
                if (data.player.type === "cop") {
                    player = new Cop(data, server);
                }
                if (data.player.type === "human") {
                    player = new Human(data, server);
                }
                getRoom(data.player.id_room);
                var row = "<tr><th>" + "nickname: " + data.nickname + "</th> <th>" + "type: " + data.player.type + "</th> <th>" + "rang: " + data.rang + "</th> <th>" + "exp: " + data.player.exp + "</th> <th>" + "money: " + data.player.money + "</th> </tr>";
                $("#bodytbl").html(row);//заполняем "статбар" игрока
                exitHandler(data.player.type);//обработчик выхода
            }
        });
    }

    function logout() {
        logoutSuccess();
        $('#command').val("");
        $('#bodytbl').html("");
        player.stopGetStatus();
    }

    function exitHandler(type) {//обработчик выхода
        switch (type) {
            case "thief":
                $('#logoutThief').on('click', function () {
                    server.finishGame().done(function () {
                        logout();
                    });
                    off(type);
                });
                break;
            case "cop":
                $('#logoutCop').on('click', function () {
                    server.finishGame().done(function () {
                        logout();
                    });
                    off(type);
                });
                break;
            case "human":
                $("#logoutHuman").on('click', function () {
                    server.finishGame().done(function () {
                        logout();
                    });
                    off(type);
                });
                break;
        }
    }

    this.init = function () {
        startGame();
    };
}