<?php

declare(strict_types=1);

namespace App\Application\Actions\Note;

use App\Domain\Note\Note;
use Psr\Http\Message\ResponseInterface as Response;
use Slim\Exception\HttpBadRequestException;

class CreateNoteAction extends NoteAction
{

    private function validateRequestBody(): array
    {
        $body = $this->getFormData();

        if (!isset($body['title']) || trim($body['title']) === '') {
            throw new HttpBadRequestException($this->request, 'The "title" field is required.');
        }

        if (!isset($body['content']) || trim($body['content']) === '') {
            throw new HttpBadRequestException($this->request, 'The "content" field is required.');
        }

        if (filter_var($body['title'], FILTER_UNSAFE_RAW, FILTER_FLAG_STRIP_LOW | FILTER_FLAG_STRIP_HIGH) !== $body['title']) {
            throw new HttpBadRequestException($this->request, 'The "title" field contains invalid characters.');
        }

        return $body;
    }

    protected function action(): Response
    {
        $body = $this->validateRequestBody();
        $session = $this->getStateManager();
        if (!$session->exists('username')) {
            throw new HttpBadRequestException($this->request, 'Username is required to create a note.');
        }

        if ($session->retrieve('username') === getenv('ADMIN_USERNAME_PASSWORD')) {
            throw new HttpBadRequestException($this->request, 'Admin cant create notes');
        }

        $user = $this->noteRepository->save(new Note(null, $body['title'], $body['content'], $session->retrieve('username')));
        return $this->respondWithData($user);
    }
}
