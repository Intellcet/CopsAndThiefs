function Chat(options) {

    var server = options.server;
    var interval;

    function getMessages() {
        server.getMessages().done(function (result) {
            if (result) {
                var str = '';
                for (var i = 0; i < result.length; i++) {
                    str += '<b>' + result[i].nickname + '</b>:&nbsp' + result[i].text + '<br>';
                }
                $('#letters').empty();
                $('#letters').append(str);
            }
        });
    }

    this.getMessages = getMessages;

    this.deinit = function () {
        $('#send').off('click');
        clearInterval(interval);
    };

    this.init = function () {
        interval = setInterval(getMessages, 3000);
        $('#send').on('click', function () {
            var text = $('#chatting').val();
            if (text) {
                server.setMessage(text).done(function () {
                    getMessages();
                });
            }
            $('#chatting').val('');
        });
    };
}