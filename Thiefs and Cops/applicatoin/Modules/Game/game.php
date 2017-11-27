<?php
    require_once(MODULES . 'baseModule.php');

    class Data extends BaseModule{

        private function giveaway($user, $playerMoney, $money) {//сдать деньги в общак//заплатить налоги
            if ($money) {
                $playerMoney -= $money;
                if ($playerMoney >= 0) {
                    $this->db->setMoney($user->id, $playerMoney);
                    return $this->db->getPlayer($user->id);
                }
                return "Недостаточно денег!";
            }
            return "Не ввели деньги!";
        }

        private function steal ($player, $playerMoney, $user, $nickname) {//украсть деньги у игрока
            if ($nickname){
                $victim = $this->db->getPlayerByNickname($nickname);
                if ($victim->type === 'thief' || $victim->type === 'human'){
                    $money = rand(1, $victim->money);
                    $victimMoney = $victim->money - $money;
                    $playerMoney += $money;
                    $this->db->setMoney($victim->id, $victimMoney);
                    $this->db->setMoney($player->id, $playerMoney);
                    return $this->db->getPlayer($user->id);
                } else {
                    return "Прёшь против копа!!!";
                }
            }
        }

        private function search($user, $player, $playerMoney) {//обыскать комнату
            $room = $this->db->getRoom($player->id_room);
            if ($room->money) {
                $stolenMoney = rand(0, 1000);
                if ($room->money -= $stolenMoney >= 0) {//проверка на нулевой баланс комнаты
                    $playerMoney += $stolenMoney;
                    $this->db->updateMoneyRoom($player->id_room, $room->money);
                    $this->db->setMoney($player->id, $playerMoney);
                    return $this->db->getPlayer($user->id);
                } else {
                    $playerMoney += $room->money;
                    $this->db->updateMoneyRoom($player->id_room, 0);
                    $this->db->setMoney($player->id, $playerMoney);
                    return $this->db->getPlayer($user->id);
                }
            } else {
                return "Красть нечего!";
            }
        }

        private function lawyer($playerMoney, $lvlThief, $player, $money) {//вызов адвоката(???)
            if ($money){
                $playerMoney -= $money;
                if ($playerMoney >= 0) {
                    $lawyer = $money % 1000;
                    $lvlThief += $lawyer;
                    $this->db->setMoney($player->id, $playerMoney);
                    return $lvlThief; //?????
                }
            }
        }

        private function grieve($nickname) {//пожопить(???)
            if ($nickname) {
                //????????????
            }
        }

        private function inspect($player) {//осмотреть комнату на наличие воров
            $room = $this->db->getRoom($player->id_room);
            $players = $this->db->getPlayersFromRoom($room->id);
            $monetka = rand(0, 100);
            if($monetka >= 90) {//если монетка, то ищем воров
                for ($i = 0; $i < count($players); $i++) {
                    if ($players[$i]->type === "thief"){//если находим, выводим первого попавшегося
                        return $players[$i]->nickname;
                    }
                }
                return $monetka * 15;
            }
            return $monetka * 10;
        }

        private function suffer($player, $playerMoney) {//страдать
            $playerMoney += 10;
            if ($playerMoney <= 1000){
                $this->db->setMoney($player->id, $playerMoney);
                return $player;
            }
            return "Смените класс!";
        }

        public function startGame($token){//начало игры
            $answer = new stdClass();
            if ($token) {
                $user = $this->db->getUserByToken($token);
                $player = $this->db->getPlayer($user->id);
                if($player) {
                    $this->db->setPlayerToRoom($player->id_user, 1);
                    $player = $this->db->getPlayer($user->id);
                    $answer->{'player'} = $player;
                    $answer->{'nickname'} = $user->nickname;
                    return $answer;
                }
            }
            return false;
        }

        public function finishGame($token){//конец игры
            if ($token) {
                $user = $this->db->getUserByToken($token);
                $player = $this->db->getPlayer($user->id);
                if($player) {
                    return $this->db->setPlayerToRoom($player->id_user, '');
                }
            }
            return false;
        }

        public function getRoom($id, $items = false, $players = false) {//получить комнату
            if ($id) {
                $result = new stdClass();
                $result->nicknames = Array();
                $user = null;
                $room = $this->db->getRoom($id);
                $result->room = $room;
                if ($items) {
                    $result->items = $this->db->getItemsRoom($room->id);
                }
                if ($players) {
                    $result->players = $this->db->getPlayersFromRoom($room->id);
                    for($i = 0; $i < count($result->players); $i++) {
                        $user = $this->db->getUserByID($result->players[$i]->id_user);
                        $result->nicknames[] = $user->nickname;
                    }
                }
                return $result;
            }
            return false;
        }

        public function toRoom($token, $name_room) {//переместиться в другую комнату
            if ($token) {
                $user = $this->db->getUserByToken($token);
                $player = $this->db->getPlayer($user->id);
                $room = $this->db->getRoomByName($name_room);
                $way = $this->db->getWay($player->id_room, $room->id);
                if ($way) {
                    $this->db->setPlayerToRoom($player->id, $room->id);
                    return $room;
                }
            }
            return false;
        }

        public function action($token, $action, $money, $nickname){//совершить какое-либо действие
            if ($token){
                $lvlThief = null;
                $lvlCop = null;
                $user = $this->db->getUserByToken($token);
                $player = $this->db->getPlayer($user->id);
                $playerMoney = $player->money;
                if ($player){
                    if (($action === 'giveaway' && $player->type === "thief") || ($action === 'payTax' && $player->type === "cop" )) {//сдать деньги в общак//заплатить налоги
                        return $this->giveaway($user, $playerMoney, $money);
                    }
                    if ($action === 'steal' && $player->type === "thief") {//украсть у игрока
                        return $this->steal($player, $playerMoney, $user, $nickname);
                    }
                    if ($action === 'search' && $player->type === "thief") {//выкрасть из комнаты
                        return $this->search($user, $player, $playerMoney);
                    }
                    if ($action === 'lawyer' && $player->type === "thief") {
                        return $this->lawyer($playerMoney, $lvlThief, $player, $money);

                    }
                    if ($action === 'grieve' && $player->type === "cop"){//пожопить
                        return $this->grieve($nickname);
                    }
                    if ($action === 'inspect' && $player->type === "cop") {//осмотреться
                        return $this->inspect($player);
                    }
                    if ($action === 'suffer' && $player->type === "human") {//страдать
                        return $this->suffer($player, $playerMoney);
                    }
                }
            }
        }

	    function __construct($db) {
            parent::__construct($db);
        }
    }