<?php

declare(strict_types=1);

namespace App\Application\Actions\User;

use Psr\Http\Message\ResponseInterface as Response;
use Slim\Exception\HttpBadRequestException;

class LoginAction extends UserAction
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

        return $body;
    }

    protected function action(): Response
    {
        $body = $this->validateRequestBody();
        $user = $this->userRepository->findUser($body['username'], $body['password']);
        $session = $this->getStateManager();
        $session->store('username', $body['username']);
        return $this->respondWithData($user);
    }
}
