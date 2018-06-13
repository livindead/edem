<?php

namespace App\Service;
require_once 'services/DatabaseService.php';
use DateTime;
use DateInterval;

class AuthService {

    private $dbService = null;

    public function __construct() {
     
    }

    public function getToken($login,$pass) {

        $sql = "SELECT * FROM `e_panel_users`  WHERE login = '$login' AND pass = '$pass' AND is_del = '0' limit 1";
        $results = \Service\DatabaseService::executeQuery($sql);
        if (count($results) > 0) {
            $id = $results[0]->id;
            $date = date("Y-m-d H:i:s");
            
            $token = sha1($id.'.'.$date.'EDIMLUDEI').".".$id;
            $sql = "UPDATE `e_panel_users` SET token = '$token', token_date = '$date' WHERE id = '$id' ";
            $results = \Service\DatabaseService::executeQueryWOR($sql);
            $sql = "SELECT * FROM `e_panel_users`  WHERE login = '$login' AND pass = '$pass' AND is_del = '0' limit 1";
            $results = \Service\DatabaseService::executeQuery($sql);
            $user = $results;

            $results = array('token' => $token,'user' => $user ); ;
        } else {
            $results = null;
        }

        return $results;


    }

    public function checkToken($token) {
        $result = false;
        $sql = "SELECT * FROM `e_panel_users`  WHERE token = '$token' AND is_del = '0' limit 1";
        $results = \Service\DatabaseService::executeQuery($sql);
        if (count($results) > 0) {
            $id = $results[0]->id;
            $token_date = new DateTime($results[0]->token_date);
            $token_date->add(new DateInterval('P2D'));

            $date = new DateTime();
            
            if( $token_date > $date) {
                $result = true;
            } else {
                $result = false;
            }


        } else {
            $result = false;
        }

        return $result;


    }


    public function getUserByToken($token) {

        $sql = "SELECT * FROM `e_panel_users`  WHERE token = '$token' AND is_del = '0' limit 1";
        $results = \Service\DatabaseService::executeQuery($sql);
        if (count($results) > 0) {
            $id = $results[0]->id;
            $token_date = new DateTime($results[0]->token_date);
            $token_date->add(new DateInterval('P7D'));

            $date = new DateTime();
            
            if( $token_date > $date) {
                $result = $results;
            } else {
                $result = null;
            }


        } else {
            $result = null;
        }

        return $result;


    }


    

 

}
