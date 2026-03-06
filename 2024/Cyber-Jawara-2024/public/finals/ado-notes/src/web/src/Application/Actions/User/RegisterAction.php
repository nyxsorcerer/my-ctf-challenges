<?php

declare(strict_types=1);

namespace App\Application\Actions\User;

use App\Domain\User\User;
use Psr\Http\Message\ResponseInterface as Response;
use Slim\Exception\HttpBadRequestException;

class RegisterAction extends UserAction
{

    private function validateRequestBody(): array
    {
        $body = $this->getFormData();

        if (empty($body['username']) || !is_string($body['username'])) {
            throw new HttpBadRequestException($this->request,'The "username" field is required and must be a string.');
        }

        if (empty($body['password']) || !is_string($body['password'])) {
            throw new HttpBadRequestException($this->request, 'The "password" field is required and must be a string.');
        }

        if (strlen($body['username']) < 8) {
            throw new HttpBadRequestException($this->request, 'The "username" must be at least 8 characters long.');
        }

        if (strlen($body['password']) < 8) {
            throw new HttpBadRequestException($this->request, 'The "password" must be at least 8 characters long.');
        }

        return $body;
    }

    protected function action(): Response
    {
        $body = $this->validateRequestBody();
        $user = $this->userRepository->save(new User(null, $body['username'], $body['password']));
        $session = $this->getStateManager();
        $session->store('username', $body['username']);
        return $this->respondWithData($user);
    }
}
