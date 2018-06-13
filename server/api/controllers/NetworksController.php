<?php
namespace App\Controller;

use Interop\Container\ContainerInterface;
use Respect\Validation\Validator as v;

class NetworksController {
    protected $ci;

    public function __construct(ContainerInterface $ci) {
       $this->ci = $ci;
    }

    public function getAll($request, $response, $args) {
  
          $net =   \App\Service\NetworksService::getAll();
          return $response->withStatus(200)->write(sprintf("%s(%s)", $args['callback'], json_encode($net) ));
   

    }

    public function addNetwork($request, $response, $args) {
        $input = $request->getParsedBody();

  	   if(!v::stringType()->noWhitespace()->validate( $input['title'] ) && !v::stringType()->noWhitespace()->validate( $input['contact'] ) && !v::stringType()->noWhitespace()->validate( $input['logo'] )  ){
          return $response->withStatus(200)->write(sprintf("%s(%s)", $args['callback'], json_encode(['token' => null,'text'=>'Invalid request']) ));
        }  else {

            $is_auth =   \App\Service\AuthService::checkToken($input['token']);
            if($is_auth){
                $points =   \App\Service\NetworksService::addNetwork($input['title'],$input['contact'],$input['mail'],$input['logo'] );
                return $response->withStatus(200)->write(  json_encode(['text'=>'added'] )  );
            }else{
                return $response->withStatus(400)->write(  json_encode(['text'=>'Invalid token'])  );
            }
            
        }
 
    }

    public function setStatus($request, $response, $args) {
      $is_auth =   \App\Service\AuthService::checkToken($args['token']);
      if($is_auth){
          $net =   \App\Service\NetworksService::setStatus( $args['id'],$args['val']);
          return $response->withStatus(200)->write(sprintf("%s(%s)", $args['callback'], json_encode($net) ));
      }else{
          return $response->withStatus(400)->write(sprintf("%s(%s)",$args['callback'], json_encode(['text'=>'Invalid token']) ));
      }

    }

     public function editNetwork($request, $response, $args) {
        $input = $request->getParsedBody();

       if(!v::intVal()->validate( $input['id'] ) && !v::stringType()->noWhitespace()->validate( $input['title'] ) && !v::stringType()->noWhitespace()->validate( $input['contact'] ) && !v::stringType()->noWhitespace()->validate( $input['logo'] )  ){
          return $response->withStatus(200)->write(sprintf("%s(%s)", $args['callback'], json_encode(['token' => null,'text'=>'Invalid request']) ));
        }  else {

            $is_auth =   \App\Service\AuthService::checkToken($input['token']);
            if($is_auth){
                $points =   \App\Service\NetworksService::editNetwork($input['id'], $input['title'],$input['contact'], $input['logo'] );
                return $response->withStatus(200)->write( json_encode(['text'=>'updated'] )  );
            }else{
                 return $response->withStatus(400)->write(  json_encode(['text'=>'Invalid token'])  );
            }
            
        }
 
    }

 

}