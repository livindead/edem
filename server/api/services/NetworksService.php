<?php

namespace App\Service;

require_once 'services/DatabaseService.php';

class NetworksService {

    private $dbService = null;

    public function __construct() {

    }

 

    public function getAll() {
        $sql = "SELECT e_network.*, (SELECT COUNT(*) FROM e_points WHERE e_points.network_id = e_network.id AND e_points.is_del = 0 ) as point_count FROM `e_network` WHERE is_del = '0' ORDER BY id DESC ";
        $results = \Service\DatabaseService::executeQuery($sql);
        return $results;
    }

    public function getById($id) {
        $sql = "SELECT * FROM `e_network` WHERE id = '$id' AND is_del = '0' ";
        $results = \Service\DatabaseService::executeQuery($sql);
        return $results;
    }
   
   

    public function addNetwork($title,$contact,$mail,$logo ) {

            $res = "SELECT MAX(id) as count FROM e_network";
            $row= \Service\DatabaseService::executeQuery($res);
            $count = $row[0]->count ;
            $count++;
 

            $sql = " INSERT INTO `e_network` (`id`, `title`, `logo`, `contact`, `mail`, `type`, `is_del`) VALUES ('$count', '$title', '$logo', '$contact', '$mail', '[]', '0') ";
            $results = \Service\DatabaseService::executeQueryWOR($sql);
    }

 
    

    public function setStatus($id,$val) {
            $sql = "UPDATE e_network SET is_allow = '$val'  WHERE id = '$id' AND is_del = '0' ";
            $results = \Service\DatabaseService::executeQueryWOR($sql);
    }

    public function editNetwork($id,$title,$contact, $logo) {
            $sql = "UPDATE e_network SET title = '$title',contact='$contact',logo='$logo' WHERE id = '$id' ";
            $results = \Service\DatabaseService::executeQueryWOR($sql);
    }

}
