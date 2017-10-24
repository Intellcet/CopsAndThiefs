function Intercation(players, player) {

    this.ppl = players;
    this.player = player;
    //добавление игроков в чат
    this.addPpl = function () {
        for(var i = 0; i < this.ppl.length; i++) {
            var elem = '<p style="margin-bottom: 5px;">' + this.ppl[i].login + '</p>';
            $("#room").append(elem);
        }
    }
    //отправить письмо на серв; вывод писем в чат
    this.send = function () {
        //получаем письма с серва
        //...
        var letter = $("#chatting").val(); //сохраняем письмо
        //выводим его в чат
        var elem = '<p style="margin-bottom: 5px;">' + this.player.login + ': ' + letter + '</p>';
        $("#letters").append(elem);
        //отправляем на серв
        // 
    }
    //взаимодействия с кнопками
    this.command = function () {
        //получаем команду
        var command = $("#command").val();
        if(command) {
            //отправляем команду на серв
            //.........................
            //получаем ответ от серва
            console.log(command);
        }
    }
    //заполнить статбар
    this.fillStatBar = function () {
        //получаем с сервака инфу об игроке(ник, текущий уровень, количество денег)
        var user = {
            name: "Вася",
            lvl: "Карманник",
            money: "100500 голд"
        }
        var row = "<tr><th>" + user.name + "</th> <th>" + user.lvl + "</th> <th>" + user.money + "</th> </tr>";

        $(row).prependTo("#tbl > tbody");
    }
    //кнопка перемещения
    this.move = function () {
        console.log('О чудо! Вы двигаетесь!');
    }
    //кнопка отдать в общак
    this.giveaway = function () {
        console.log('Вы сдали деньги в общак!');
    }
    //кнопка первая классовая функция
    this.classFuncOne = function () {
        console.log('Вы использовали первую классовую способность!');
    }
    //кнопка вторая классовая функция
    this.classFuncTwo = function () {
        console.log('Вы использовали вторую классовую способность!');
    }
}

window.onload = function () {
    var inter = new Intercation(Array({ login: 'Petya' }, { login: 'Vasya' }), { login: 'Vasya' });
    inter.fillStatBar();
    $("#command").on('keypress', function (event) { inter.command(); });
    $("#btn1").on('click', function (event) { inter.addPpl();        });
    $("#btn2").on('click', function (event) { inter.send()           });
    $("#btn3").on('click', function (event) { inter.move();          });
    $("#btn4").on('click', function (event) { inter.giveaway();      });
    $("#btn5").on('click', function (event) { inter.classFuncOne();  });
    $("#btn6").on('click', function (event) { inter.classFuncTwo();  });

}
