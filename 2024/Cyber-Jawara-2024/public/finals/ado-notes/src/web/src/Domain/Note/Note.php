<?php

declare(strict_types=1);

namespace App\Domain\Note;

use JsonSerializable;

class Note implements JsonSerializable
{
    private ?int $id;

    private string $title;
    private string $content;

    private string $username;

    private string $attachment;

    public function __construct(?int $id, string $title, string $content, string $username, string $attachment = '')
    {
        $this->id = $id;
        $this->title = $title;
        $this->content = $content;
        $this->username = $username;
        $this->attachment = $attachment;
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getTitle(): string
    {
        return $this->title;
    }

    public function getContent(): string
    {
        return $this->content;
    }

    public function getUsername(): string
    {
        return $this->username;
    }

    public function getAttachment(): string
    {
        return $this->attachment;
    }

    #[\ReturnTypeWillChange]
    public function jsonSerialize(): array
    {
        return [
            'id' => $this->id,
            'username' => $this->username,
            'title' => $this->title,
            'content' => $this->content,
        ];
    }
}
