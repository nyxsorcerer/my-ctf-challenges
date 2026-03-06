<?php

declare(strict_types=1);

namespace App\Application\Actions\Note;

use Psr\Http\Message\ResponseInterface as Response;
use Slim\Exception\HttpBadRequestException;

class ViewNoteAction extends NoteAction
{
    private function validateRequestBody(): array
    {
        $body = [];
        return $body;
    }

    protected function action(): Response
    {
        $body = $this->validateRequestBody();
        $session = $this->getStateManager();
        if (!$session->exists('username')) {
            throw new HttpBadRequestException($this->request, 'Required login');
        }
        $note = $this->noteRepository->readbyId((int)$this->args['id'], $session->retrieve('username'));
        return $this->respondWithData($note);
    }
}
