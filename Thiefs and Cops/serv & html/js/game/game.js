function Game(options) {

    var server = options.server;
    var logoutSuccess = (options && options.callbacks && options.callbacks.logout instanceof Function) ? options.callbacks.logout : function () { };

    var token = null;
    var player;
    var nickname;
    var room;


    //двигаемся в другую комнату
    function toRoom(token) {
        if(token) {
            $('#moves').on('click', function (event) {//вешаем событие на кнопку "перейти"
                var name_room = $('#command').val();//получаем значение с командной строки, куда двигаться
                server.toRoom(token, name_room).done(function (data) {
                    if(data) {
                        getRoom(data.id);
                    }
                });
            });
        }
    }

    //получить данные о комнате
    function getRoom(id_room) {
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

    function startGame(token) {
        if(token) {
            server.startGame(token).done(function (data) {
                if(data) {
                    player = data.player;
                    nickname = data.nickname;
                    var row = "<tr><th>" + nickname + "</th> <th>" + player.rang + "</th> <th>" + player.money + "</th> </tr>";
                    $(row).prependTo("#tbl > tbody");//заполняем "статбар" игрока
                    if(player.type === "cop") {//в зависимости от роли игрока меняем значения кнопок
                        $('#giveaway').val('Заплатить налоги');
                        $('#classFuncOne').val('Пожопить');
                        $('#classFuncTwo').val('Осмотреться');
                    }
                    if(player.type === "thief") {
                        $('#classFuncOne').val('Украсть');
                        $('#classFuncTwo').val('Адвокат');
                    }
                    if(player.type === "human") {
                        $('#moves').val('Терпеть!');
                        $('#giveaway').val('Терпеть!');
                        $('#classFuncOne').val('Терпеть!');
                        $('#classFuncTwo').val('Терпеть!');
                    }
                    getRoom(player.id_room);
                }
            });
        }
    }

    function finishGame(token) {
        $('#logout').on('click', function () {
            server.finishGame(token).done(function () {
                logoutSuccess(token);
            });
        });
    }

    this.init = function (_token) {
        token = _token;
        startGame(token);
        toRoom(token);
        finishGame(token);
    };

}