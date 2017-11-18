<?php

    define("MODULES", ROOT . 'Modules' . DS);
    require_once (MODULES . 'mediator' . DS . 'mediator.php');
    require_once (MODULES . 'Auth' . DS . 'auth.php');
    require_once (MODULES . 'Game' . DS . 'game.php');
    require_once (MODULES . 'DataBase' . DS . 'db.php');

    class Application {

        private $mediator;
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
		    if ($param['login'] && $param['pass'] && $param['nickname']) {
		        return $this->auth->registerUser($param['login'], $param['pass'], $param['nickname']);
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
		// get room info
        private function getRoomInfoMethod($param){
            if ($param['id_room']){
                return $this->game->getRoom($param['id_room'], true, true);
            }
            return false;
        }
		// move to room
        private function toRoomMethod($param){
            if ($param['token'] && $param['name_room']){
                return $this->game->toRoom($param['token'], $param['name_room']);
            }
            return false;
        }

        function __construct(){
            $this->mediator = new Mediator();
            $this->db = new DB();
            $this->auth = new Auth($this->db);
            $this->game = new Data($this->db);
        }
    }