function Interaction(players, player) {

    this.ppl = players;
    this.player = player;

    this.getletters = function() {
        //получаем письма с серва и сохраняем их
        //...
        var mail = letters;
        return mail;
    }

    this.writeletters = function (letters) {
        var mail = letters;
        for(var i = 0; i < mail.length; i++) {
            var elem = '<p style="margin-bottom: 5px;">' + mail[i].name + ': ' + mail[i].letter + '</p>';
        }
    }

    this.giveletter = function (mail) {
        var letter = mail;
        //отправляем на серв
        // 
    }


    //добавление игроков в чат
    this.addPpl = function () {
        for(var i = 0; i < this.ppl.length; i++) {
            var elem = '<p style="margin-bottom: 5px;">' + this.ppl[i].name + '</p>';
            $("#room").append(elem);
        }
    }
    
    //вывод, написанного письма, в чат
    this.send = function (letter) {
        var mail = letter;
        //выводим его в чат
        var elem = '<p style="margin-bottom: 5px;">' + mail.name + ': ' + mail.letter + '</p>';
        $("#letters").append(elem)
        
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
    var inter = new Interaction(Array({ name: 'Petya' }, { name: 'Vasya' }), { name: 'Vasya' });
    
    //функции в интервал(?)
    var letters = inter.getletters();//получаем письма с сервака и запоминаем их
    inter.writeletters(letters);//выносим письма, полученные с серва на экран
    ///////////////////////
    var player = inter.player.name;
    

    inter.fillStatBar();
    $("#command").on('keypress', function (event)   { inter.command();      });
    $("#checkPpl").on('click', function (event)     { inter.addPpl();       });
    $("#send").on('click', function (event) {
        var mail = {
            name: player,
            letter: $("#chatting").val(),
        };
        if (mail.letter != '') {
            inter.send(mail); //выводим написанное письмо на экран
            inter.giveletter(mail);  //отправляет его на серв
            $("#chatting").val("");
        } 
    });
    $("#moves").on('click', function (event)     { inter.move();         });
    $("#giveaway").on('click', function (event) { inter.giveaway(); });
    $("#classFuncOne").on('click', function (event) { inter.classFuncOne(); });
    $("#classFuncTwo").on('click', function (event) { inter.classFuncTwo(); });

}
