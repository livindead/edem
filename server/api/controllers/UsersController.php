<?php
namespace App\Controller;

use Interop\Container\ContainerInterface;

class UsersController {
    protected $ci;

    public function __construct(ContainerInterface $ci) {
       $this->ci = $ci;
    }
    public function getAll($request, $response, $args) {
        $usersService =   \App\Service\UsersService::getAll();

        return $response->withStatus(200)->write(sprintf("%s(%s)", $args['callback'], json_encode($usersService) ));
    }

	public function regSocial($request, $response, $args) {
       
          
        $avatar = urldecode($args['avatar']);
    	$avatar = str_replace("|", "/", $avatar);

   	 	$user = \App\Service\UsersService::addViaSocial($args['mail'],$args['pass'],$args['fio'], $avatar,$args['type']);
     

        return $response->withStatus(200)->write(sprintf("%s(%s)", $args['callback'], json_encode($user) ));
    }
}