<?php

declare(strict_types=1);

namespace App\Infrastructure\User;

use App\Domain\User\User;
use App\Domain\User\UsernameExistsException;
use App\Domain\User\UserNotFoundException;
use App\Domain\User\IUserRepository;

class UserRepository implements IUserRepository
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
    public function findAll(): array
    {
        $query = "SELECT * FROM users";
        $result = $this->dbConnection->Execute($query);
        $users = [];

        if ($result) {
            while (!$result->EOF) {
                $users[] = new User(
                    (int)$result->fields['id'],
                    $result->fields['username'],
                    $result->fields['passwd']
                );
                $result->MoveNext();
            }
        }

        return $users;
    }


    public function findUser(string $username, string $password): User
    {
        $password = md5($password);
        $query = "SELECT * FROM users WHERE username = {$this->dbConnection->qStr($username)} AND passwd = {$this->dbConnection->qStr($password)}";
        $result = $this->dbConnection->Execute($query);

        if ($result && !$result->EOF) {
            return new User(
                (int)$result->fields['id'],
                $result->fields['username'],
                $result->fields['passwd']
            );
        }

        throw new UserNotFoundException();
    }

    public function save(User $user): User
    {
        $query = "SELECT id FROM users WHERE username = {$this->dbConnection->qStr($user->getUsername())}";
        $result = $this->dbConnection->Execute($query);

        if ($result && !$result->EOF) {
            throw new UsernameExistsException("Username '{$user->getUsername()}' already exists.");
        }

        $insertQuery = "INSERT INTO users (username, passwd) VALUES (?, ?)";
        $this->dbConnection->Execute($insertQuery, [$user->getUsername(), $user->getPasswd()]);

        return new User($this->dbConnection->Insert_ID(), $user->getUsername(), $user->getPasswd());
    }
}
