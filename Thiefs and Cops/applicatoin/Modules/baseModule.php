<?php
	class BaseModule {

		//protected $mediator;
		protected $db;

		function __construct (/*$mediator,*/ $db) {
			//$this->mediator = $mediator;
			$this->db = $db;
		}
	}