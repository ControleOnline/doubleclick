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

    function __construct() {
        self::$render = new PhpRenderer();
        self::getResolver(self::$render);
        parent::__construct('double-click', 'Double Click');
    }

    public function widget($args, $instance) {
        
        $instance['id'] = 'div-gpt-ad-1433947640153-3';
        $instance['size'] = '[728, 90]';
        $instance['slot'] = '/18835487/ativo_beats_728x90_superbanner';
        $viewModel = new ViewModel($instance);
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
