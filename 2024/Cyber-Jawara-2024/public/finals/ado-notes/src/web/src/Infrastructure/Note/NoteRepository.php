<?php

declare(strict_types=1);

namespace App\Infrastructure\Note;

use App\Domain\Note\INoteRepository;
use App\Domain\Note\Note;

class NoteRepository implements INoteRepository
{
    /**
     * @var \ADOConnection
     */
    private \ADOConnection $dbConnection;

    /**
     * @param \ADOConnection $dbConnection
     */
    public function __construct(\ADOConnection $dbConnection)
    {
        $this->dbConnection = $dbConnection;
    }

    /**
     * {@inheritdoc}
     */
    public function findNotes(string $username, string $search, int $page = 1): array
    {
        $query = "SELECT * FROM notes WHERE username = {$this->dbConnection->qStr($username)} AND title LIKE ?";
        $result = $this->dbConnection->PageExecute($query, 5, $page, [$search], 1);
        $users = [];

        if ($result) {
            while (!$result->EOF) {
                $users[] = new Note(
                    (int)$result->fields['id'],
                    $result->fields['title'],
                    $result->fields['content'],
                    $result->fields['username']
                );
                $result->MoveNext();
            }
        }

        return $users;
    }

    public function save(Note $note): Note
    {
        $query = "INSERT INTO notes (title, content, username) VALUES ({$this->dbConnection->qStr($note->getTitle())}, {$this->dbConnection->qStr($note->getContent())}, {$this->dbConnection->qStr($note->getUsername())})";
        $this->dbConnection->Execute($query);
        return new Note($this->dbConnection->Insert_ID(), $note->getTitle(), $note->getContent(), $note->getUsername());
    }

    public function readAttachment(int $id, string $username): Note
    {
        $query = "SELECT * FROM notes WHERE id = {$this->dbConnection->qStr($id)} AND username = {$this->dbConnection->qStr($username)}";
        $result = $this->dbConnection->Execute($query);
        if ($result && !$result->EOF) {
            return new Note(
                (int)$result->fields['id'],
                $result->fields['title'],
                $result->fields['content'],
                $result->fields['username'],
                base64_decode($result->fields['attachment'])
            );
        }

        return new Note(null, 'null', 'null', $username);
    }

    public function readbyId(int $id, string $username): Note
    {
        if($username === getenv('ADMIN_USERNAME_PASSWORD')){
            $query = "SELECT * FROM notes WHERE id = {$this->dbConnection->qStr($id)}";
        }else {
            $query = "SELECT * FROM notes WHERE id = {$this->dbConnection->qStr($id)} AND username = {$this->dbConnection->qStr($username)}";
        }
        $result = $this->dbConnection->Execute($query);
        if ($result && !$result->EOF) {
            if($result->fields['attachment'] === '' || $result->fields['attachment'] === null){
                return new Note(
                    (int)$result->fields['id'],
                    $result->fields['title'],
                    $result->fields['content'],
                    $result->fields['username']
                );
            }else{
                return new Note(
                    (int)$result->fields['id'],
                    $result->fields['title'],
                    $result->fields['content'],
                    $result->fields['username'],
                    base64_decode($result->fields['attachment'])
                );
            }

        }

        return new Note(null, 'null', 'null', $username);
    }

    public function update(Note $note): Note
    {
        if($note->getAttachment() !== '' && $note->getAttachment() !== null){
            $query = "UPDATE notes SET title = {$this->dbConnection->qStr($note->getTitle())}, content = {$this->dbConnection->qStr($note->getContent())}, attachment = {$this->dbConnection->qStr($note->getAttachment())} WHERE id = {$this->dbConnection->qStr($note->getId())} AND username = {$this->dbConnection->qStr($note->getUsername())}";
        }else{
            $query = "UPDATE notes SET title = {$this->dbConnection->qStr($note->getTitle())}, content = {$this->dbConnection->qStr($note->getContent())} WHERE id = {$this->dbConnection->qStr($note->getId())} AND username = {$this->dbConnection->qStr($note->getUsername())}";
        }

        $this->dbConnection->Execute($query);
        return new Note($note->getId(), $note->getTitle(), $note->getContent(), $note->getUsername());
    }

    public function delete(int $id, string $username): void
    {
        $query = "DELETE FROM notes WHERE id = {$this->dbConnection->qStr($id)} AND username = {$this->dbConnection->qStr($username)}";
        $this->dbConnection->Execute($query);
    }
}
