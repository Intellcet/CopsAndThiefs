<?php

    define("MODULES", ROOT . 'modules' . DS);
    require_once (MODULES . 'mediator' . DS . 'mediator.php');
    require_once (MODULES . 'Auth' . DS . 'auth.php');
    require_once (MODULES . 'DataBase' . DS . 'db.php');

    class Application {

        private $mediator;
        private $db;
        private $auth;
        private $game;
        private $chat;


        function __construct(){
            $this->mediator = new Mediator();
            $this->db = new DB($this->mediator);
            $this->auth = new Auth($this->mediator);
            //var_dump($this->db->sendMessage(2, 'dsa', date('Y-n-j H:i:s')));
        }

        private function f1(){
        }
    }