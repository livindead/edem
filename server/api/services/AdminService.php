<?php

namespace Service;

require_once 'services/DatabaseService.php';

class AdminService {

    private $dbService = null;

    public function __construct() {

        $this->dbService = new \Service\DatabaseService();
    }

   



    public function addUser($phone) {
            $res = "SELECT MAX(id) as count FROM p_users";
            $row= $this->dbService->executeQuery($res);
            $count = $row[0]->count ;
            $count++;

            $pass = rand(0,9999);

            $sql = " INSERT INTO `p_users` (`id`, `phone`, `pass`, `is_del`) VALUES ('$count', '$phone', '$pass', '0'); ";

            $this->dbService->executeQueryWOR($sql);
    }

     public function addPartner($img, $title, $description, $cat, $percent) {
            $res = "SELECT MAX(id) as count FROM p_partner";
            $row= $this->dbService->executeQuery($res);
            $count = $row[0]->count ;
            $count++;

            
            $sql = " INSERT INTO `p_partner` (`id`, `img`, `title`, `description`, `category`, `percent`, `cost`, `is_del`) VALUES ('1', '$img', '$title', '$description', '$cat', '$percent', '0', '0'); ";

            $this->dbService->executeQueryWOR($sql);
    }


   
 
}
