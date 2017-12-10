function Human(data, _server) {

    var server = _server;

    var player = data.player;
    var rang = data.rang;
    var nickname = data.nickname;
    var interval;

    function createButtons() {
        $('#actions').html("");
        $('#actions').append('<input id="suffer"      type="button" class="btn btn-secondary action-buttons" value="Потерпеть" />');
        $('#actions').append('<input id="sufferBit"   type="button" class="btn btn-secondary action-buttons" value="Потерпеть немного" />');
        $('#actions').append('<input id="sufferMore"  type="button" class="btn btn-secondary action-buttons" value="Потерпеть еще чуть-чуть" />');
        $('#actions').append('<input id="logoutHuman" type="button" class="btn btn-secondary action-buttons" value="Выход" />');
    }

    function fillStatBar(data) {
        $('#bodytbl').html("");
        var row = "<tr><th>" + "nickname: " + data.nickname + "</th> <th>" + "type: " + data.player.type + "</th> <th>" + "rang: " + data.rang + "</th> <th>" + "exp: " + data.player.exp + "</th> <th>" + "money: " + data.player.money + "</th> </tr>";
        $("#bodytbl").html(row);
    }

    function suffer() {//страдаем за терпилу
        server.action('suffer', null, null).done(function (data) {
            if (data) {
                if (typeof (data.action) === 'object') {
                    if (data.money <= 1000) {
                        fillStatBar(data);
                    }
                }
                if (typeof (data.action) === 'string') {
                    $('#screen').html(data.action);
                    $('#suffer').prop('disabled', true);
                    $('#sufferBit').prop('disabled', true);
                    $('#sufferMore').prop('disabled', true);
                    setTimeout(function () { $('#screen').html(""); }, 2000);
                }
            }
        });
    }

    function actionsHundler() {
        $('#suffer').on('click', suffer);
        $('#sufferBit').on('click', suffer);
        $('#sufferMore').on('click', suffer);
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