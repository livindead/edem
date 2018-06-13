<?php

namespace App\Service;

require_once 'services/DatabaseService.php';

class OrgService {

    private $dbService = null;

    public function __construct() {

    }

 

    public function getAllPoints() {
        $sql = "SELECT * FROM `e_points` WHERE is_del = 0";
        $results = \Service\DatabaseService::executeQuery($sql);
        return $results;
    }

     public function getPoint($id) {
        $sql = "SELECT * FROM `e_points` WHERE id = '$id' ";
        $results = \Service\DatabaseService::executeQuery($sql);
        return $results;
    }
    public function getAllEvents() {
        $sql = "SELECT e_events.*,(select name from r_users where id = e_events.creator_id ) as creator_name, (select title from e_points where id = e_events.point_id ) as point_title, (select name from r_users where id = (select sender_id from e_events_dialog where event_id = e_events.id and sender_id != e_events.creator_id order by id  desc limit 1) ) as sender_name, (select date from e_events_dialog where event_id = e_events.id and sender_id != e_events.creator_id order by id  desc limit 1) as sender_date, (select text from e_events_dialog where event_id = e_events.id and sender_id != e_events.creator_id order by id  desc limit 1) as sender_text FROM `e_events` WHERE is_del = 0 ORDER BY e_events.id DESC";
        $results = \Service\DatabaseService::executeQuery($sql);
        return $results;
    }
   

    public function addPoint($title,$adress,$link,$coord,$users,$text,$type) {

            $res = "SELECT MAX(id) as count FROM e_points";
            $row= \Service\DatabaseService::executeQuery($res);
            $count = $row[0]->count ;
            $count++;
 

            $sql = " INSERT INTO `e_points` (`id`, `title`, `adress`, `link`, `coord`, `text`,`users`, `type`, `org`, `is_del`) VALUES ('$count', '$title', '$adress', '$link', '$coord', '$text','$users', '$type', '0', '0') ";
           // return $sql;
            $results = \Service\DatabaseService::executeQueryWOR($sql);
    }

    public function addEvent($text,$class,$point_id,$date,$creator_id) {

            $res = "SELECT MAX(id) as count FROM e_events";
            $row= \Service\DatabaseService::executeQuery($res);
            $count = $row[0]->count ;
            $count++;
 

            $sql = "INSERT INTO `e_events` (`id`, `text`, `date`, `class`, `point_id`, `status`, `creator_id`, `is_del`) VALUES ('$count', '$text', '$date', '$class', '$point_id', '0', '$creator_id', '0') ";
           // return $sql;
            $results = \Service\DatabaseService::executeQueryWOR($sql);
                
            if($class == 0){
                        $notification_text = "Уведомление";
                        $notification_key = "notification";
            } 
            if($class == 1){
                        $notification_text = "Предупреждение";
                        $notification_key = "danger";
            } 
            if($class == 2){
                        $notification_text = "Авария";
                        $notification_key = "alert";
            } 
              $content      = array(
                    "en" => 'В журнал событий добавленно  '.$notification_text
                );
  
            $fields = array(
                        'app_id' => "34616f71-becf-481d-84ff-e4791585945b",
                        'filters' => array(array("field" => "tag", "key" => $notification_key, "relation" => "=", "value" => "true") ),
                        'data' => array("foo" => "bar"),
                        'contents' => $content
            );
              
                    $fields = json_encode($fields);

                    $ch = curl_init();
                    curl_setopt($ch, CURLOPT_URL, "https://onesignal.com/api/v1/notifications");
                    curl_setopt($ch, CURLOPT_HTTPHEADER, array('Content-Type: application/json; charset=utf-8',
                                                               'Authorization: Basic ZWIxM2ViNWUtYzk3Yi00MGMzLWJlMWItNGE5Nzk4MmUxZDM5'));
                    curl_setopt($ch, CURLOPT_RETURNTRANSFER, TRUE);
                    curl_setopt($ch, CURLOPT_HEADER, FALSE);
                    curl_setopt($ch, CURLOPT_POST, TRUE);
                    curl_setopt($ch, CURLOPT_POSTFIELDS, $fields);
                    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, FALSE);

                    $response = curl_exec($ch);
                    curl_close($ch);
                $results = $response;
                /*
                $content      = array(
                    "en" => 'English Message'
                );
               
                $fields = array(
                    'app_id' =>  "34616f71-becf-481d-84ff-e4791585945b",
                    'included_segments' => array(
                        'All'
                    ),
                    'data' => array(
                        "foo" => "bar"
                    ),
                    'contents' => $content 
                );
                
                $fields = json_encode($fields);
 
                
                $ch = curl_init();
                curl_setopt($ch, CURLOPT_URL, "https://onesignal.com/api/v1/notifications");
                   curl_setopt($ch, CURLOPT_HTTPHEADER, array('Content-Type: application/json; charset=utf-8',
                                                               'Authorization: Basic ZWIxM2ViNWUtYzk3Yi00MGMzLWJlMWItNGE5Nzk4MmUxZDM5'));
                curl_setopt($ch, CURLOPT_RETURNTRANSFER, TRUE);
                curl_setopt($ch, CURLOPT_HEADER, FALSE);
                curl_setopt($ch, CURLOPT_POST, TRUE);
                curl_setopt($ch, CURLOPT_POSTFIELDS, $fields);
                curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, FALSE);
                
                $response = curl_exec($ch);
                curl_close($ch);*/
             
    }
    

    public function closeEvent($id) {
            $date = date("Y-m-d H:i:s");
            $sql = "UPDATE e_events SET status = 1, close_dete = '$date' WHERE id = $id";
           // return $sql;
            $results = \Service\DatabaseService::executeQueryWOR($sql);
    }


    public function addMsg($event_id,$sender_id,$text) {

            $res = "SELECT MAX(id) as count FROM e_events_dialog";
            $row= \Service\DatabaseService::executeQuery($res);
            $count = $row[0]->count ;
            $count++;
            $date = date("Y-m-d H:i:s");


            $sql = "INSERT INTO `e_events_dialog` (`id`, `sender_id`, `text`, `event_id`, `date`, `is_del`) VALUES ('$count', '$sender_id', '$text', '$event_id', '$date', '0');";
           // return $sql;
            $results = \Service\DatabaseService::executeQueryWOR($sql);

            $res = "SELECT class as class FROM e_events WHERE id = '$event_id' limit 1";
            $row= \Service\DatabaseService::executeQuery($res);
            $class = $row[0]->class ;

            if($class == 0){
                        $notification_text = "Уведомление";
                        $notification_key = "mes_notification";
            } 
            if($class == 1){
                        $notification_text = "Предупреждение";
                        $notification_key = "mes_atantion";
            } 
            if($class == 2){
                        $notification_text = "Авария";
                        $notification_key = "mes_disaster";
            } 
              $content      = array(
                    "en" => 'В журнал событий добавленно сообщение в диалоге тип '.$notification_text
                );
  
            $fields = array(
                        'app_id' => "34616f71-becf-481d-84ff-e4791585945b",
                        'filters' => array(array("field" => "tag", "key" => $notification_key, "relation" => "=", "value" => "true") ),
                        'data' => array("foo" => "bar"),
                        'contents' => $content
            );
              
                    $fields = json_encode($fields);

                    $ch = curl_init();
                    curl_setopt($ch, CURLOPT_URL, "https://onesignal.com/api/v1/notifications");
                    curl_setopt($ch, CURLOPT_HTTPHEADER, array('Content-Type: application/json; charset=utf-8',
                                                               'Authorization: Basic ZWIxM2ViNWUtYzk3Yi00MGMzLWJlMWItNGE5Nzk4MmUxZDM5'));
                    curl_setopt($ch, CURLOPT_RETURNTRANSFER, TRUE);
                    curl_setopt($ch, CURLOPT_HEADER, FALSE);
                    curl_setopt($ch, CURLOPT_POST, TRUE);
                    curl_setopt($ch, CURLOPT_POSTFIELDS, $fields);
                    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, FALSE);

                    $response = curl_exec($ch);
                    curl_close($ch);
                $results = $response;

    }

    public function getMsgList($id) {
        $sql = "SELECT e_events_dialog.*  FROM `e_events_dialog` WHERE event_id = '$id' ";
        $results = \Service\DatabaseService::executeQuery($sql);
        return $results;
    }

    public function getAllExel(){

        $res = "SELECT p_history_partner_incom.* , (select title from p_partner where p_partner.id =  p_history_partner_incom.partner_id) as title FROM `p_history_partner_incom` WHERE is_del = '0' ";
        $row= $this->dbService->executeQuery($res);

        $filename = "exel.xls"; // File Name
        // Download file
        header('Content-Encoding: UTF-8');
        header("Content-Disposition: attachment; filename=\"$filename\"");
        header("Content-Type: application/vnd.ms-excel");

        // Write data to file
        $flag = false;
        foreach( $row as $value ) {
                    if (!$flag) {
                        // display field/column names as first row
                        echo implode("\t", array_keys((array)$value)) . "\r\n";
                        $flag = true;
                    }
                     $val = implode("\t", array_values((array)$value)) . "\r\n";

                    echo iconv(mb_detect_encoding($val), "windows-1251", $val);
        }

        $res = "SELECT * FROM `p_partner` WHERE is_del = '0' ";
        $row= $this->dbService->executeQuery($res);

        $flag = false;

        echo  "\r\n";
        
        foreach( $row as $value ) {
                    if (!$flag) {
                        // display field/column names as first row
                        echo implode("\t", array_keys((array)$value)) . "\r\n";
                        $flag = true;
                    }
                     $val = implode("\t", array_values((array)$value)) . "\r\n";

                    echo iconv(mb_detect_encoding($val), "windows-1251", $val);
        }



    }

}
