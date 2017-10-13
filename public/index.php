<?php
require 'Asset/Asset.php';

// For dev
//$asset = Asset::getInstance(null, 'http://localhost:3003/assets');

// For prod, after build
$assetsFile = __DIR__ . '/assets/assets.json';
$asset = Asset::getInstance($assetsFile);
?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <title>Webpack-boilerplate</title>
</head>
<body>

  <div id="app"></div>

  <script src="<?php echo $asset->path('manifest.js'); ?>"></script>
  <script src="<?php echo $asset->path('commons.js'); ?>"></script>
  <script src="<?php echo $asset->path('home.js'); ?>"></script>
</body>
</html>