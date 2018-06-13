<?php
namespace App\Controller;

use Interop\Container\ContainerInterface;
use Respect\Validation\Validator as v;

class DinnersController {
    protected $ci;

    public function __construct(ContainerInterface $ci) {
       $this->ci = $ci;
    }

    public function getAll($request, $response, $args) {
        if(v::intVal()->validate( $args['id'] )){
          $net =   \App\Service\DinnersService::getAll($args['id'] );
          return $response->withStatus(200)->write(sprintf("%s(%s)", $args['callback'], json_encode($net) ));
        } else {
          $net =   \App\Service\DinnersService::getAll(0);
          return $response->withStatus(200)->write(sprintf("%s(%s)", $args['callback'], json_encode($net) ));
        }
     
    }

    public function getAllByNetworkId($request, $response, $args) {

      if(v::intVal()->validate( $args['id'] )){
        $net =   \App\Service\DinnersService::getAllByNetworkId($args['id']);
        return $response->withStatus(200)->write(sprintf("%s(%s)", $args['callback'], json_encode($net) ));
      } else {
         return $response->withStatus(400)->write(sprintf("%s(%s)",'', json_encode(['text'=>'Invalid id']) ));
      }
      
    }

    public function searchDinner($request, $response, $args) {
        $net =   \App\Service\DinnersService::searchDinner($args['line']);
        return $response->withStatus(200)->write(sprintf("%s(%s)", $args['callback'], json_encode($net) ));
    }

    public function getCategoryAll($request, $response, $args) {
      $net =   \App\Service\DinnersService::getCategoryAll();
      return $response->withStatus(200)->write(sprintf("%s(%s)", $args['callback'], json_encode($net) ));
    }


    public function getById($request, $response, $args) {
      $net =   \App\Service\DinnersService::getAllById($args['id']);
      return $response->withStatus(200)->write(sprintf("%s(%s)", $args['callback'], json_encode($net) ));
    }

    public function add($request, $response, $args) {
        $input = $request->getParsedBody();

  	    if ($input === null) {
  	       return $response->withStatus(400)->write(sprintf("%s(%s)",'', json_encode('err') ));
  	    } else {

            $is_auth =   \App\Service\AuthService::checkToken($input['token']);
            if($is_auth){
                $points =   \App\Service\RestourantService::add($input['network_id'],$input['adress'],$input['doc_num'],$input['contact_name'],$input['contact_phone'],$input['contact_info'],$input['contact_mail']   );
                return $response->withStatus(200)->write(sprintf("%s(%s)",'', json_encode(['text'=>'added'] ) ));
            }else{
                return $response->withStatus(400)->write(sprintf("%s(%s)",'', json_encode(['text'=>'Invalid token']) ));
            }
            
        }
 
    }

    public function setStatus($request, $response, $args) {
      $is_auth =   \App\Service\AuthService::checkToken($args['token']);
      if($is_auth){
          $net =   \App\Service\RestourantService::setStatus( $args['id'],$args['val']);
          return $response->withStatus(200)->write(sprintf("%s(%s)", $args['callback'], json_encode($net) ));
      }else{
          return $response->withStatus(400)->write(sprintf("%s(%s)",'', json_encode(['text'=>'Invalid token']) ));
      }

    }

    public function edit($request, $response, $args) {
        $input = $request->getParsedBody();

        if ($input === null) {
           return $response->withStatus(400)->write(sprintf("%s(%s)",'', json_encode('err') ));
        } else {

            $is_auth =   \App\Service\AuthService::checkToken($input['token']);
            if($is_auth){
                $points =   \App\Service\RestourantService::edit($input['network_id'],$input['adress'],$input['doc_num'],$input['contact_name'],$input['contact_phone'],$input['contact_info'],$input['contact_mail'] );
                return $response->withStatus(200)->write(sprintf("%s(%s)",'', json_encode(['text'=>'updated'] ) ));
            }else{
                return $response->withStatus(400)->write(sprintf("%s(%s)",'', json_encode(['text'=>'Invalid token']) ));
            }
            
        }
 
    }

 

}