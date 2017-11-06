<?php

    class  Room {

        public $loot = null;
        public $id = null;
        public $players;

        function __construct($id) {
            $this->loot    = 100 * $id;
            $this->id      = $id;
        }

        public function pushPlayers($players) {
            //$this->players = new stdClass();
            for ($i = 0; $i < count($players); $i++) {
                if (is_a($players[$i], 'Thief')) {
                    $this->players->{'Thiefs'}[] = $players[$i];
                }
                if (is_a($players[$i], 'Cop')) {
                    $this->players->{'Cops'}[] = $players[$i];
                }
            }
        }
    }
