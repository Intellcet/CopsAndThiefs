<?php

    require_once(MODULES . 'baseModule.php');

    class Auth extends BaseModule{

        private function login($login, $pass) {
            if ($login && $pass) {
                $type = $this->mediator->getTriggerTypes();
                $user = $this->mediator->callTrigger($type->GET_USER, Array('login' => $login, 'pass' => $pass));
                if($user) {
                    //gen token
                    $token = md5('user->id' . 'secret key' . rand());
                    $this->mediator->callTrigger($type->SET_TOKEN, $token);
                    return $token;
                }
            }
            return false;
        }

        private function logout($login) {

        }

        function __construct($mediator) {
            parent::__construct($mediator);
            $this->login('Petya', '213' );
        }
    }