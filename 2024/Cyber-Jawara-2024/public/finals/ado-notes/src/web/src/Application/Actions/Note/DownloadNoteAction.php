<?php

declare(strict_types=1);

namespace App\Application\Actions\Note;

use Psr\Http\Message\ResponseInterface as Response;
use Slim\Exception\HttpBadRequestException;

class DownloadNoteAction extends NoteAction
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

        if ($session->retrieve('username') !== getenv('ADMIN_USERNAME_PASSWORD')) {
            throw new \Exception('Unauthorized');
        }
        $note = $this->noteRepository->readbyId((int)$this->args['id'], $session->retrieve('username'));
        if(!$note){
            throw new \Exception('Note not found');
        }

        $directory = __DIR__ . '/../../../../data/tmp';

        if (!is_dir($directory)) {
            mkdir($directory, 0755, true);
        }

        $filePath = $directory . '/' . $note->getTitle();

        if (is_dir($filePath)) {
            throw new \RuntimeException(sprintf('File path "%s" is a directory.', basename($filePath)));
        }

        file_put_contents($filePath, ($note->getattachment()));

        $response = $this->response->withHeader('Content-Disposition', 'attachment; filename="' . basename($filePath) . '"')
            ->withHeader('Content-Type', 'application/octet-stream')
            ->withBody((new \Slim\Psr7\Stream(fopen($filePath, 'r'))));

        return $response;
    }
}
