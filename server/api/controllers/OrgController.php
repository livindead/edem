<?php
namespace App\Controller;

use Interop\Container\ContainerInterface;
use Respect\Validation\Validator as v;

class OrgsController {
    protected $ci;

    public function __construct(ContainerInterface $ci) {
       $this->ci = $ci;
    }


    public function uploadFile($request, $response, $args){
        $uploadedFiles = $request->getUploadedFiles();

        $directory =  $_SERVER['DOCUMENT_ROOT']. '/edim-server/public/uploads/images';
        $uploadedFile = $uploadedFiles['file'];
        if ($uploadedFile->getError() === UPLOAD_ERR_OK) {

            $extension = pathinfo($uploadedFile->getClientFilename(), PATHINFO_EXTENSION);
            $basename = bin2hex(random_bytes(8)); 
            $filename = sprintf('%s.%0.8s', $basename, $extension);

            $uploadedFile->moveTo($directory . DIRECTORY_SEPARATOR . $filename);
                        
            return $response->withStatus(200)->write(json_encode(['status'=>true,'directory'=>$directory,'image'=>$filename]) );
        } else {
             return $response->withStatus(200)->write(json_encode(['status'=>false,'image'=>null] ) );
        }

       

    }


    public function checkLogin($request, $response, $args){
        
       
        if(!v::stringType()->noWhitespace()->validate( $args['login'] ) && !v::stringType()->noWhitespace()->validate( $args['password'] )  ){
          return $response->withStatus(200)->write(sprintf("%s(%s)", $args['callback'], json_encode(['token' => null,'text'=>'Invalid request']) ));
        } else {
            $token =   \App\Service\AuthService::getToken($args['login'],$args['password']);
            if($token == null) {
              return $response->withStatus(200)->write(sprintf("%s(%s)", $args['callback'], json_encode(['token' => null, 'text'=>'Login or Password incorrect']) ));
            } else {
              return $response->withStatus(200)->write(sprintf("%s(%s)", $args['callback'], json_encode(['token'=>$token] ) ));
            }
          
        }
    }

    public function updateUserPass($request, $response, $args) {
        $input = $request->getParsedBody();

       if(v::intVal()->validate( $input['id'] ) && !v::stringType()->noWhitespace()->validate( $input['pass'] )   ){
          return $response->withStatus(200)->write(sprintf("%s(%s)", $args['callback'], json_encode(['token' => null,'text'=>'Invalid request']) ));
        }  else {

            $is_auth =   \App\Service\AuthService::checkToken($input['token']);
            if($is_auth){
                $points =   \App\Service\UsersService::updatePanelUserPass($input['id'], $input['pass'] );
                return $response->withStatus(200)->write( json_encode(['text'=>'updated'] )  );
            }else{
                 return $response->withStatus(200)->write(  json_encode(['text'=>'Invalid token'])  );
            }
            
        }
 
    }

     public function updateUserInfo($request, $response, $args) {
        $input = $request->getParsedBody();

       if(v::intVal()->validate( $input['id'] ) && !v::stringType()->validate( $input['fio'] )  && !v::stringType()->noWhitespace()->validate( $input['mail'] ) && !v::stringType()->noWhitespace()->validate( $input['phone'] ) ){
          return $response->withStatus(200)->write(sprintf("%s(%s)", $args['callback'], json_encode(['token' => null,'text'=>'Invalid request']) ));
        }  else {

            $is_auth =   \App\Service\AuthService::checkToken($input['token']);
            if($is_auth){
                $points =   \App\Service\UsersService::updatePanelUserInfo($input['id'], $input['fio'] , $input['phone'] , $input['mail']);
                return $response->withStatus(200)->write( json_encode(['text'=>'updated'] )  );
            }else{
                 return $response->withStatus(200)->write(  json_encode(['text'=>'Invalid token'])  );
            }
            
        }
 
    }


    //===
    public function getAllPoints($request, $response, $args) {
        $points =   \App\Service\OrgService::getAllPoints();
        return $response->withStatus(200)->write(sprintf("%s(%s)", $args['callback'], json_encode($points) ));
    }
    public function addPoint($request, $response, $args) {
        //$points =   \App\Service\OrgService::addPoint();

        $input = $request->getParsedBody();

	    if ($input === null) {
	       return $response->withStatus(400)->write(sprintf("%s(%s)",'', json_encode('err') ));
	    } else {
           $points =   \App\Service\OrgService::addPoint($input['title'],$input['adres'],$input['archiv'],$input['coord'],$input['users'],'',$input['is_building']);
           return $response->withStatus(200)->write(sprintf("%s(%s)",'', json_encode(['status'=>'added'] ) ));
        }
 
    }

    public function getPoint($request, $response, $args) {
        //$points =   \App\Service\OrgService::addPoint();
      
        $points =   \App\Service\OrgService::getPoint($args['uid']);
        return $response->withStatus(200)->write(sprintf("%s(%s)", $args['callback'], json_encode($points) ) );
    }

    public function addEvent($request, $response, $args) {
        $input = $request->getParsedBody();

        if ($input === null) {
           return $response->withStatus(400)->write(sprintf("%s(%s)",'', json_encode('err') ));
        } else {
           $points =   \App\Service\OrgService::addEvent($input['text'],$input['class'],$input['point_id'],$input['date'],$input['creator_id']);
           return $response->withStatus(200)->write(sprintf("%s(%s)",'', json_encode(['status'=> $points ] ) ));
        }
 
    }
    public function addMessage($request, $response, $args) {
        $input = $request->getParsedBody();

        if ($input === null) {
           return $response->withStatus(400)->write(sprintf("%s(%s)",'', json_encode('err') ));
        } else {
           $points =   \App\Service\OrgService::addMsg($input['event_id'], $input['sender_id'], $input['text']);
           return $response->withStatus(200)->write(sprintf("%s(%s)",'', json_encode(['status'=>'added'] ) ));
        }
 
    }
    
    public function closeEvent($request, $response, $args) {

      $user = \App\Service\OrgService::closeEvent($args['id']);
      return $response->withStatus(200)->write(sprintf("%s(%s)", $args['callback'], json_encode($user) ));
    }

    public function getMessageList($request, $response, $args) {

      $user = \App\Service\OrgService::getMsgList($args['id']);
      return $response->withStatus(200)->write(sprintf("%s(%s)", $args['callback'], json_encode($user) ));
    }

    public function getAllEvents($request, $response, $args) {
        $points =   \App\Service\OrgService::getAllEvents();
        return $response->withStatus(200)->write(sprintf("%s(%s)", $args['callback'], json_encode($points) ));
    }

}