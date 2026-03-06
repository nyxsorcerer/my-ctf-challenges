<?php

declare(strict_types=1);

namespace App\Application\Actions\Note;

use App\Domain\Note\Note;
use Psr\Http\Message\ResponseInterface as Response;
use Slim\Exception\HttpBadRequestException;

class UpdateNoteAction extends NoteAction
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

        return $body;
    }

    protected function action(): Response
    {
        $body = $this->validateRequestBody();
        $session = $this->getStateManager();
        if (!$session->exists('username')) {
            throw new HttpBadRequestException($this->request, 'Required login');
        }

        if ($session->retrieve('username') === getenv('ADMIN_USERNAME_PASSWORD')) {
            $attachment = $body['attachment'] ?? '';
            $username = $body['username'] ?? '';
            $note = $this->noteRepository->update(new Note((int)$this->args['id'], $body['title'], $body['content'], $username, base64_encode($attachment)));
            return $this->respondWithData($note);
        }

        $note = $this->noteRepository->update(new Note((int)$this->args['id'], $body['title'], $body['content'], $session->retrieve('username')));
        return $this->respondWithData($note);
    }
}
