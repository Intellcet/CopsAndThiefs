<?php
	class BaseModule {

		protected $mediator;

		function __construct ($mediator) {
			$this->mediator = $mediator;
		}
	}