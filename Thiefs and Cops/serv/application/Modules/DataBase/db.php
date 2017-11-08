<?php

    require_once(MODULES . 'baseModule.php');

    class DB extends BaseModule {

        private $url = 'localhost';
        private $user = 'root';
        private $password = '';

        private $host;
        private $db;


        function __construct($mediator) {
            parent::__construct($mediator);
            /*$type = $this->mediator->getTriggerTypes();
            $this->mediator->registerTrigger($type->GET_USER , function($param) {
                $user = Array('login' => $param['login'], 'pass' => $param['pass']);
                return $user;
            });
            $this->mediator->registerTrigger($type->SET_TOKEN, function($param) { return $param; });*/
            $this->host = mysqli_connect($this->url, $this->user, $this->password);
            if (!$this->host) {
                die('Ошибка соединения: ' . mysqli_error());
            }
            $this->db = mysqli_select_db($this->host, 'copsandthiefs');
        }

        function __destruct() {
            mysqli_close($this->host);
        }

        private function isUniqUser($login) {//проверка уникальности пользователя по логину
            $query = "SELECT * " . "FROM user " . "WHERE login='" . $login . "'";
            $result = mysqli_query($this->host, $query);
            $res = null;
            while ($row = mysqli_fetch_object($result)) {
                if ($row){
                    return false;
                }
            }
            return true;
        }


        public function getUser($login, $password) {//получаем пользователя
            $query = "SELECT * " . "FROM user " . "WHERE login='" . $login . "' AND password='" . $password . "'";
            $result = mysqli_query($this->host, $query);
            $res = null;
            while ($row = mysqli_fetch_object($result)) {
                $res = $row;
                break;
            }
            return $res;
        }

        public function updateUserToken($id, $token) {//обновляем токен пользователя
            $query = "UPDATE user SET token = '" . $token . "' WHERE id=" . $id;
            mysqli_query($this->host, $query);
            return true;
        }

        public function setUser($login, $password, $nickname) {//добавляем в бд пользователя
            if ($this->isUniqUser($login)) {//если пользователь уникален (проверка по логину)
                $query = "INSERT INTO user (login, password, nickname) VALUES ('" . $login . "', '" . $password . "', '" . $nickname . "')";
                mysqli_query($this->host, $query);
                return true;
            }
            return false;
        }

        public function getMessages($count, $offset) {//получаем письма
            $query = "SELECT * " . "FROM message " . " LIMIT " . $count . " OFFSET " .  $offset;
            $result = mysqli_query($this->host, $query);
            $res = Array();
            while ($row = mysqli_fetch_object($result)) {
                $res[] = $row;
            }
            return $res;
        }

        public function sendMessage($id_user, $text) {//отправляем в бд письмо
            $query = "INSERT INTO message (id_user, text, date_time) VALUES ('" . $id_user . "', '" . $text . "', NOW())";
            mysqli_query($this->host, $query);
            return true;
        }

        public function getItemUser($id_user, $type, $name){//получаем артефакт пользователя
            $query = "SELECT * " . "FROM item " . "WHERE id_user='" . $id_user . "'AND type='" . $type . "' AND name='" . $name . "'";
            $result = mysqli_query($this->host, $query);
            $res = null;
            while ($row = mysqli_fetch_object($result)) {
                $res = $row;
                break;
            }
            return $res;
        }

        public function getItemsUser($id_user){//получаем все артефакты пользователя
            $query = "SELECT * " . "FROM item " . "WHERE id_user='" . $id_user . "'";
            $result = mysqli_query($this->host, $query);
            $res = Array();
            while ($row = mysqli_fetch_object($result)) {
                $res[] = $row;
            }
            return $res;
        }

        public function getItemsRoom($id_room){//получаем все артефакты в комнате
            $query = "SELECT * " . "FROM item " . "WHERE id_user='" . $id_room . "'";
            $result = mysqli_query($this->host, $query);
            $res = Array();
            while ($row = mysqli_fetch_object($result)) {
                $res[] = $row;
            }
            return $res;
        }

        public function setItem($id_room, $type, $cost, $name){//создаем артефакт
            $query = "INSERT INTO item (id_room, form, cost, title) VALUES ('" . $id_room . "', '" . $type . "', '" . $cost . "', '" . $name . "')";
            mysqli_query($this->host, $query);
            return true;
        }

        public function getRoom($id){//получаем комнату
            $query = "SELECT * " . "FROM room " . "WHERE id='" . $id . "'";
            $result = mysqli_query($this->host, $query);
            $res = null;
            while ($row = mysqli_fetch_object($result)) {
                $res = $row;
                break;
            }
            return $res;
        }

        public function updateDescriptionRoom($id, $description){//обновляем описание комнаты
            if ($description){
                $query = "UPDATE room SET description='". $description ."' WHERE id='". $id ."'";
                mysqli_query($this->host, $query);
                return true;
            }
            return false;
        }

        public function setRoom($name, $description = null){//создаем новую комнату
            if ($name){
                $query = "INSERT INTO room (name, description) VALUES ('" . $name . "', '" . $description . "')";
                mysqli_query($this->host, $query);
                return true;
            }
            return false;
        }

        public function getWay($id_from, $id_to) {//получаем путь
             $query = "SELECT * " . "FROM way " . "WHERE id_from='" . $id_from . "' AND id_to='". $id_to ."'";
             $result = mysqli_query($this->host, $query);
             $res = null;
             while ($row = mysqli_fetch_object($result)) {
                 $res = $row;
                 break;
             }
             return $res;
        }

        public function setWay($id_from, $id_to) {//создаем новый путь
            if ($id_from && $id_to) {
                $query = "INSERT INTO way (id_from, id_to) VALUES ('" . $id_from . "', '" . $id_to . "')";
                mysqli_query($this->host, $query);
                return true;
            }
        }

        public function getPlayer($id_user){//получаем игрока
            $query = "SELECT * " . "FROM player " . "WHERE id_user='" . $id_user . "'";
            $result = mysqli_query($this->host, $query);
            $res = null;
            while ($row = mysqli_fetch_object($result)) {
                $res = $row;
                break;
            }
            return $res;
        }

        public function getPlayersFromRoom($id_room) {//получить всех игроков из комнаты
            $query = "SELECT * " . "FROM player " . "WHERE id='" . $id_room . "'";
            $result = mysqli_query($this->host, $query);
            $res = Array();
            while ($row = mysqli_fetch_object($result)) {
                $res = $row;
            }
            return $res;
        }

        public function setPlayer($id_user, $type, $status = 'alive', $live = 1){//добавляем нового игрока
            if ($id_user && $type) {
                $query = "INSERT INTO player (id_user, type, status, live) VALUES ('" . $id_user . "', '" . $type . "', '" . $status . "', '" . $live . "')";
                mysqli_query($this->host, $query);
                return true;
            }
        }

        public function changePlayer($id_user, $type) {
            if ($type === "thief" || $type === "cop") {
                $query = "UPDATE player SET type='". $type ."' WHERE id_user='". $id_user ."'";
                mysqli_query($this->host, $query);
                return true;
            }
            return false;
        }
    }