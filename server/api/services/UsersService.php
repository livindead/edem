<?php

namespace App\Service;

require_once 'services/DatabaseService.php';

class UsersService {

    private $dbService = null;

    public function __construct() {
     
    }

    public function updatePanelUserPass($id,$pass) {
        $sql = "UPDATE `e_panel_users` SET pass = '$pass'  WHERE id = $id AND is_del = '0' ";
        $results = \Service\DatabaseService::executeQuery($sql);
        return $results;
    }


    public function updatePanelUserInfo($id,$fio,$phone,$mail) {
        $sql = "UPDATE `e_panel_users` SET fio = '$pass',  phone = '$phone',  mail = '$mail',   WHERE id = $id AND is_del = '0' ";
        $results = \Service\DatabaseService::executeQuery($sql);
        return $results;
    }


    public function getById($id) {
        $sql = "SELECT * FROM `p_users`  WHERE id = $id AND is_del = '0' ";
          $results = \Service\DatabaseService::executeQuery($sql);
        return $results;
    }

 
    

    public function getAll() {
        $sql = "SELECT * FROM `r_users` WHERE is_del = '0' ";
        $results = \Service\DatabaseService::executeQuery($sql);
        return $results;
    }

   
   
    public function regUser($phone) {

            $query = "SELECT phone,pass,id FROM `p_users` WHERE `phone`='{$phone}'   LIMIT 1";
            $row= $this->dbService->executeQuery($query);

            if (count($row) > 0) {
                $results = "exist";
                $new_pass = rand(0,9999);
                $sql = "UPDATE  `p_users` SET   pass = '$new_pass'  WHERE   `id` = '".$row[0]->id."' ; ";
                $this->dbService->executeQueryWOR($sql);

                $data = array(
                        array('phone' => $phone, 'text' => utf8_encode('PayBack code '.$new_pass ))
                );
                     
                $array = array_chunk($data, 50, true);

                foreach ($array as $chunk) {
                        // Инициализация соединения с сервером OperSMS:
                        $ch = curl_init("http://83.69.139.182:8080/");
                        // Включаем опцию возврата ответа:
                        curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
                        // Устанавливаем ограничение на выполнение запроса 30 секунд:
                        curl_setopt($ch, CURLOPT_TIMEOUT, 30);
                      
                        // Вариант 1. Рекомендуется следующая конструкция:
                        //print_r(json_encode($chunk));

                        /*curl_setopt($ch, CURLOPT_POSTFIELDS, array(
                            "login"    => "axmedbaev",
                            "password" => "MB6h94m8WF5s",
                            // Кодируем массив в формат JSON:
                            "data"     => json_encode($chunk)
                        ));

                        */
                        curl_setopt($ch, CURLOPT_POSTFIELDS, "login=axmedbaev&password=MB6h94m8WF5s&data=" . json_encode($chunk));
                      
                        // Записываем результат выполнения запроса в переменную:
                        $result = curl_exec($ch);
                        // Закрываем соединение с сервером OperSMS:

                        if(curl_errno($ch)){
                           $result = 'Ошибка curl: ' . curl_error($ch);
                        }

                        curl_close($ch);
                      
                        return ($result);
                }

                return $row[0]->pass;
            } else {
                    $res = "SELECT MAX(id) as count FROM p_users";
                    $row= $this->dbService->executeQuery($res);
                    $count = $row[0]->count ;
                    $count++;

                    $new_pass = rand(0,9999);

                    $sql = "INSERT INTO `p_users` (`id`, `phone`, `pass`, `is_del`) VALUES ('$count', '$phone', '$new_pass', '0');";

                    $this->dbService->executeQueryWOR($sql);
         

                  
                    $data = array(
                        array('phone' => $phone, 'text' => utf8_encode('PayBack code '.$new_pass ))
                    );
                     
                    $array = array_chunk($data, 50, true);

                    foreach ($array as $chunk) {
                        // Инициализация соединения с сервером OperSMS:
                        $ch = curl_init("http://83.69.139.182:8080/");
                        // Включаем опцию возврата ответа:
                        curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
                        // Устанавливаем ограничение на выполнение запроса 30 секунд:
                        curl_setopt($ch, CURLOPT_TIMEOUT, 30);
                      
                        // Вариант 1. Рекомендуется следующая конструкция:
                        //print_r(json_encode($chunk));

                        /*curl_setopt($ch, CURLOPT_POSTFIELDS, array(
                            "login"    => "axmedbaev",
                            "password" => "MB6h94m8WF5s",
                            // Кодируем массив в формат JSON:
                            "data"     => json_encode($chunk)
                        ));

                        */
                        curl_setopt($ch, CURLOPT_POSTFIELDS, "login=axmedbaev&password=MB6h94m8WF5s&data=" . json_encode($chunk));
                      
                        // Записываем результат выполнения запроса в переменную:
                        $result = curl_exec($ch);
                        // Закрываем соединение с сервером OperSMS:

                        if(curl_errno($ch)){
                           $result = 'Ошибка curl: ' . curl_error($ch);
                        }

                        curl_close($ch);
                      
                        return ($result);
                    }
            }





       

    }

     public function addViaSocial($mail,$pass,$fio,$avatar,$type) {
            

            if($type == "vk"){
                $results = "success vk";
                $query = "SELECT * FROM `r_users` WHERE `key`='{$mail}'   LIMIT 1";
                $row= \Service\DatabaseService::executeQuery($query);

                if (count($row) > 0) {
                    $results = $row;
                } else {
                        $res = "SELECT MAX(id) as count FROM r_users";
                        $row= \Service\DatabaseService::executeQuery($res);
                        $count = $row[0]->count ;
                        $count++;

                        $new_pass = rand(0,9999);
                        $login = "vk".$mail;

                        $sql = "INSERT INTO `r_users` (`id`, `login`, `name`, `key`, `status`, `type`, `is_del`) VALUES ('$count', '$login', '$fio', '$mail', '0', '0', '0')";

                         $row= \Service\DatabaseService::executeQueryWOR($sql);

                        $query = "SELECT * FROM `r_users` WHERE `key`='{$mail}'   LIMIT 1";
                        $row= \Service\DatabaseService::executeQuery($query);
                         $results = $row;
                }
                return $results;
            }

            if($type == "fb"){
          
            }

    }


    public function getAllExel(){

        $res = "SELECT p_users.*, (select SUM(cash_back) from p_history_cash where user_id = p_users.id) as cashback FROM `p_users` WHERE is_del = '0' ";
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

 


    }

}
