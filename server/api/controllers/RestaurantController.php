<?php
namespace App\Controller;

use Interop\Container\ContainerInterface;
use Respect\Validation\Validator as v;

class RestourantController {
    protected $ci;

    public function __construct(ContainerInterface $ci) {
       $this->ci = $ci;
    }

    public function getAll($request, $response, $args) {

      $net =   \App\Service\RestaurantService::getAll();
      return $response->withStatus(200)->write(sprintf("%s(%s)", $args['callback'], json_encode($net) ));
    
    }

    public function getAllByNetworkId($request, $response, $args) {
      if(!v::intVal()->validate( $args['id'] ) ){
          return $response->withStatus(200)->write(sprintf("%s(%s)", $args['callback'], json_encode(['text'=>'Invalid request '.$args['id'] ]) ));
      } else {
          $net =   \App\Service\RestaurantService::getAllByNetId($args['id'] );
          return $response->withStatus(200)->write(sprintf("%s(%s)", $args['callback'], json_encode($net) )); 
      }
    }

    public function addRes($request, $response, $args) {
        $input = $request->getParsedBody();

  	    if ($input === null) {
  	       return $response->withStatus(400)->write(sprintf("%s(%s)",'', json_encode('err') ));
  	    } else {

            $is_auth =   \App\Service\AuthService::checkToken($input['token']);
            if($is_auth){
                $points =   \App\Service\RestaurantService::add($input['network_id'],$input['adress'],$input['doc_num'],$input['contact_name'],$input['contact_phone'],$input['contact_info'],$input['contact_mail']   );
                return $response->withStatus(200)->write(sprintf("%s(%s)",'', json_encode(['text'=>'added'] ) ));
            }else{
                return $response->withStatus(400)->write(sprintf("%s(%s)",'', json_encode(['text'=>'Invalid token']) ));
            }
            
        }
 
    }

    public function addResFast($request, $response, $args) {
        $input = $request->getParsedBody();

        if(!v::stringType()->noWhitespace()->validate( $input['adress'] ) && !v::intVal()->validate( $input['phone'] ) && !v::stringType()->noWhitespace()->validate( $input['email'] )  && !v::stringType()->noWhitespace()->validate( $input['login'] ) && !v::stringType()->noWhitespace()->validate( $input['pass'] ) && !v::stringType()->noWhitespace()->validate( $input['doc'] )  ){

          return $response->withStatus(200)->write(json_encode(['text'=>'Invalid request']));
        }  else {

            $is_auth =   \App\Service\AuthService::checkToken($input['token']);
            if($is_auth){
                $points =   \App\Service\RestaurantService::addFast($input['network_id'],$input['adress'],$input['phone'],$input['email'],$input['login'],$input['pass'],$input['doc']   );
                return $response->withStatus(200)->write(sprintf("%s(%s)",'', json_encode(['text'=>'added'] ) ));
            }else{
                return $response->withStatus(400)->write(sprintf("%s(%s)",'', json_encode(['text'=>'Invalid token']) ));
            }
            
        }
 
    }

    public function setStatus($request, $response, $args) {
      $is_auth =   \App\Service\AuthService::checkToken($args['token']);
      if($is_auth){
          $net =   \App\Service\RestaurantService::setStatus( $args['id'],$args['val']);
          return $response->withStatus(200)->write(sprintf("%s(%s)", $args['callback'], json_encode($net) ));
      }else{
          return $response->withStatus(400)->write(sprintf("%s(%s)",'', json_encode(['text'=>'Invalid token']) ));
      }

    }

    public function edit($request, $response, $args) {
        $input = $request->getParsedBody();

        if(!v::stringType()->noWhitespace()->validate( $input['adress'] ) && !v::stringType()->noWhitespace()->validate( $input['phone'] ) && !v::stringType()->noWhitespace()->validate( $input['email'] )  && !v::stringType()->noWhitespace()->validate( $input['login'] ) && !v::stringType()->noWhitespace()->validate( $input['pass'] ) && !v::stringType()->noWhitespace()->validate( $input['doc'] )  ){

          return $response->withStatus(200)->write(json_encode(['text'=>'Invalid request']));
        }  else {

            $is_auth =   \App\Service\AuthService::checkToken($input['token']);
            if($is_auth){

                $points =   \App\Service\RestaurantService::smalEdit($input['id'],$input['adress'],$input['phone'],$input['email'],$input['login'],$input['pass'],$input['doc'] );
                return $response->withStatus(200)->write( json_encode(['text'=>'updated'] ));
            }else{
                return $response->withStatus(400)->write(json_encode(['text'=>'Invalid token']));
            }
            
        }
 
    }

 

}