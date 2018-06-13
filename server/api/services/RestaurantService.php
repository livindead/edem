<?php

namespace App\Service;

require_once 'services/DatabaseService.php';

class RestaurantService {

    private $dbService = null;

    public function __construct() {

    }

 

    public function getAll() {
        $sql = "SELECT e_points.*, (SELECT title as net_title FROM e_network WHERE id = e_points.id ) as network_title FROM `e_points` WHERE is_del = 0 ORDER BY id DESC ";
        $results = \Service\DatabaseService::executeQuery($sql);
        return $results;
    }

    public function getAllByNetId($id){
        $sql = "SELECT * FROM `e_points` WHERE is_del = 0 AND network_id = '$id' ";
        $results = \Service\DatabaseService::executeQuery($sql);
        return $results;
    }

    public function addFast($network_id,$adress,$phone,$email ,$login  ,$pass  ,$doc   ) {

        $res = "SELECT MAX(id) as count FROM e_points";
        $row= \Service\DatabaseService::executeQuery($res);
        $count = $row[0]->count ;
        $count++;
        
        $sql = " INSERT INTO `e_points` (`id`, `network_id`,`login`,`password`, `adress`, `contact_doc`,  `phone`,  `email`, `schedule`, `delivery_points`, `is_del`) VALUES ('$count', '$network_id', '$login', '$pass', '$adress', '$doc', '$phone'  ,'$email' ,'[]','[]', '0') ";
        
        $results = \Service\DatabaseService::executeQueryWOR($sql);
    }

    public function add($network_id,$adress,$doc_num,$contact_name ,$contact_phone  ,$contact_info  ,$contact_mail   ) {

        $res = "SELECT MAX(id) as count FROM e_points";
        $row= \Service\DatabaseService::executeQuery($res);
        $count = $row[0]->count ;
        $count++;

        $res = "SELECT title as net_title FROM e_network WHERE id = '$network_id' ";
        $row= \Service\DatabaseService::executeQuery($res);
        $net_name = $row[0]->net_title ;


        $converter = array(
                'а' => 'a',   'б' => 'b',   'в' => 'v',
                'г' => 'g',   'д' => 'd',   'е' => 'e',
                'ё' => 'e',   'ж' => 'zh',  'з' => 'z',
                'и' => 'i',   'й' => 'y',   'к' => 'k',
                'л' => 'l',   'м' => 'm',   'н' => 'n',
                'о' => 'o',   'п' => 'p',   'р' => 'r',
                'с' => 's',   'т' => 't',   'у' => 'u',
                'ф' => 'f',   'х' => 'h',   'ц' => 'c',
                'ч' => 'ch',  'ш' => 'sh',  'щ' => 'sch',
                'ь' => "'",  'ы' => 'y',   'ъ' => "'",
                'э' => 'e',   'ю' => 'yu',  'я' => 'ya',
         
                'А' => 'A',   'Б' => 'B',   'В' => 'V',
                'Г' => 'G',   'Д' => 'D',   'Е' => 'E',
                'Ё' => 'E',   'Ж' => 'Zh',  'З' => 'Z',
                'И' => 'I',   'Й' => 'Y',   'К' => 'K',
                'Л' => 'L',   'М' => 'M',   'Н' => 'N',
                'О' => 'O',   'П' => 'P',   'Р' => 'R',
                'С' => 'S',   'Т' => 'T',   'У' => 'U',
                'Ф' => 'F',   'Х' => 'H',   'Ц' => 'C',
                'Ч' => 'Ch',  'Ш' => 'Sh',  'Щ' => 'Sch',
                'Ь' => "'",  'Ы' => 'Y',   'Ъ' => "'",
                'Э' => 'E',   'Ю' => 'Yu',  'Я' => 'Ya',
        );
        
        $login = strtr($net_name.$count, $converter);
        $pass = mt_rand ( 10100,99997);
 
        $sql = " INSERT INTO `e_points` (`id`, `network_id`,`login`,`password`, `adress`, `contact_doc`, `contact_name`, `phone`,`contact_info`, `email`, `schedule`, `delivery_points`, `is_del`) VALUES ('$count', '$network_id', '$login', '$password', '$adress', '$doc_num', '$contact_name' , '$contact_phone', '$contact_info'  ,'$contact_mail' ,'[]','[]', '0') ";
        $results = \Service\DatabaseService::executeQueryWOR($sql);
    }
  
    public function setStatus($id,$val) {
            $sql = "UPDATE e_points SET is_allow = '$val'  WHERE id = '$id' AND is_del = '0' ";
            $results = \Service\DatabaseService::executeQueryWOR($sql);
    }

    public function smalEdit($id,$adress,$phone,$email,$login,$pass,$doc ) {
            $sql = "UPDATE e_points SET  adress='$adress', contact_doc = '$doc', phone='$phone', login = '$login',   email = '$email', password = '$pass'  WHERE id = '$id' ";

            $results = \Service\DatabaseService::executeQueryWOR($sql);
    }
                    
    public function edit($id, $network_id, $adress, $doc_num, $contact_name ,$contact_phone  ,$contact_info  ,$contact_mail, $schedule, $delivery_points) {
            $sql = "UPDATE e_points SET network_id = '$network_id',adress='$adress', contact_doc = '$doc_num', contact_name='$contact_name', phone='$contact_phone', contact_info = '$contact_info',   email = '$contact_mail', schedule = '$schedule', delivery_points='$delivery_points'  WHERE id = '$id' ";
            
            $results = \Service\DatabaseService::executeQueryWOR($sql);
    }

}
