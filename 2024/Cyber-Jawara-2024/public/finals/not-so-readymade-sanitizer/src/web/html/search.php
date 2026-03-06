<?php

ini_set('display_errors', 0);
error_reporting(0);
header('Content-Type: application/json');

if(gethostbyname("not-so-readymade-sanitizer-bot") === $_SERVER['REMOTE_ADDR']){
    
    $db = new SQLite3(':memory:');

    $db->exec("CREATE TABLE IF NOT EXISTS notes (passwd TEXT NOT NULL)");

    $stmt = $db->prepare("SELECT COUNT(*) as count FROM notes");
    $result = $stmt->execute();
    $res = $result->fetchArray(SQLITE3_ASSOC);

    if ($res['count'] === 0) {
        $stmt = $db->prepare("INSERT INTO notes (passwd) VALUES (:passwd)");
        $stmt->bindValue(':passwd', getenv("PASSWORD"), SQLITE3_TEXT);
        $stmt->execute();
    }

    $q = trim($_GET['password']);

    try {
        if (isset($_GET['validate'])){
            $sql = "SELECT passwd FROM notes WHERE passwd = :q";
        }else {
            $sql = "SELECT * FROM notes WHERE passwd LIKE :q";
        }
        $stmt = $db->prepare($sql);
        $stmt->bindValue(':q', $q);
        $result = $stmt->execute();

        $res = $result->fetchArray(SQLITE3_ASSOC);
        if ($res) {
            http_response_code(200);
        } else {
            http_response_code(404);
        }
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(["error" => "An error occurred", "details" => $e->getMessage()]);
    } 
    
} else {
    die("i dont think you are a bot");
}