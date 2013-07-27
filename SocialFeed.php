<?php

class SocialFeed extends CWidget {

    /**
     * ID of a Facebook page which stream will be shown
     */
    public $fb_username;

    /**
     * number of facebook posts to show
     */
    public $fb_limit;

    /**
     * width of fb comment box
     */
    public $fb_token;

    /**
     * show media bolean
     */
    public $show_media = false;

    /**
     * assets
     */
    public $assets;

    /**
     * color scheme
     */
    public $length;

    /**
     * show stream
     */
    public $cookies = true;

    /**
     * show border
     */
    public $plugin_folder;

    /**
     * show header
     */
    public $template;
    protected $assetsPath;

    /**
     * URL to assets
     *
     * @var string
     */
    protected $assetsUrl;

    public function init() {
        // Assets
        if ($this->assetsPath === NULL) {
            $this->assetsPath = dirname(__FILE__) . DIRECTORY_SEPARATOR . 'assets/';
        }

        if ($this->assetsUrl === NULL) {
            $this->assetsUrl = Yii::app()->assetManager->publish($this->assetsPath);
        }

        $this->assets = Yii::app()->getAssetManager()->publish(dirname(__FILE__) . '/assets/'); //, false, -1, true
        //https://www.facebook.com/FacebookDevelopers
        if (!empty($this->fb_username))
            $this->fb_username = $this->fb_username;
        if (!empty($this->fb_limit))
            $this->fb_limit = $this->fb_limit;
        if (!empty($this->fb_token))
            $this->fb_token = $this->fb_token;
        if (!empty($this->show_media))
            $this->show_media = $this->show_media;
        if (!empty($this->cookies))
            $this->cookies = $this->cookies;
        if (!empty($this->length))
            $this->length = $this->length;
        if (!empty($this->template))
            $this->template = $this->template;
    }

    public function run() {

        $cs = Yii::app()->clientScript;
        $cs->registerCoreScript('jquery');
        $cs->registerCssFile($this->assets . '/css/jquery.socialfeed.css');
        $cs->registerScriptFile($this->assets . '/js/jquery.socialfeed.utility.js');
        $cs->registerScriptFile($this->assets . '/js/jquery.socialfeed.js');
        $cs->registerScriptFile($this->assets . '/template.html');
        $cs->registerScriptFile($this->assets . '/img/fb-icon-24.png');
        if (!empty($this->fb_username)) {
            $html = ' <div class="social-feed-container">
            </div>';

            echo '
                ' . $this->js . $html;
        } else {
            echo '<div style="width:100%;padding:10px;color:#FF0000">username not found!</div>';
        }
    }

    /**
     * Renders the contents of the <script> tag
     *
     * @return string
     */
    public function getJs() {
        $ret = '<script>
                      $(document).ready(function(){
                $(".social-feed-container").socialfeed({
                  plugin_folder:"' . $this->assetsUrl . '/",
                    template:"' . $this->assetsUrl . '/' . $this->template . '",
                    fb_username:"' . $this->fb_username . '",
                    fb_limit:"' . $this->fb_limit . '",
                    fb_token:"' . $this->fb_token . '",
                    length:"' . $this->length . '",
                    show_media:"' . $this->show_media . '",
                    cookies:"' . $this->cookies . '"
                });
            });
                </script>';

        return $ret;
    }

}

?>