<?php

declare(strict_types=1);

use App\Domain\User\IUserRepository;
use App\Domain\Note\INoteRepository;
use App\Infrastructure\Note\NoteRepository;
use App\Infrastructure\User\UserRepository;
use DI\ContainerBuilder;

return function (ContainerBuilder $containerBuilder) {
    $containerBuilder->addDefinitions([
        IUserRepository::class => \DI\autowire(UserRepository::class),
        INoteRepository::class => \DI\autowire(NoteRepository::class),
    ]);
};
