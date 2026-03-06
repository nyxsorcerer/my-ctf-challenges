<?php

declare(strict_types=1);

namespace App\Domain\User;

interface IUserRepository
{

    public function findUser(string $username, string $password): User;



    public function save(User $user): User;

}
