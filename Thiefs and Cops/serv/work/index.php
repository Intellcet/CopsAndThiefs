<?php

    error_reporting(1);

    define('DS', DIRECTORY_SEPARATOR);
    define('ROOT', dirname(dirname(__FILE__)) . DS . 'application' . DS );

    require_once (ROOT . 'app.php');

    $app = new Application();