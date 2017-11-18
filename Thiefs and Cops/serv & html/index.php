<?php

    error_reporting(1);

    define('DS', DIRECTORY_SEPARATOR);
    define('ROOT', dirname(dirname(__FILE__)) . DS . 'application' . DS );
	
    require_once (ROOT . 'app.php');
	
	header('Content-Type: application/json');
	header('Content-type: text/html; charset=utf-8');

    $app = new Application();
	echo json_encode($app->answer($_GET));