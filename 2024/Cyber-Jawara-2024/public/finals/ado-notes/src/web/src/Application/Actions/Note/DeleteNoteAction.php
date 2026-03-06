<?php

declare(strict_types=1);

namespace App\Application\Actions\Note;

use App\Domain\Note\Note;
use Psr\Http\Message\ResponseInterface as Response;
use Slim\Exception\HttpBadRequestException;

class DeleteNoteAction extends NoteAction
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
            throw new HttpBadRequestException($this->request, 'Username is required to create a note.');
        }
        $this->noteRepository->delete((int)$this->args['id'], $session->retrieve('username'));
        return $this->respondWithData('Note deleted (i think)');
    }
}
