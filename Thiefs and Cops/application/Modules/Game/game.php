<?php
    require_once(MODULES . 'baseModule.php');

    class Data extends BaseModule{

        private $TYPE = Array(
            'cop' => Array(
                'rangs' => Array(
                    '1' => 'Рядовой', '2' => 'Ефрейтор', '3' => 'Сержант', '4' => 'Лейтенант',
                    '5' => 'Капитан', '6' => 'Майор',  '7' => 'Полковник', '8' => 'Генерал'
                ),
                'actions' => Array(
                    'giveaway' => 'giveaway',
                    'grieve' => 'grieve',
                    'inspect' => 'inspect',
                    'toRoom' => 'toRoom',
                    'changeType' => 'changeType',
                    'toKnowResultCop' => 'toKnowResultCop'
                )
            ),
            'thief' => Array(
                'rangs' => Array(
                    '1' => 'Шкет', '2' => 'Шестёрка', '3' => 'Карманник', '4' => 'Мужик',
                    '5' => 'Шерстяной', '6' => 'Блатной', '7' => 'Пахан', '8' => 'Вор в законе'
                ),
                'actions' => Array(
                    'giveaway' => 'giveaway',
                    'steal' => 'steal',
                    'search' => 'search',
                    'lawyer' => 'lawyer',
                    'toRoom' => 'toRoom',
                    'changeType' => 'changeType',
                    'toKnowResultThief' => 'toKnowResultThief'
                )
            ),
            'human' => Array(
                'rangs' => Array(
                    '1' => 'Студент'
                ),
                'actions' => Array(
                    'suffer' => 'suffer',
                    'changeType' => 'changeType',
                    'toRoom' => 'toRoom'
                )
            )
        );

        private function setRang($exp) {
            if ($exp <= 100) {  return 1;   }
            if ($exp <= 200) {  return 2;   }
            if ($exp <= 300) {	return 3;   }
            if ($exp <= 400) {	return 4;   }
            if ($exp <= 500) {	return 5;   }
            if ($exp <= 600) {	return 6;   }
            if ($exp <= 700) {	return 7;   }
            if ($exp >= 701) {	return 8;   }
        }

        private function giveaway($param) {//сдать деньги в общак//заплатить налоги(!!!)
            if (($param['player']->status != "жопит" || $param['player']->status != "жопят") && $param['player']->type != "human") {
                if ($param['money']) {
                    $param['player']->money -= $param['money'];
                    if ($param['player']->money >= 0) {
                        $param['player']->exp += round($param['money'] / 100);
                        $this->db->setMoney($param['player']->id, $param['player']->money);
                        $this->db->setExp($param['player']->id, $param['player']->exp);
                        $param['player']->rang = $this->TYPE[$param['player']->type]['rangs'][$this->setRang($param['player']->exp)];
                        $this->db->setRang($param['player']->id, $this->setRang($param['player']->exp));
                        return $param['player'];
                    }
                    return "Недостаточно денег!";
                }
                return "Не ввели деньги!";
            }
            return false;
        }

        private function steal ($param) {//украсть деньги у игрока(!!!)
            if ($param['player']->status != "жопит" || $param['player']->status != "жопят") {
                if ($param['nickname']) {
                    $victim = $this->db->getPlayerByNickname($param['nickname']);
                    if ($victim) {
                        if ($victim->type === 'thief' || $victim->type === 'human') {
                            $money = rand(1, $victim->money);
                            $victimMoney = $victim->money - $money;
                            $param['player']->money += $money;
                            $this->db->setMoney($victim->id, $victimMoney);
                            $this->db->setMoney($param['player']->id, $param['player']->money);
                            return $this->db->getPlayer($param['user']->id);
                        } else {
                            return "Прёшь против копа!!!";
                        }
                    }
                    return "Такого игрока не существует!";
                }
                return "Не ввёли ник игрока, которого хотите ограбить!";
            }
            return false;
        }

        private function search($param) {//обыскать комнату(!!!)
            if ($param['player']->status != "жопит" || $param['player']->status != "жопят") {
                $room = $this->db->getRoom($param['player']->id_room);
                $data = new stdClass();
                if ($room->money) {
                    $stolenMoney = rand(0, 1000);
                    $room->money -= $stolenMoney;
                    if ($room->money >= 0) {//проверка на нулевой баланс комнаты
                        $param['player']->money += $stolenMoney;
                        $this->db->updateMoneyRoom($param['player']->id_room, $room->money);
                        $this->db->setMoney($param['player']->id, $param['player']->money);
                        if ($stolenMoney >= 100) {
                            while ($stolenMoney >= 100) {
                                $stolenMoney /= 100;
                            };
                            $param['player']->exp += round($stolenMoney);
                            $this->db->setExp($param['player']->id, $param['player']->exp);
                            $data->rang = $this->TYPE[$param['player']->type]['rangs'][$this->setRang($param['player']->exp)];
                            $this->db->setRang($param['player']->id, $this->setRang($param['player']->exp));
                            $data->player = $this->db->getPlayer($param['user']->id);
                        }
                        return $data;
                    } else {
                        $param['player']->money += $room->money;
                        $this->db->updateMoneyRoom($param['player']->id_room, 0);
                        $this->db->setMoney($param['player']->id, $param['player']->money);
                        $data->rang = $this->TYPE[$param['player']->type]['rangs'][$this->setRang($param['player']->exp)];
                        $this->db->setRang($param['player']->id, $this->setRang($param['player']->exp));
                        $data->player = $this->db->getPlayer($param['user']->id);
                        return $data;
                    }
                }
                return "Красть нечего!";
            }
            return false;
        }

        private function lawyer($param) {//вызов адвоката(!!!)
            if ($param['money'] && $param['player']->status === "жопят") {
                $param['player']->money -= $param['money'];
                if ($param['player']->money >= 0) {
                    $lawyer = round($param['money'] / 1000);
                    $param['player']->strength += $lawyer;
                    $this->db->setMoney($param['player']->id, $param['player']->money);
                    $this->db->setStrength($param['player']->id, $param['player']->strength);
                    return true;
                }
                return "Недостаточно средств!!!";
            }
            return "Не ввели деньги!";
        }

        private function toKnowResultThief($param) {
            if ($param['player']->status === "жопят"){
                return $this->db->getPlayer($param['player']->id);
            }
            return false;
        }

        private function grieve($param) {//пожопить(!!!)
            if ($param['player']->status != "жопит" || $param['player']->status != "жопят") {
                if ($param['nickname']) {
                    $player = $this->db->getPlayer($param['user']->id);
                    $victim = $this->db->getPlayerByNickname($param['nickname']);
                    if ($victim->status != "жопит" || $victim->status != "жопят") {
                        if ($victim && $victim->id_room === $player->id_room && $victim->nickname != $param['user']->nickname) {
                            $this->db->setStatus($victim->id, "жопят");
                            $this->db->setStatus($player->id, "жопит");
                            return true;
                        }
                        return "Игрока с таким ником не существует!";
                    }
                    return "Игрок, которого хотите пожопить занят!";
                }
                return "Не ввели ник игрока, которого хотите пожопить!";
            }
            return false;
        }

        private function victimBetterCop($player, $victim) {//вспомогательная функция
            $player->exp -= $victim->exp * 0.1;
            $victim->exp += $victim->exp * 0.1;
            if ($player->exp >= 0) {
                $this->db->setExp($player->id, $player->exp);
                $this->db->setStatus($player->id, "alive");
            } else {
                $this->db->setExp($player->id, 0);
                $this->db->setStatus($player->id, "терпите");
            }
            $this->db->setExp($victim->id, $victim->exp);
            $this->db->setRang($player->id, $this->setRang($player->exp));
            $this->db->setRang($victim->id, $this->setRang($victim->exp));
            $victim->money += round($player->money / 5);
            $player->money -= round($player->money / 5);
            $this->db->setMoney($victim->id, $victim->money);
            $this->db->setMoney($player->id, $player->money);
            $this->db->setStatus($victim->id, "alive");
            $this->db->setStrength($player->id, 0);
            $this->db->setStrength($victim->id, 0);
            if ($player->type === "cop" && $victim->type === "cop") {
                return "Вы хотели пожопить копа!!!";
            }
            return "Вы неуспешно пожопили вора";
        }

        private function victimLessCop($player, $victim) {//вспомогательная функция
            $player->exp += $victim->exp * 0.1;
            $victim->exp -= $victim->exp * 0.1;
            if ($victim->exp >= 0) {
                $this->db->setExp($victim->id, $victim->exp);
                $this->db->setStatus($victim->id, "alive");
            } else {
                $this->db->setExp($victim->id, 0);
                $this->db->setStatus($victim->id, "терпите");
            }
            $this->db->setExp($player->id, $player->exp);
            $this->db->setRang($player->id, $this->setRang($player->exp));
            $this->db->setRang($victim->id, $this->setRang($victim->exp));
            $player->money += round($victim->money / 5);
            $victim->money -= round($victim->money / 5);
            $this->db->setMoney($player->id, $player->money);
            $this->db->setMoney($victim->id, $victim->money);
            $this->db->setStatus($player->id, "alive");
            $this->db->setStrength($player->id, 0);
            $this->db->setStrength($victim->id, 0);
            if ($player->type === "cop" && $victim->type === "cop") {
                return "Вы пожопить копа!!!";
            }
            return "Вы пожопить вора!!!";
        }

        private function toKnowResultCop($param) {//узнать результат копу
            if ($param['player']->status === "жопит") {
                $victim = $this->db->getPlayerByNickname($param['nickname']);
                if ($param['player']->type === "cop" && $victim->type === "cop") {//если коп пожопил копа
                    if ($victim->rang > $param['player']->rang) {//если ранг жертвы выше
                        return $this->victimBetterCop($param['player'], $victim);
                    } else {
                        return $this->victimLessCop($param['player'], $victim);
                    }
                }
                if ($param['player']->type === "cop" && $victim->type === "thief") {//если коп пожопил вора
                    $lvlCop   = rand($param['player']->rang + $param['player']->strength, $param['player']->rang + $param['player']->strength + 3);
                    $lvlThief = rand($victim->rang + $victim->strength, $victim->rang + $victim->strength + 3);
                    if ($lvlCop > $lvlThief) {
                        return $this->victimLessCop($param['player'], $victim);
                    } else {
                        return $this->victimBetterCop($param['player'], $victim);
                    }
                }
            }
            if ($param['player']->status === "жопят") {
                return "Вас пытались пожопить!";
            }
            return false;
        }

        private function inspect($param) {//осмотреть комнату на наличие воров
            if ($param['player']->status != "жопит" || $param['player']->status != "жопят") {
                $room = $this->db->getRoom($param['player']->id_room);
                $players = $this->db->getPlayersFromRoom($room->id);
                $monetka = rand(0, 100);
                if($monetka >= 90) {//если монетка, то ищем воров
                    for ($i = 0; $i < count($players); $i++) {
                        if ($players[$i]->type === "thief"){//если находим, выводим первого попавшегося
                            return $this->db->getUserByID($players[$i]->id)->nickname;
                        }
                    }
                    $exp = $monetka;
                    $param['player']->exp += $exp;
                    $this->db->setExp($param['player']->id, $param['player']->exp);
                    $this->db->setRang($param['player']->id, $this->setRang($param['player']->exp));
                    return true;
                }
                $exp = $monetka;
                $param['player']->exp += $exp;
                $this->db->setExp($param['player']->id, $param['player']->exp);
                $this->db->setRang($param['player']->id, $this->setRang($param['player']->exp));
                return true;
            }
        }

        private function suffer($param) {//страдать
            if ($param['player']->type === "human" && $param['player']->status === "терпите") {
                $param['player']->money += 10;
                if ($param['player']->money <= 1000){
                    $this->db->setMoney($param['player']->id, $param['player']->money);
                    return $param['player'];
                }
                $this->db->setStatus($param['player']->id, "смените тип");
                return "Смените тип!";
            }
        }

        private function changeType($param) {
            if ($param['player']->type === "human" && $param['player']->status === "смените тип") {
                if ($param['type'] === "cop" || $param['type'] === "коп") {
                    $this->db->changePlayer($param['player']->id, "cop");
                    $this->db->setStatus($param['player']->id, "alive");
                    return true;
                }
                if ($param['type'] === "thief" || $param['type'] === "вор") {
                    $this->db->changePlayer($param['player']->id, "thief");
                    $this->db->setStatus($param['player']->id, "alive");
                    return true;
                }
            }
            if (($param['player']->type === "cop" || $param['player']->type === "thief") && $param['player']->status === "терпите") {
                $this->db->changePlayer($param['player']->id, "human");
                $this->db->setStatus($param['player']->id, "терпите");
                return true;
            }
            return false;
        }

        public function startGame($token) {//начало игры
            $answer = new stdClass();
            if ($token) {
                $user = $this->db->getUserByToken($token);
                $player = $this->db->getPlayer($user->id);
                if($player) {
                    $this->db->setPlayerToRoom($player->id, 1);
                    $player = $this->db->getPlayer($user->id);
                    $answer->player = $player;
                    $answer->nickname = $user->nickname;
                    $answer->rang = $this->TYPE[$player->type]['rangs'][$this->setRang($player->exp)];
                    return $answer;
                }
            }
            return false;
        }

        public function finishGame($token) {//конец игры
            if ($token) {
                $user = $this->db->getUserByToken($token);
                $player = $this->db->getPlayer($user->id);
                if($player) {
                    return $this->db->setPlayerToRoom($player->id, '');
                }
            }
            return false;
        }

        public function getStatus($token) {//получить статус игрока
            if ($token) {
                $user = $this->db->getUserByToken($token);
                $player = $this->db->getPlayer($user->id);
                if ($player) {
                    return $player->status;
                }
            }
            return false;
        }

        public function getRoom($token, $id, $items = false, $players = false) {//получить комнату
            if ($id && $token) {
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

        public function getWays($token, $id) {
            if ($token && $id) {
                $result = new stdClass();
                $result->rooms = Array();
                $room = $this->db->getRoom($id);
                if ($room) {
                    $ways = $this->db->getWays($room->id);
                    for ($i = 0; $i < count($ways); $i++) {
                        $result->rooms[] = $this->db->getRoom($ways[$i]->id_to)->name;
                    }
                }
                return $result;
            }
            return false;
        }

        public function toRoom($param) {//переместиться в другую комнату
            $room = $this->db->getRoomByName($param['name_room']);
            $way = $this->db->getWay($param['player']->id_room, $room->id);
            if ($way) {
                $this->db->setPlayerToRoom($param['player']->id, $room->id);
                return $room;
            }
            return false;
        }

        public function action($token, $action, $money, $nickname, $name_room, $type) {//совершить какое-либо действие
            if ($token) {
                $user = $this->db->getUserByToken($token);
                $player = $this->db->getPlayer($user->id);
                if ($player && $action) {
                    $answer = new stdClass();
                    $param = Array(
                        'user' => $user, 'player' => $player, 'nickname' => $nickname, 'money' => $money, 'name_room' => $name_room, 'type' => $type
                    );
                    if ($this->TYPE[$player->type]['actions'][$action]) {
                        $answer->action = $this->{$this->TYPE[$player->type]['actions'][$action]}($param);
                    }
                    //$this->db->setAction($player->id, null, $action, $answer->{'action'});
                    if ($answer->action != false) {
                        $answer->player = $this->db->getPlayer($user->id);
                        $answer->rang = $this->TYPE[$answer->player->type]['rangs'][$this->setRang($answer->player->exp)];
                        $answer->nickname = $user->nickname;
                        return $answer;
                    }
                }
                return false;
            }
            return false;
        }

	    function __construct($db) {
            parent::__construct($db);
        }
    }