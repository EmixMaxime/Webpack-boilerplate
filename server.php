<?php
ini_set('display_errors', 1);

$url = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$publicPath = __DIR__ . '/public';

// Si le fichier existe, on ne passe pas par le router
if ($url !== '/' && file_exists($publicPath . $url) && !is_dir($publicPath . $url)) {
  return false;
}

// On modifie certaines variable pour ne pas avoir de problèmes par la suite
$_SERVER['SCRIPT_NAME'] = '/index.php';
// On inclue le fichier qui sert de point d'entré pour notre application
require_once $publicPath . '/index.php';