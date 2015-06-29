<?php

namespace DoubleClick\Helper;

use Zend\View\Model\ViewModel,
    Zend\View\Renderer\PhpRenderer,
    Zend\View\Resolver\AggregateResolver,
    Zend\View\Resolver\TemplateMapResolver,
    Zend\View\Resolver\RelativeFallbackResolver,
    Zend\View\Resolver\TemplatePathStack;

class Widget extends \WP_Widget {

    protected static $render;
    protected static $wpdb;

    function __construct() {
        global $wpdb;
        self::$wpdb = $wpdb;
        self::$render = new PhpRenderer();
        self::getResolver(self::$render);
        Options::init(self::$wpdb);
        parent::__construct('double-click', 'Double Click');
    }

    private function getBannerByTaxonomy($size_id, $category_id, $taxonomy_type) {
        $table_name = self::$wpdb->prefix . 'dfp_slots';
        $table_sizes = self::$wpdb->prefix . 'dfp_sizes';
        $table_taxonomy = self::$wpdb->prefix . 'dfp_slots_taxonomy';
        $result = self::$wpdb->get_results(
                "SELECT {$table_name}.*,{$table_sizes}.size,{$table_sizes}.width,{$table_sizes}.height FROM {$table_name} 
                        INNER JOIN {$table_sizes}                             
                        ON ({$table_name}.size_id = {$table_sizes}.id)
                        LEFT JOIN {$table_taxonomy} 
                        ON ({$table_taxonomy}.slot_id = {$table_name}.id)
                        WHERE {$table_name}.size_id ='" . $size_id . "'
                        AND {$table_taxonomy}.taxonomy_id = '" . $category_id . "'
                        AND {$table_taxonomy}.taxonomy_type = '" . $taxonomy_type . "'
                        "
        );
        if ($result) {
            $banner['id'] = $result[0]->dfp_id;
            $banner['size'] = '[' . $result[0]->width . ', ' . $result[0]->height . ']';
            $banner['slot'] = $result[0]->slot;
            return $banner;
        }
    }

    private function getBanner($size_id) {
        $page_id = get_queried_object_id();
        $categories = get_the_category();        
        if ($page_id) {
            $banner = $this->getBannerByTaxonomy($size_id, $page_id, 'page');
        }        
        if ($categories && !$banner) {            
            $category_id = $categories[0]->term_id;
            $banner = $this->getBannerByTaxonomy($size_id, $category_id, 'category');
        }
        return $banner;
    }

    public function widget($args, $instance) {
        $banner = $this->getBanner($instance['size']);
        $viewModel = new ViewModel($banner);
        $viewModel->setTerminal(true);
        echo self::$render->partial('widget/dfp.phtml', $viewModel);
    }

    /**
     * Salva os dados do widget no banco de dados
     *
     * @param array $new_instance Os novos dados do widget (a serem salvos)
     * @param array $old_instance Os dados antigos do widget
     *
     * @return array $instancia Dados atualizados a serem salvos no banco de dados
     */
    public function update($new_instance, $old_instance) {

        $instance = array();
        $instance['title'] = (!empty($new_instance['title']) ) ? strip_tags($new_instance['title']) : '';
        $instance['size'] = (!empty($new_instance['size']) ) ? strip_tags($new_instance['size']) : '';
        return $instance;
    }

    /**
     * Formulário para os dados do widget (exibido no painel de controle)
     *
     * @param array $instance Instância do widget
     */
    public function form($instance) {
        $instance['fields']['title'] = $this->get_field_name('title');
        $instance['fields']['id'] = $this->get_field_id('title');
        $instance['fields']['size'] = $this->get_field_name('size');
        $instance['fields']['sizes'] = Options::getSizes();
        $viewModel = new ViewModel($instance);
        $viewModel->setTerminal(true);
        echo self::$render->partial('widget/options.phtml', $viewModel);
    }

    private static function getResolver($renderer) {
        $resolver = new AggregateResolver();
        $renderer->setResolver($resolver);
        $map = new TemplateMapResolver(array(
            'layout' => __DIR__ . '/../view/layout.phtml'
        ));
        $stack = new TemplatePathStack(array(
            'script_paths' => array(
                dirname(__FILE__) . '/../View/'
            )
        ));

        $resolver->attach($map)->attach($stack)->attach(new RelativeFallbackResolver($map))->attach(new RelativeFallbackResolver($stack));
    }

}
