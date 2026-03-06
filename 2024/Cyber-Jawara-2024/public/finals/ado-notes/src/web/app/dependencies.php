<?php

declare(strict_types=1);

use App\Application\Settings\SettingsInterface;
use DI\ContainerBuilder;
use Psr\Container\ContainerInterface;
use App\Application\Frameworks\StateManager;
use Monolog\Handler\StreamHandler;
use Monolog\Logger;
use Monolog\Processor\UidProcessor;
use Psr\Log\LoggerInterface;

return function (ContainerBuilder $containerBuilder) {
    $containerBuilder->addDefinitions([
        LoggerInterface::class => function (ContainerInterface $c) {
            $settings = $c->get(SettingsInterface::class);

            $loggerSettings = $settings->get('logger');
            $logger = new Logger($loggerSettings['name']);

            $processor = new UidProcessor();
            $logger->pushProcessor($processor);

            $handler = new StreamHandler($loggerSettings['path'], $loggerSettings['level']);
            $logger->pushHandler($handler);

            return $logger;
        },

        \ADOConnection::class => function (ContainerInterface $c) {
            $settings = $c->get(SettingsInterface::class);
            $dbSettings = $settings->get('database');

            $connection = \NewADOConnection($dbSettings['driver']);

            if (!file_exists(($dbSettings['path']))) {
                mkdir(($dbSettings['path']), 0755, true);
            }

            $connection->Connect($dbSettings['path'] . $dbSettings['database']);

            $connection->Execute("CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT UNIQUE, passwd TEXT)");
            $connection->Execute("CREATE TABLE IF NOT EXISTS notes (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT, content TEXT, username TEXT, attachment TEXT)");

            $adminCreds = getenv('ADMIN_USERNAME_PASSWORD');
            $existsQuery = "SELECT COUNT(*) AS count FROM users WHERE username = ?";
            $usernameExists = $connection->GetOne($existsQuery, [$adminCreds]);

            if (!$usernameExists) {
                $insertQuery = "INSERT INTO users (username, passwd) VALUES (?, ?)";
                $connection->Execute($insertQuery, [$adminCreds, md5(getenv('ADMIN_USERNAME_PASSWORD'))]);
            }

            return $connection;
        },

         StateManager::class => function () {
            return new StateManager();
        },
    ]);
};
