function Human(options) {

    var server = options.server;

    var player = options.data.player;
    var rang = options.data.rang;
    var nickname = options.data.nickname;

    var changeType = (options && options.callbacks && options.callbacks.changeType instanceof Function) ? options.callbacks.changeType : function () { };

    var span = "";

    function createButtons() {
        $('#actions').empty();
        $('#actions').append('<input id="suffer"      type="button" class="btn btn-secondary action-buttons" value="Потерпеть" />');
        $('#actions').append('<input id="sufferBit"   type="button" class="btn btn-secondary action-buttons" value="Потерпеть в другой комнате" />');
        $('#actions').append('<input id="sufferMore"  type="button" class="btn btn-secondary action-buttons" value="Потерпеть еще чуть-чуть" />');
        $('#actions').append('<input id="changeType"  type="button" class="btn btn-secondary action-buttons" value="Сменить класс" />');
        $('#actions').append('<input id="logoutHuman" type="button" class="btn btn-secondary action-buttons" value="Выход" />');
    }

    function fillStatBar(data) {
        $('#bodytbl').empty();
        var row = "<tr><th>" + "Вас зовут: " + data.nickname + "</th> <th>" + "Вы чтите закон по жизни " + "</th> <th>" + "Ваш ранг: " + data.rang + "</th> <th>" + "Кол-во Вашего опыта: " + data.player.exp + "</th> <th>" + "Ваши деньги: " + data.player.money + "</th> </tr>";
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

    function suffer() {//страдаем за терпилу
        server.action('suffer', null, null).done(function (data) {
            if (data) {
                if (typeof (data) === 'string') {
                    span = "<span id='span'>" + data + "</span>";
                    $('#screen').append(span);
                    $('#command').val("");
                    setTimeout(function () { $('#span').remove(); }, 2000);
                }
                if (typeof (data.action) === 'object') {
                    if (data.action.money <= 2000) {
                        fillStatBar(data);
                    }
                }
                if (typeof (data.action) === 'string') {
                    span = "<span id='span'>" + data.action + "</span>";
                    $('#screen').append(span);
                    changeClass();
                    setTimeout(function () { $('#span').remove(); }, 2000);
                }
            }
        });
    }

    function change() {
        type = $('#command').val();
        if (type) {
            changeType(type);
        } else {
            span = "<span id='span'>" + "Введите тип!" + "</span>";
            $('#screen').append(span);
            setTimeout(function () { $('#span').remove(); }, 2000);
        }
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

    function actionsHundler() {
        $('#suffer').on('click', suffer);
        $('#sufferBit').on('click', toRoom);
        $('#sufferMore').on('click', suffer);
        $('#changeType').on('click', change);
    }

    function init() {
        createButtons();
        if (player.status === "терпите") {
            normal();
        }
        if (player.status === "смените тип") {
            changeClass();
        }
        actionsHundler();
    }

    this.getType = function () {
        return player.type;
    };

    this.getStatus = function (data) {
        if (data === "жопят") {
            span = "<span id='span'>" + "Вас жопят!" + "</span>";
            $('#screen').append(span);
            setTimeout(function () { $('#span').remove(); }, 2000);
            return;
        }
    };

    init();
}