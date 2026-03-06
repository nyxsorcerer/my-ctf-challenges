<?php

declare(strict_types=1);

namespace App\Domain\Note;

interface INoteRepository
{

    public function findNotes(string $username, string $search, int $page = 1): array;



    public function save(Note $note): Note;
    public function update(Note $note): Note;
    public function delete(int $id, string $username): void;
    public function readAttachment(int $id, string $username): Note;

    public function readbyId(int $id, string $username): Note;

}
