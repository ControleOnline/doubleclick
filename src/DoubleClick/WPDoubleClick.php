<?php

namespace DoubleClick;

class WPDoubleClick {

    protected static $render;

    public static function init() {
        wp_enqueue_script('DoubleClick', plugins_url('../public/js/vendor/ControleOnline/dfp.js', dirname(__FILE__)));        
    }
    public static function deactivateDoubleClick() {
        
    }

    public static function activateDoubleClick() {
        
    }

}
