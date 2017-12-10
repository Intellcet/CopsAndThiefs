<?php

    require_once(MODULES . 'baseModule.php');

    class Auth extends BaseModule{

        public function registerUser($login, $pass, $nickname) {
            if ($login && $pass && $nickname){
                return $this->db->setUser($login, $pass, $nickname);
            }
            return false;
        }

        public function login($login, $pass) {
            if ($login && $pass) {
				$user = $this->db->getUser($login, $pass);
                if($user) {
                    //gen token
                    $token = md5('user->id' . 'secret key' . rand());
					$this->db->updateUserToken($user->id, $token);
                    return $token;
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