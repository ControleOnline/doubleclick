<?php

namespace DoubleClick;

use DoubleClick\Helper\Widget,
    Zend\View\Model\ViewModel,
    Zend\View\Renderer\PhpRenderer,
    Zend\View\Resolver\AggregateResolver,
    Zend\View\Resolver\TemplateMapResolver,
    Zend\View\Resolver\RelativeFallbackResolver,
    Zend\View\Resolver\TemplatePathStack;

class WPDoubleClick {

    protected static $render;
    protected static $myOptions = array(
        'OptimizeAdmin'
    );
    protected static $mySiteOptions = array(
        'CookieLessDomain'
    );

    public static function init() {
        wp_enqueue_script('DoubleClick', plugins_url('../public/js/vendor/ControleOnline/dfp.js', dirname(__FILE__)));
        add_action('widgets_init', create_function('', 'return register_widget("\DoubleClick\Helper\Widget");'));
        self::$render = new PhpRenderer();
        self::getResolver(self::$render);
        if (filter_input(INPUT_POST, 'update_options')) {
            self::update_options();
        }
        if (is_admin()) {
            add_action('admin_menu', array('\DoubleClick\WPDoubleClick', 'menu'));
        }
    }

    public static function menu() {
        add_options_page('Double Click', 'Double Click', 'manage_options', '', array('\DoubleClick\WPDoubleClick', 'plugin_options'));
    }

    public static function deactivateDoubleClick() {
        
    }

    private static function update_options() {
        $options = filter_input_array(INPUT_POST)? : array();
        foreach ($options as $key => $option) {
            if (in_array($key, self::$myOptions)) {
                $o = get_option($key);
                ($o || $o === '0') ? update_option($key, $option) : add_option($key, $option, '', 'yes');
            }
            if (in_array($key, self::$mySiteOptions)) {
                $o = get_site_option($key);
                ($o || $o === '0') ? update_site_option($key, $option) : add_site_option($key, $option, '', 'yes');
            }
        }
    }

    public static function activateDoubleClick() {
        
    }

    private static function getResolver($renderer) {
        $resolver = new AggregateResolver();
        $renderer->setResolver($resolver);
        $map = new TemplateMapResolver(array(
            'layout' => __DIR__ . '/view/layout.phtml'
        ));
        $stack = new TemplatePathStack(array(
            'script_paths' => array(
                dirname(__FILE__) . '/View/'
            )
        ));

        $resolver->attach($map)->attach($stack)->attach(new RelativeFallbackResolver($map))->attach(new RelativeFallbackResolver($stack));
    }

    public static function plugin_options() {
        if (!current_user_can('manage_options')) {
            wp_die(__('You do not have sufficient permissions to access this page.'));
        }

        $viewModel = new ViewModel(array('foo' => 'bar'));
        $viewModel->setTerminal(true);
        echo self::$render->partial('plugin/options.phtml', $viewModel);
    }

}
