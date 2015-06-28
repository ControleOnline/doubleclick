<?php

namespace DoubleClick\Helper;

class Options {

    private static $wpdb;

    public static function init($wpdb) {
        self::$wpdb = $wpdb;
    }

    public static function getSizes() {
        $table_name = self::$wpdb->prefix . 'dfp_sizes';
        return self::$wpdb->get_results("SELECT * FROM {$table_name}");
    }

    public static function addSizes() {
        $table_name = self::$wpdb->prefix . 'dfp_sizes';
        $id = filter_input(INPUT_POST, 'id');
        $size = filter_input(INPUT_POST, 'size');
        $width = filter_input(INPUT_POST, 'width');
        $height = filter_input(INPUT_POST, 'height');
        $delete = filter_input(INPUT_POST, 'delete');
        if ($delete) {
            self::$wpdb->delete($table_name, array('id' => $id), array('%d'));
        } elseif ($size && $width && $height) {
            if ($id) {
                self::$wpdb->update($table_name, array('size' => $size, 'width' => $width, 'height' => $height), array('id' => $id), array('%s', '%d', '%d'));
            } else {
                self::$wpdb->insert($table_name, array('size' => $size, 'width' => $width, 'height' => $height), array('%s', '%d', '%d'));
            }
        }
    }

}
