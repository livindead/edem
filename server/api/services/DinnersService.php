<?php

namespace App\Service;

require_once 'services/DatabaseService.php';

class DinnersService {

    private $dbService = null;

    public function __construct() {

    }

 

    public function getAll($page) {
        $sql = "SELECT e_dinners.*, (SELECT title FROM e_category WHERE id = e_dinners.category_id) as category_title FROM `e_dinners` WHERE is_del = '0' ORDER BY id ASC LIMIT $page, 30 ";
        $results = \Service\DatabaseService::executeQuery($sql);
        return $results;
    }

    public function getCategoryAll() {
        $sql = "SELECT * FROM `e_category` WHERE is_del = '0' ";
        $results = \Service\DatabaseService::executeQuery($sql);
        return $results;
    }

    public function getById($id) {
        $sql = "SELECT * FROM `e_dinners` WHERE id = '$id' AND is_del = '0' ";
        $results = \Service\DatabaseService::executeQuery($sql);
        return $results;
    }
   
    public function searchDinner($string) {
        $sql = "SELECT * FROM `e_dinners` WHERE e_dinners.title LIKE '%$string%' LIMIT 0, 20 ";
        $results = \Service\DatabaseService::executeQuery($sql);
        return $results;
    }


}
