<?php

declare(strict_types=1);

namespace App\Domain\User;

use JsonSerializable;

class User implements JsonSerializable
{
    private ?int $id;

    private string $username;

    private string $passwd;

    public function __construct(?int $id, string $username, string $passwd)
    {
        $this->id = $id;
        $this->username = $username;
        $this->passwd = md5($passwd);
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getPasswd(): string
    {
        return $this->passwd;
    }

    public function getUsername(): string
    {
        return $this->username;
    }

    #[\ReturnTypeWillChange]
    public function jsonSerialize(): array
    {
        return [
            'id' => $this->id,
            'username' => $this->username
        ];
    }
}
