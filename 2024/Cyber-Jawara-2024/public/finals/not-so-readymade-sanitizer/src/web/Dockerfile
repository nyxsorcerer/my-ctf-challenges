FROM php:8.3-apache

RUN apt update
RUN apt-get -y install unzip 

COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

WORKDIR /var/www/

COPY ./ /var/www/

HEALTHCHECK --interval=60m --timeout=3s \
  CMD curl -f http://localhost:4242/ || exit 1

RUN composer install --no-cache --verbose

RUN chown -R www-data:www-data /var/www/html/

EXPOSE 80

# USER nobody

# CMD [ "php", "-S", "0.0.0.0:4242"]