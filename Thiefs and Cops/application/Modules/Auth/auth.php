<?php

    require_once(MODULES . 'baseModule.php');

    class Auth extends BaseModule{

        public function registerUser($login, $pass, $nickname, $type) {
            if ($type) {
                $type = strtolower($type);
                $newType = '';
                if ($type === 'cop' || $type === 'коп') {
                    $newType = 'cop';
                } elseif  ($type === 'thief' || $type === 'вор'){
                    $newType = 'thief';
                } else {
                    return "Вы ввели несуществующий тип игрока.(Введите коп или вор)";
                }
                if ($login && $pass && $nickname){
                    $this->db->setUser($login, $pass, $nickname);
                    $user = $this->db->getUser($login, $pass);
                    if ($user) {
                        $this->db->setPlayer($user->id, $newType, 'alive');
                        return true;
                    }
                    return false;
                }
                return false;
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