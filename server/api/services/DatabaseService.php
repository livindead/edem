<?php

namespace Service;

use \PDO;

class DatabaseService {

    private static $connection = null;

    private static function initConnection() {
        $dbhost = "localhost";
        $dbuser = "046397785_eda";
        $dbpass = "J{bC5nYvqNXL";
        $dbname = "www-eva-net_eda";
        $dbh = new PDO("mysql:host=$dbhost;dbname=$dbname", $dbuser, $dbpass);
        $dbh->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        $dbh->exec("SET CHARACTER SET utf8");
        self::$connection = $dbh;
    }

    public static function getConnection() {
        if (self::$connection == null) {
            self::initConnection();
        }
        return self::$connection;
    }

    public function executeQuery($sql) {
        try {
            $db = self::getConnection();

            $stmt = $db->query($sql);
            $results = $stmt->fetchAll(PDO::FETCH_OBJ);
            $db = null;
            return $results;
        } catch (PDOException $e) {
            echo '{"error":{"text":' . $e->getMessage() . '}}';
        }
    }

    public function executeQueryWOR($sql) {
        try {
            $db = self::getConnection();
            $stmt = $db->query($sql);
            $db = null;
        } catch (PDOException $e) {
            echo '{"error":{"text":' . $e->getMessage() . '}}';
        }
    }

}
