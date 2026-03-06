FROM php:8.3-apache

RUN apt-get update
RUN apt-get -y install unzip 

ENV APACHE_DOCUMENT_ROOT=/var/www/html/public
RUN sed -ri -e 's!/var/www/html!${APACHE_DOCUMENT_ROOT}!g' /etc/apache2/sites-available/*.conf
RUN sed -ri -e 's!/var/www/html!${APACHE_DOCUMENT_ROOT}!g' /etc/apache2/apache2.conf /etc/apache2/conf-available/*.conf

RUN a2enmod rewrite

COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

WORKDIR /var/www/html

COPY ./ /var/www/html/

HEALTHCHECK --interval=30m --timeout=3s \
  CMD rm -rf /tmp/* && curl -f http://localhost:4141/ || exit 1

RUN composer install --no-cache --verbose

RUN chown -R root:root /var/www/html/
RUN chown -R www-data:www-data /var/www/html/data


EXPOSE 80

# USER nobody

