<?php

    define('DS', DIRECTORY_SEPARATOR);
    define('ROOT', dirname(dirname(__FILE__)) . DS );

    require_once(ROOT . 'Players' . DS . 'players.php' );
    require_once(ROOT . 'Room' . DS . 'room.php' );

    $players = new stdClass();
    $players->{'thiefs'} = Array();
    $players->{'cops'} = Array();

    $rooms = Array();

    function createThief($players){
        for ($i = 0; $i < 2; $i++){
            $players->{'thiefs'}[] = new Thief('thief' . $i);
        }
    }

    function createCop($players){
        for ($i = 0; $i < 2; $i++){
            $players->{'cops'}[] = new Cop('cop' . $i);
        }
    }

    function createRoom($rooms){
        for ($i = 0; $i < 2; $i++) {
            $rooms[] = new Room($i);
        }
    }

    function pushInRooms($rooms, $players) {
        for ($i = 0; $i < count($rooms); $i++){
            $rooms[$i]->pushPlayers($players);
        }
    }


    createThief($players);
    createCop($players);
    createRoom($rooms);
    //pushInRooms($rooms, $players);

    var_dump($rooms);
