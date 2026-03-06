<?php

declare(strict_types=1);

namespace App\Application\Actions\Note;

use App\Application\Actions\Action;
use App\Domain\Note\INoteRepository;

abstract class NoteAction extends Action
{
    protected INoteRepository $noteRepository;

    public function __construct(INoteRepository $noteRepository)
    {
        $this->noteRepository = $noteRepository;
    }
}
