<?php
use \Psr\Http\Message\ServerRequestInterface as Request;
use \Psr\Http\Message\ResponseInterface as Response;

require 'vendor/autoload.php';

require 'services/OrgsService.php';
require 'services/UsersService.php';
require 'services/AuthService.php';
require 'services/NetworksService.php';
require 'services/RestaurantService.php';
require 'services/DinnersService.php';

require 'controllers/OrgController.php';
require 'controllers/UsersController.php';
require 'controllers/NetworksController.php';
require 'controllers/RestaurantController.php';
require 'controllers/DinnersController.php';

$config['displayErrorDetails'] = true;
$app = new Slim\App(["settings" => $config]);

$app->get('/', function ($request, $response, $args) {
    return $response->getBody()->write("Index api page");
});
$app->post('/image/add/', '\App\Controller\OrgsController::uploadFile');

$app->get('/panel/user/login/{login}/{password}/{callback}', '\App\Controller\OrgsController::checkLogin');
$app->post('/panel/user/update/pass/', '\App\Controller\OrgsController::updateUserPass');
$app->post('/panel/user/update/info/', '\App\Controller\OrgsController::updateUserInfo');

$app->post('/networks/add/', '\App\Controller\NetworksController::addNetwork');
$app->post('/networks/edit/', '\App\Controller\NetworksController::editNetwork');
$app->get('/networks/get/all/{callback}', '\App\Controller\NetworksController::getAll');
$app->get('/networks/set/status/{id}/{val}/{token}/{callback}', '\App\Controller\NetworksController::setStatus');

$app->post('/restaurant/add/', '\App\Controller\RestourantController::addRes');
$app->post('/restaurant/add/fast/', '\App\Controller\RestourantController::addResFast');
$app->post('/restaurant/edit/', '\App\Controller\RestourantController::edit');
$app->get('/restaurant/get/all/{callback}', '\App\Controller\RestourantController::getAll');
$app->get('/restaurant/get/network/{id}/{callback}', '\App\Controller\RestourantController::getAllByNetworkId');
$app->get('/restaurant/set/status/{id}/{val}/{token}/{callback}', '\App\Controller\RestourantController::setStatus');

$app->get('/dinners/get/all/{page}/{callback}', '\App\Controller\DinnersController::getAll');
$app->get('/dinners/get/category/all/{callback}', '\App\Controller\DinnersController::getCategoryAll');
$app->get('/dinners/get/network/id/{id}/{callback}', '\App\Controller\DinnersController::getAllByNetworkId');
$app->get('/dinners/search/{line}/{callback}','\App\Controller\DinnersController::searchDinner');

$app->get('/user/get/all/{callback}', '\App\Controller\UsersController::getAll');
$app->get('/points/get/all/{callback}', '\App\Controller\OrgsController::getAllPoints');
$app->post('/points/add/', '\App\Controller\OrgsController::addPoint');
$app->get('/points/id/{uid}/{callback}', '\App\Controller\OrgsController::getPoint');

$app->get('/user/reg/social/{mail}/{pass}/{fio}/{avatar}/{type}/{callback}', '\App\Controller\UsersController::regSocial');

$app->post('/events/add/', '\App\Controller\OrgsController::addEvent');
$app->post('/events/msg/add', '\App\Controller\OrgsController::addMessage');
$app->get('/events/msg/list/{id}/{callback}', '\App\Controller\OrgsController::getMessageList');
$app->get('/events/close/{id}/{callback}', '\App\Controller\OrgsController::closeEvent');

$app->get('/events/get/all/{callback}', '\App\Controller\OrgsController::getAllEvents');

$app->run();