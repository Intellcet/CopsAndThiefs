<?php
    require_once(MODULES . 'baseModule.php');

    class Data extends BaseModule{

        public function startGame($token){
            $answer = new stdClass();
            if ($token) {
                $user = $this->db->getUserByToken($token);
                $player = $this->db->getPlayer($user->id);
                if($player) {
                    $this->db->setPlayerToRoom($player->id_user, 1);
                    $answer->{'player'} = $player;
                    $answer->{'nickname'} = $user->nickname;
                    return $answer;
                }
            }
            return false;
        }

        public function finishGame($token){
            if ($token) {
                $user = $this->db->getUserByToken($token);
                $player = $this->db->getPlayer($user->id);
                if($player) {
                    return $this->db->setPlayerToRoom($player->id_user, '');
                }
            }
            return false;
        }

        public function getRoom($id, $items = false, $players = false) {
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

        public function toRoom($token, $name_room) {
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

	    function __construct($db) {
            parent::__construct($db);
        }

    }