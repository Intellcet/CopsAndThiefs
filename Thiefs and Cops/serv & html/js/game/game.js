function Game(options) {

    var server = options.server;
    var logoutSuccess = (options && options.callbacks && options.callbacks.logout instanceof Function) ? options.callbacks.logout : function () { };

    var token = null;
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

    function hideShowButtons(type) {//показываем/скрываем нужные и ненужные кнопки
        switch (type) {
            case "cop":
                $('#cop').show();
                break;
            case "thief":
                $('#thief').show();
                $('#lawyer').prop('disabled', true);
                break;
            case "human":
                $('#human').show();
                break;
            default:
                $('#thief').hide();
                $('#human').hide();
                $('#cop').hide();
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

    function toRoom() {//двигаемся в другую комнату
        var name_room = $('#command').val();//получаем значение с командной строки, куда двигаться
        server.toRoom(name_room).done(function (data) {
            if (data) {
                getRoom(data.id);
            }
        });
    }

    function giveMoney() {//отдаем деньги
        var money = $('#command').val() - 0;
        if (!isNaN(money)) {
            server.action('giveaway', money).done(function (data) {
                if (data) {
                    $('#bodytbl').html("");
                    var row = "<tr><th>" + nickname + "</th> <th>" + data.rang + "</th> <th>" + data.money + "</th> </tr>";
                    $("#bodytbl").html(row);
                    $('#command').val("");
                }
            });
        }
    }

    function steal() {//крадем деньги
        var nickname = $('#command').val();
        if (nickname) {
            server.action('steal', null, nickname).done(function (data) {
                console.log(data);
                if (data) {
                    $('#bodytbl').html("");
                    var row = "<tr><th>" + nickname + "</th> <th>" + data.rang + "</th> <th>" + data.money + "</th> </tr>";
                    $("#bodytbl").html(row);
                    $('#command').val("");
                }
            });
        }
    }

    function search() {//обыскиваем комнату
        server.action('search').done(function (data) {
            if (data) {
                $('#bodytbl').html("");
                var row = "<tr><th>" + nickname + "</th> <th>" + data.rang + "</th> <th>" + data.money + "</th> </tr>";
                $("#bodytbl").html(row);
                $('#command').val("");
            }
        });
    }

    function lawyer() {//вызываем адвоката
        var money = $('#command').val() - 0;
        if (!isNaN(money)) {
            server.action('lawyer', money).done(function (data) {
                if (data) {
                    //???
                }
            });
        }
    }

    function inspect() {//осматриваем комнату в поисках вора
        var nickname = $('#command').val();
        if (nickname) {
            server.action('inspect', null, nickname).done(function (data) {
                if (data) {
                    if (!isNaN(data)) {
                        $('.screen').html("Вы немного увеличили опыт!")
                    } else {
                        $('.screen').html("Кажется, вы нашли вора( " + data + " )")
                    }
                }
            });
        }
    }

    function suffer() {//страдаем за терпилу
        server.action('suffer', null, null).done(function (data) {
            if (data) {
                if (data.money <= 1000) {
                    $('#bodytbl').html("");
                    var row = "<tr><th>" + nickname + "</th> <th>" + data.rang + "</th> <th>" + data.money + "</th> </tr>";
                    $("#bodytbl").html(row);
                }
            }
        });
    }

    function actionHandler(type) {//обработчик действий
        switch (type) {
            case "thief":
                $('#movesThief').on('click', function (event) {//вешаем событие на кнопку "перейти"
                    toRoom();
                });
                $('#giveaway').on('click', function (event) {//вешаем событие на кнопку "сдать в общак"
                    giveMoney();
                });
                $('#steal').on('click', function (event) {
                    steal();
                });
                $('#search').on('click', function (event) {
                    search();
                });
                $('#lawyer').on('click', function (event) {
                    lawyer();
                });
                break;
            case "cop":
                $('#movesCop').on('click', function (event) {
                    toRoom();
                });
                $('#payTax').on('click', function (event) {
                    giveMoney();
                });
                $('#inspect').on('click', function (event) {
                    inspect();
                });
                break;
            case "human":
                $('#suffer').on('click', function (event) {
                    suffer();
                });
                $('#sufferBit').on('click', function (event) {
                    suffer();
                });
                $('#sufferMore').on('click', function (event) {
                    suffer();
                });
        }
    }

    function startGame() {
        server.startGame().done(function (data) {
            if (data) {
                hideShowButtons();
                player = data.player;
                nickname = data.nickname;
                getRoom(player.id_room);
                var row = "<tr><th>" + nickname + "</th> <th>" + player.rang + "</th> <th>" + player.money + "</th> </tr>";
                $("#bodytbl").html(row);//заполняем "статбар" игрока
                hideShowButtons(player.type);//прячем ненужные кнопки, показываем нужные
                actionHandler(player.type);//обработчик всех действий
                exitHandler(player.type);//обработчик выхода
                interval = setInterval(function () {//интервал, получающий статус
                    if (player.status === "жопят") {
                        $('#lawyer').prop('disabled', false);
                        clearInterval(interval);
                    }
                }, 3000);
            }
        });
    }

    function logout() {
        logoutSuccess();
        $('#command').val("");
        $('#bodytbl').html("");
    }

    function exitHandler(type) {//обработчик выхода
        switch (type) {
            case "thief":
                $('#logoutThief').on('click', function () {
                    server.finishGame().done(function () {
                        logout();
                        clearInterval(interval);
                    });
                    off(type);
                });
                break;
            case "cop":
                $('#logoutCop').on('click', function () {
                    server.finishGame().done(function () {
                        logout();
                        clearInterval(interval);
                    });
                    off(type);
                });
                break;
            case "human":
                $("#logoutHuman").on('click', function () {
                    server.finishGame().done(function () {
                        logout();
                        clearInterval(interval);
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