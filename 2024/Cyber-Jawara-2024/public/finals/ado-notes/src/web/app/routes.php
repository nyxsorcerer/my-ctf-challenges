<?php
declare(strict_types=1);



use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use Slim\App;
use Slim\Interfaces\RouteCollectorProxyInterface as Group;

return function (App $app) {
    $app->options('/{routes:.*}', function (Request $request, Response $response) {
        // CORS Pre-Flight OPTIONS Request Handler
        $response->withHeader('Access-Control-Allow-Origin', '*');
        return $response;
    });

    $app->group('/api', function (Group $group) {
        $group->group('/notes', function (Group $group) {
            $group->get('/search', \App\Application\Actions\Note\SearchNotesAction::class);
            $group->get('/{id}', \App\Application\Actions\Note\ViewNoteAction::class);
            $group->put('/{id}', \App\Application\Actions\Note\UpdateNoteAction::class);
            $group->delete('/{id}', \App\Application\Actions\Note\DeleteNoteAction::class);
            $group->post('', \App\Application\Actions\Note\CreateNoteAction::class);
        });
        
        $group->group('/user', function (Group $group) {
            $group->post('/login', \App\Application\Actions\User\LoginAction::class);
            $group->post('/register', \App\Application\Actions\User\RegisterAction::class);
        });
    });

    $app->get('/download/{id}', \App\Application\Actions\Note\DownloadNoteAction::class);

    $app->get('/', function (Request $request, Response $response) {
        $response->getBody()->write(file_get_contents(__DIR__ . "/../templates/index.html"));
        return $response;
    });
};
