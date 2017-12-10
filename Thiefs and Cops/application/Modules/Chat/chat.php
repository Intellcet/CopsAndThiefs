<?php

    require_once(MODULES . 'baseModule.php');

    class Chat extends BaseModule{

        public function setMessage($token, $text) {
            if ($token && $text){
				$user = $this->db->getUserByToken($token);
				if ($user) {
					$player = $this->db->getPlayer($user->id);
					if ($player && $player->id_room) {
						return $this->db->setMessage($player->id, $player->id_room, $text);
					}
				}
            }
            return false;
        }

        public function getMessages($token, $count, $offset) {
            if ($token) {
				$user = $this->db->getUserByToken($token);
                if($user) {
					$player = $this->db->getPlayer($user->id);
					if ($player && $player->id_room) {
						return $this->db->getMessages($player->id_room, $count, $offset);
					}
                }
            }
            return false;
        }

        public function logout($token) {
			$user = $this->db->getUserByToken($token);
			return $this->db->updateUserToken($user->id, null);
        }

        function __construct($db) {
			parent::__construct($db);
        }
    }