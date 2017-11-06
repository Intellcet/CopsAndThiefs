<?php

    class  Human {

        public $nickname;
        public $lvl;
        public $status;
        public $numberOfRoom;
        public $money = 0;
        public $exp = 0;

        function __construct($nickname, $status = 'На улице', $numberOfRoom = 0,  $lvl = 1) {
            $this->nickname = $nickname;
            $this->status = $status;
            $this->numberOfRoom = $numberOfRoom;
            $this->lvl = $lvl;
        }

        public function toBase() {//конвертация денег в экспу
            $this->exp += 1/5 * $this->money;
            $this->money = 0;
        }

        public function toPatient() {//стать терпилой
            //появление кнопки на ктр надо кликать(100 кликов для начала)
        }

        public function chatting() {//типа чатинг
            //...
        }
    }

    class Thief extends Human {
        //private ?
        public $nickname;
        public $lvl;
        public $status;
        public $numberOfRoom;
        public $money = 0;
        public $exp = 0;

        private $lawyer;

        function __construct($nickname) {
            $human = new Human($nickname);
            $this->nickname     = $human->nickname;
            $this->status       = $human->status;
            $this->numberOfRoom = $human->numberOfRoom;
            $this->lvl          = $human->lvl;
            $this->lawyer       = $human->lvl;
        }

        public function steal($money) {
            $this->money = $money;
        }

        public function useLawyer() {
            $price = 10 * $this->lvl;
            if ($this->money >= $price) {
                $this->money -= $price;
                return $this->lawyer;
            }
        }
    }

    class Cop extends Human {
        //private ?
        public $nickname;
        public $lvl;
        public $status;
        public $numberOfRoom;
        public $money = 0;
        public $exp = 0;

        function __construct($nickname) {
            $human = new Human($nickname);
            $this->nickname     = $human->nickname;
            $this->status       = $human->status;
            $this->numberOfRoom = $human->numberOfRoom;
            $this->lvl          = $human->lvl;
        }

        public function prick($lvl1, $lvl2, $lawyer = null) {

            $dice1 = Math.random() * 4 + $lvl1;
            $dice2 = Math.random() * 4 + ($lvl2 + $lawyer);

            if ($dice1 < $dice2)   {  return $lvl2;   }
            if ($dice1 > $dice2)   {  return $lvl1;   }
            if ($dice1 === $dice2) {
                $a = Math.floor(Math.random());
                return ($a === 1) ? $lvl2 : $lvl1;
            }
        }

        public function watch() {

            $watch = Math.floor(Math.random() * 3 + 1);
            if($watch != 4) {
                $this->exp += $watch * $this->lvl;
                //+ сообщение что ты осмтрелся(поел)
            } else {
                //текст о том, что в комнате вор, если есть вор в комнате(!)
            }
        }
    }