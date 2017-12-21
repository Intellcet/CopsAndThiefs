<?php

    define("MODULES", ROOT . 'Modules' . DS);
    require_once (MODULES . 'Auth' . DS . 'auth.php');
    require_once (MODULES . 'Game' . DS . 'game.php');
    require_once (MODULES . 'Chat' . DS . 'chat.php');
	require_once (MODULES . 'DataBase' . DS . 'db.php');

    class Application {

        private $db;
        private $auth;
        private $game;
        private $chat;

		public function answer($param) {
			$method = $param['method'];
			if ($method) {
				if (method_exists($this, $method . 'Method')) {
					return $this->{$method . 'Method'}($param);
				} else {
					return 'wrong method name';
				}
			} else {
				return 'empty method name';
			}
		}
		
		private function loginMethod($param) {
			if ($param['login'] && $param['pass']) {
				$result = new stdClass();
				$result->token = $this->auth->login($param['login'], $param['pass']);
				return $result;
			}
			return false;
		}
		
		private function logoutMethod($param) {
			if ($param['token']) {
				return $this->auth->logout($param['token']);
			}
			return false;
		}
		
		// register user
        private function registerUserMethod($param) {
		    if ($param['login'] && $param['pass'] && $param['nickname'] && $param['type']) {
		        return $this->auth->registerUser($param['login'], $param['pass'], $param['nickname'], $param['type']);
            }
            return false;
        }

		// start game
        private function startGameMethod($param){
		    if($param['token']) {
                return $this->game->startGame($param['token']);
            }
            return false;
        }
		// end game
        private function finishGameMethod($param){
            if($param['token']) {
                return $this->game->finishGame($param['token']);
            }
            return false;
        }
        //get status
        private function getStatusMethod($param) {
            if ($param['token']) {
                return $this->game->getStatus($param['token']);
            }
        }
		// get room info
        private function getRoomInfoMethod($param){
            if ($param['id_room'] && $param['token']){
                return $this->game->getRoom($param['token'], $param['id_room'], false, true);
            }
            return false;
        }

        private function getWaysMethod($param) {
            if ($param['id_room'] && $param['token']){
                return $this->game->getWays($param['token'], $param['id_room']);
            }
            return false;
        }

        //giveaway money
        private function giveMoneyMethod($param) {
            if ($param['token'] && $param['money']){
                return $this->game->giveMoney($param['token'], $param['money']);
            }
            return false;
        }
		
		private function setMessageMethod($param) {//отправить письмо
			if ($param['token'] && $param['text']) {
				return $this->chat->setMessage($param['token'], $param['text']);
			}
			return false;
		}
		private function getMessagesMethod($param) {//получить письма
			if ($param['token']) {
				return $this->chat->getMessages($param['token'], $param['count'], $param['offset']);
			}
			return false;
		}

		private function actionMethod($param) {//совершить действие
            if ($param['token']) {
                return $this->game->action($param['token'], $param['action'], $param['money'], $param['nickname'], $param['name_room'], $param['type']);
            }
        }

        function __construct() {
            $this->db = new DB();
            $this->auth = new Auth($this->db);
            $this->game = new Data($this->db);
			$this->chat = new Chat($this->db);
        }
    }