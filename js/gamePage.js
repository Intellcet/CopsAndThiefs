//добавление игроков в чат
function addPpl(players) {
    //сюда по идее приходит список игроков с сервера
    for(var i = 0; i < players.length; i++) {
        var elem = '<p style="margin-bottom: 5px;">' + players[i].login + '</p>';
        $("#room").append(elem);
    }
}

function send(player) {
    //получаем письма с серва
    //...
    var letter = $("#chatting").val(); //сохраняем письмо
    //выводим его в чат
    var elem = '<p style="margin-bottom: 5px;">' + player.login + ': ' + letter + '</p>';
    $("#letters").append(elem);
    //отправляем на серв
    // 

}

function command() {
    //получаем команду
    var command = $("#command").val();
    if(command) {
        //отправляем команду на серв
        //.........................
        //получаем ответ от серва
        console.log(command);
    }
}

function fillStatBar() {
    //получаем с сервака инфу об игроке(ник, текущий уровень, количество денег)
    var user = {
        name: "Вася",
        lvl: "Карманник",
        money: "100500 голд"
    }
    var row = "<tr><th>" + user.name + "</th> <th>" + user.lvl + "</th> <th>" + user.money + "</th> </tr>";

    $(row).prependTo("#tbl > tbody");

}

function move() {
    console.log('О чудо! Вы двигаетесь!');
}

function giveaway() {
    console.log('Вы сдали деньги в общак!');
}

function classFuncOne() {
    console.log('Вы использовали первую классовую способность!');
}

function classFuncTwo() {
    console.log('Вы использовали вторую классовую способность!');
}

