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
            count = seconds;
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
    var intervalStatus;
    var intervalRoom;

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

    function setImg(type) {
        if (type) {
            $('body').removeClass('thief');
            $('body').removeClass('human');
            $('body').removeClass('cop');
            $('body').removeClass('signIn');
            $('body').addClass(type);
        }        
    }

    function getRoom(id_room) {//получить данные о комнате
        if(id_room) {
            server.getRoom(id_room).done(function (data) {
                if(data) {
                    $("#room").empty();//чистим содержимое комнаты
                    $("#nameRoom").empty();
                    room = data.room;
                    var players = data.players;//игроки в комнате
                    var nicknames = data.nicknames;//их ники
                    var span = "<span class='span'>" + "&nbsp" + room.name + ":" + "</span>";
                    $('#nameRoom').append(span);//выводим название комнаты
                    for(var i = 0; i < nicknames.length; i++) {
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
                    var span = "<span class='span'>Можно выйти в следующие комнаты: </span><br />";
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

    function startGame() {
        server.startGame().done(function (data) {
            if (data) {
                $("#bodytbl").empty();
                //проверка на тип
                if (data.player.type === "thief") {
                    setImg("thief");
                    player = new Thief({ data: data, server: server, callbacks: { startGettingStatus: startGettingStatus, startGettingRoom: startGettingRoom, changeType: changeType } });
                }
                if (data.player.type === "cop") {
                    setImg("cop");
                    player = new Cop({ data: data, server: server, callbacks: { changeType: changeType } });
                }
                if (data.player.type === "human") {
                    setImg("human");
                    player = new Human({ data: data, server: server, callbacks: { changeType: changeType } });
                }
                getRoom(data.player.id_room);
                getWays(data.player.id_room);
                var type;
                if (data.player.type === "thief") { type = "вор"; }
                if (data.player.type === "cop") { type = "коп"; }
                if (data.player.type === "human") { type = "чтите закон"; }
                var row = "<tr><th>" + "Вас зовут: " + data.nickname + "</th> <th>" + "Вы " + type + " по жизни" + "</th> <th>" + "Ваш ранг: " + data.rang + "</th> <th>" + "Кол-во Вашего опыта: " + data.player.exp + "</th> <th>" + "Ваши деньги: " + data.player.money + "</th> </tr>";
                $("#bodytbl").append(row);//заполняем "статбар" игрока
                exitHandler(data.player.type);//обработчик выхода
                intervalStatus = setInterval(getStatus, 3000);
                intervalRoom = setInterval(getRoom, 3000, player.id_room);
                
            }
        });
    }

    function logout() {
        logoutSuccess();
        $('#command').val("");
        $('#bodytbl').empty();
        clearInterval(intervalStatus);
        clearInterval(intervalRoom);
    }

    function exitHandler(type) {//обработчик выхода
        switch (type) {
            case "thief":
                $('#logoutThief').on('click', function () {
                    server.finishGame().done(function () {
                        setImg(type);
                        logout();
                    });
                    off(type);
                });
                break;
            case "cop":
                $('#logoutCop').on('click', function () {
                    server.finishGame().done(function () {
                        setImg(type);
                        logout();
                    });
                    off(type);
                });
                break;
            case "human":
                $("#logoutHuman").on('click', function () {
                    server.finishGame().done(function () {
                        setImg(type);
                        logout();
                    });
                    off(type);
                });
                break;
        }
    }

    function startGettingStatus() {
        intervalStatus = setInterval(getStatus, 3000);
    }
    function startGettingRoom(id_room) {
        intervalRoom = setInterval(getRoom, 3000, id_room);
    }
    
    function getStatus() {
        server.getStatus().done(function (data) {
            if (data) {
                if (player.getType() === "thief") {
                    console.log(data);
                    if (data === "жопят") {
                        player.getStatus(data);
                        clearInterval(intervalStatus);
                        return;
                    } else {
                        player.getStatus(data);
                    }
                }
                if (player.getType() === "cop") {
                    player.getStatus(data);
                }
                if (player.getType() === "human") {
                    player.getStatus(data);
                }
            }
        });
    }

    function changeType(type) {
        off(player.getType());
        clearInterval(intervalStatus);
        server.action("changeType", null, null, null, (type) ? type : null).done(function (data) {
            if (data.action) {
                clearInterval(intervalRoom);
                startGame();
            }
        });
    }

    this.init = function () {
        startGame();
    };
}