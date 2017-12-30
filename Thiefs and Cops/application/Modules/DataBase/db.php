<?php

	class DB {

        private $url = 'localhost';
        private $user = 'root';
        private $password = '';
		private $dbName = 'copsandthiefs';

        private $host;
        private $db;

        function __construct() {
			// подключить БД
            $this->host = mysqli_connect($this->url, $this->user, $this->password);
            if (!$this->host) {
                die('Ошибка соединения: ' . mysqli_error());
            }
            $this->db = mysqli_select_db($this->host, $this->dbName);
		}

        function __destruct() {
            mysqli_close($this->host);
        }

        private function isUniqUser($nickname) {//проверка уникальности пользователя по логину
            $query = "SELECT * " . "FROM user " . "WHERE nickname='" . $nickname . "'";
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

        public function getUserByID($id){
            $query = "SELECT * " . "FROM user " . "WHERE id=" . $id . "";
            $result = mysqli_query($this->host, $query);
            $res = null;
            while ($row = mysqli_fetch_object($result)) {
                $res = $row;
                break;
            }
            return $res;
        }
		
		public function getUserByToken($token) {
            $query = "SELECT * " . "FROM user " . "WHERE token='" . $token . "'";
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
            if ($this->isUniqUser($nickname)) {//если пользователь уникален (проверка по нику)
                $query = "INSERT INTO user (login, password, nickname) VALUES ('" . $login . "', '" . $password . "', '" . $nickname . "')";
                mysqli_query($this->host, $query);
                return true;
            }
            return false;
        }

        public function setMessage($id_player, $id_room, $text) {//отправляем в бд письмо
            $query = "INSERT INTO message (id_player, id_room, text, date_time) VALUES (" . $id_player . ", " . $id_room . ", '" . $text . "', NOW())";
            mysqli_query($this->host, $query);
            return true;
        }
		
        public function getMessages($id_room, $count = null, $offset = null) {//получаем письма
			$query = "SELECT nickname, text, date_time " . 
					 "FROM message, player, user " .
					 "WHERE message.id_room = " . $id_room . " AND " . 
						   "message.id_player = player.id AND " . 
						   "player.id_user = user.id  AND date_time > FROM_UNIXTIME(UNIX_TIMESTAMP() - 60 * 60)";
			if ($count) {
				$query .= " LIMIT " . $count;
			}
			if ($offset) {
				$query .= " OFFSET " .  $offset;
			}
			$query .= " ORDER BY date_time DESC";
            $result = mysqli_query($this->host, $query);
            $res = Array();
            while ($row = mysqli_fetch_object($result)) {
                $res[] = $row;
            }
            return $res;
        }
        // SELECT * FROM `message` WHERE date_time > FROM_UNIXTIME(UNIX_TIMESTAMP() - 60 * 60 * 24 * 10)
        // 60 - 1 min
        // 60 - 1 hour
        // 24 - 1 day
        // 10 - days count

        public function getItemUser($id_user, $type, $name){//получаем артефакт пользователя
            $query = "SELECT * " . "FROM item " . "WHERE id_user=" . $id_user . "AND type='" . $type . "' AND name='" . $name . "'";
            $result = mysqli_query($this->host, $query);
            $res = null;
            while ($row = mysqli_fetch_object($result)) {
                $res = $row;
                break;
            }
            return $res;
        }

        public function getItemsUser($id_user){//получаем все артефакты пользователя
            $query = "SELECT * " . "FROM item " . "WHERE id_user=" . $id_user . "";
            $result = mysqli_query($this->host, $query);
            $res = Array();
            while ($row = mysqli_fetch_object($result)) {
                $res[] = $row;
            }
            return $res;
        }

        public function getItemsRoom($id_room){//получаем все артефакты в комнате
            $query = "SELECT * " . "FROM item " . "WHERE id_user=" . $id_room . "";
            $result = mysqli_query($this->host, $query);
            $res = Array();
            while ($row = mysqli_fetch_object($result)) {
                $res[] = $row;
            }
            return $res;
        }

        public function setItem($id_room, $type, $cost, $name){//создаем артефакт
            $query = "INSERT INTO item (id_room, form, cost, title) VALUES (" . $id_room . ", '" . $type . "', " . $cost . ", '" . $name . "')";
            mysqli_query($this->host, $query);
            return true;
        }

        public function getRoom($id){//получаем комнату
            $query = "SELECT * " . "FROM room " . "WHERE id=" . $id;
            $result = mysqli_query($this->host, $query);
            $res = null;
            while ($row = mysqli_fetch_object($result)) {
                $res = $row;
                break;
            }
            return $res;
        }

        public function getRoomByName($name){
            $query = "SELECT * " . "FROM room " . "WHERE name='" . $name . "'";
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
                $query = "UPDATE room SET description='". $description ."' WHERE id=". $id ."";
                mysqli_query($this->host, $query);
                return true;
            }
            return false;
        }

        public function updateMoneyRoom($id, $money){//обновляем количество денег комнаты
            if ($money){
                $query = "UPDATE room SET money=". $money ." WHERE id=". $id ."";
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
             $query = "SELECT * " . "FROM way " . "WHERE id_from=" . $id_from . " AND id_to=". $id_to;
             $result = mysqli_query($this->host, $query);
             $res = null;
             while ($row = mysqli_fetch_object($result)) {
                 $res = $row;
                 break;
             }
             return $res;
        }

        public function getWays($id_from) {//получаем путь
            $query = "SELECT name " . "FROM way, room " . "WHERE id_from=" . $id_from . " AND room.id = way.id_to";
            $result = mysqli_query($this->host, $query);
            $res = Array();
            while ($row = mysqli_fetch_object($result)) {
                $res[] = $row;
            }
            return $res;
        }

        public function setWay($id_from, $id_to) {//создаем новый путь
            if ($id_from && $id_to) {
                $query = "INSERT INTO way (id_from, id_to) VALUES (" . $id_from . ", " . $id_to . ")";
                mysqli_query($this->host, $query);
                return true;
            }
        }

        public function getPlayer($id_user) {//получаем игрока
            $query = "SELECT * " . "FROM player " . "WHERE id_user=" . $id_user . "";
            $result = mysqli_query($this->host, $query);
            $res = null;
            while ($row = mysqli_fetch_object($result)) {
                $res = $row;
                break;
            }
            return $res;
        }

        public function getPlayerByNickname($nickname) {
            $query = "SELECT player.id, id_user, id_room, type, status, live, rang, money, exp, strength " . "FROM player, user " . "WHERE nickname='" . $nickname . "' AND player.id_user = user.id ";
            $result = mysqli_query($this->host, $query);
            $res = null;
            while ($row = mysqli_fetch_object($result)) {
                $res = $row;
                break;
            }
            return $res;
        }

        public function getPlayersFromRoom($id_room) {//получить всех игроков из комнаты
            $query = "SELECT * " . "FROM player " . "WHERE id_room=" . $id_room . "";
            $result = mysqli_query($this->host, $query);
            $res = Array();
            while ($row = mysqli_fetch_object($result)) {
                $res[] = $row;
            }
            return $res;
        }

        public function setPlayer($id_user, $type, $status = 'alive', $live = 1){//добавляем нового игрока
            if ($id_user && $type) {
                $query = "INSERT INTO player (id_user, type, status, live) VALUES (" . $id_user . ", '" . $type . "', '" . $status . "', '" . $live . "')";
                mysqli_query($this->host, $query);
                return true;
            }
            return false;
        }

        public function setPlayerToRoom($id, $id_room){//добавляем игрока в комнату
            if ($id) {
                $query = "UPDATE player SET id_room=". $id_room ." WHERE id=". $id ."";
                mysqli_query($this->host, $query);
                return true;
            }
            return false;
        }

        public function changePlayer($id, $type) {//изменяем тип игрока
            $query = "UPDATE player SET type='". $type ."' WHERE id=". $id;
            mysqli_query($this->host, $query);
            return true;
        }

        public function setStatus($id, $status) {
            if ($id && $status) {
                $query = "UPDATE player SET status='". $status ."' WHERE id=". $id;
                mysqli_query($this->host, $query);
                return true;
            }
            return false;
        }

        public function setRang($id, $rang){//обновляем ранг игрока
            if ($id) {
                $query = "UPDATE player SET rang='". $rang ."' WHERE id=". $id ."";
                mysqli_query($this->host, $query);
                return true;
            }
            return false;
        }

        public function getRang($id){//получаем ранг
            $query = "SELECT rang " . "FROM player " . "WHERE id=" . $id . "";
            $result = mysqli_query($this->host, $query);
            $res = null;
            while ($row = mysqli_fetch_object($result)) {
                $res = $row->rang;
                break;
            }
            return $res;
        }

        public function getExp($id) {//получение exp
            $query = "SELECT exp " . "FROM player " . "WHERE id=" . $id . "";
            $result = mysqli_query($this->host, $query);
            $res = null;
            while ($row = mysqli_fetch_object($result)) {
                $res = $row->exp;
                break;
            }
            return $res;
        }

        public function setExp($id, $exp) {//установка exp
            if ($id) {
                $query = "UPDATE player SET exp='". $exp ."' WHERE id=". $id ."";
                mysqli_query($this->host, $query);
                return true;
            }
            return false;
        }

        public function setMoney($id, $money){//обновляем деньги
            if ($id) {
                $query = "UPDATE player SET money=". $money ." WHERE id=". $id;
                mysqli_query($this->host, $query);
                return true;
            }
            return false;
        }

        public function getMoney($id){//получаем деньги
            $query = "SELECT money " . "FROM player " . "WHERE id=" . $id . "";
            $result = mysqli_query($this->host, $query);
            $res = null;
            while ($row = mysqli_fetch_object($result)) {
                $res = $row->money;
                break;
            }
            return $res;
        }

        public function setStrength($id, $strength){//обновляем силу
            if ($id) {
                $query = "UPDATE player SET strength=". $strength ." WHERE id=". $id ."";
                mysqli_query($this->host, $query);
                return true;
            }
            return false;
        }
		
		public function setAction($id_player, $id_target = null, $type, $value = null) {//добавить действие
            $query = "INSERT INTO `action` (id_player, id_target, `type`, `value`, date_time) VALUES (" . $id_player . ", " . (($id_target) ? $id_target : "null") . ", '" . $type . "', '" . (($value) ? $value : "null") . "',  NOW())";
            return mysqli_query($this->host, $query);
        }

		public function getAction($id_player) {//получить действие
            $query = "SELECT * " . " FROM action " . " WHERE id_player = " . $id_player . " AND date_time > FROM_UNIXTIME(UNIX_TIMESTAMP() - 5)";
            $result = mysqli_query($this->host, $query);
            $res = null;
            while ($row = mysqli_fetch_object($result)) {
                $res = $row;
                break;
            }
            return $res;
        }

		public function getActions($id_player) {//получить все действия игрока
            $query = "SELECT * " . "FROM action " . "WHERE id_player=" . $id_player;
            $result = mysqli_query($this->host, $query);
            $res = Array();
            while ($row = mysqli_fetch_object($result)) {
                $res[] = $row;
            }
            return $res;
        }

		public function delAction($id) { //удалить действие
            $query = "DELETE " . " FROM action " . " WHERE id=" . $id;
            mysqli_query($this->host, $query);
            return true;
        }
    }
