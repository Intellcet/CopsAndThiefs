<?php

    class Trigger {
        public function __call($method, $args) {
            if (isset($this->{$method}) && is_callable($this->{$method})) {
                return call_user_func_array($this->{$method}, $args);
            }
            return null;
        }
    }

    class Mediator {

        private $TRIGGER_TYPES;
        private $TRIGGER;
        private $EVENT_TYPES;
        private $EVENT;

        function __construct() {
           //определить тиаы тригероов
            $this->TRIGGER_TYPES = new stdClass();
            $this->TRIGGER_TYPES->GET_USER     = 'GET_USER';
            $this->TRIGGER_TYPES->GET_LOCATION = 'GET_LOCATION';
            $this->TRIGGER_TYPES->SET_TOKEN    = 'SET_TOKEN';
            //записать триггеры
            $this->TRIGGER = new Trigger;
            foreach ($this->TRIGGER_TYPES as $trigger) {
                $this->TRIGGER->{$trigger} = null;
            }
            //определить типы событий
            $this->EVENT_TYPES = new stdClass();
            $this->EVENT_TYPES->USER_DEATH = 'user_death';
            $this->EVENT_TYPES->ANOTHER_EVENT = 'another_event';
            //записать события
            $this->EVENT = new stdClass();
            foreach ($this->EVENT_TYPES as $event) {
                $this->EVENT->{$event} = Array();
            }
        }

        //about triggers
        public function getTriggerTypes() {
            return $this->TRIGGER_TYPES;
        }

        public function registerTrigger($name, $_func) {
            if ($name && is_callable($_func)) {
                $this->TRIGGER->{$name} = $_func;
                return true;
            }
            return false;
        }

        public function callTrigger($name, $param = null) {
            if ($name && $this->TRIGGER->{$name}) {
                return $this->TRIGGER->{$name}($param);
            }
            return null;
        }

        //about events
        public function getEventTypes() {
            return $this->EVENT_TYPES;
        }

        public function subscribe($name, $_func) {
            if ($name && is_array($this->EVENT->{$name}) && is_callable($_func)){
                $f = new Trigger();
                $f->{$name} = $_func;
                $this->EVENT->{$name}[] = $f;
            }
        }

        public function call($name, $param = null) {
            if ($name && is_array($this->EVENT->{$name})) {
                foreach ($this->EVENT->{$name} as $f){
                    $f->{$name}($param);
                }
            }
        }
    }