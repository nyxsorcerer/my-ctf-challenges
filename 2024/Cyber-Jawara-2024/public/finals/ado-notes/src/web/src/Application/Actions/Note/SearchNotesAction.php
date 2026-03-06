<?php

declare(strict_types=1);

namespace App\Application\Actions\Note;

use Psr\Http\Message\ResponseInterface as Response;
use Slim\Exception\HttpBadRequestException;

class SearchNotesAction extends NoteAction
{
    private function validateRequestBody(): array
    {
        $body = $this->getParams();

        if (empty($body['search']) || !is_string($body['search'])) {
            throw new HttpBadRequestException($this->request,'The "search" field is required and must be a string.');
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
        $page = $body['page'] ?? 1;
        $note = $this->noteRepository->findNotes($session->retrieve('username'), $body['search'], (int)$page);
        return $this->respondWithData($note);
    }
}
