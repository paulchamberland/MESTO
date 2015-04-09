<?php
class tester extends PHPUnit_Framework_TestCase {
    public function testMe() {
        $t = true;
        $this->assertEquals(true, $t);
    }
}
?>