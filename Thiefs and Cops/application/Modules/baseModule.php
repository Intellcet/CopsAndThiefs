<?php
	class BaseModule {

		protected $db;

		function __construct ($db) {
			$this->db = $db;
		}
	}