<?php

class Asset
{

  /**
   * @var array
   */
  private $files;

  /**
   * @var String
   */
  private $assetsUri;

  /**
   * @var Asset
   */
  private static $_instance;

    /**
     *
     * @param null|String $assetPathfile - Si c'est pour la prod je donne que $assetPathfile
     * @param null|String $assetsUri - Si c'est pour le dev, je donne l'uri
     */
  public function __construct(?String $assetPathfile = null, ?String $assetsUri = null)
  {
    $this->assetsUri = $assetsUri;

    // In production, we use the assets.json file.
    if ($assetPathfile) {
      [$file, $_ext] = explode('.', $assetPathfile);

      $serializedFile = "$file.serialized";

      // The @ operator suppresses errors and warnings but it is a tool of last resort.
      $updated = @filemtime($serializedFile) !== filemtime($assetPathfile);

      if($updated) {
        $assetsInformations = json_decode(file_get_contents($assetPathfile));
        
        // Compute things
        foreach ($assetsInformations as $assetInformations) {
          foreach ($assetInformations as $key => $value) {
  
            // Get filename with hash
            preg_match("/\w+\.\w+/", $value, $filename);
            $filename = $filename[0];
  
            // Hash deletation
            preg_match('/^\w+/', $filename, $filename);
            $filename = $filename[0];
  
            $this->files[$key][$filename] = $value;
          }
        }

        file_put_contents($serializedFile, serialize($this->files));

      } else {
        $this->files = unserialize(file_get_contents($serializedFile));
      }

    }
  }

    /**
     * @param null|String $assetPathfile
     * @param null|String $assetsUri
     * @return Asset
     */
    public static function getInstance(?String $assetPathfile = null, ?String $assetsUri = null)
    {
      if (is_null(self::$_instance)) {
        self::$_instance = new Asset($assetPathfile, $assetsUri);
      }

      return self::$_instance;
    }

    /**
     * @param String $file
     * @return null|String
     */
    public function path(String $file): ?String
  {
    $parts = explode('.', $file);

    if ($this->assetsUri) {
      // Because in dev it's the js file who's inject the style
      if ($parts[1] === 'css') {
        return null;
      }

      return $this->assetsUri . '/' . $file;
    }

    $files = $this->files[$parts[1]]; // $parts[1] = file extension
    return $files[$parts[0]];
  }

}