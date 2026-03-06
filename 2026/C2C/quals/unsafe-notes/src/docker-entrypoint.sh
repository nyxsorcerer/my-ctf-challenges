#!/bin/sh
export FLAG=${GZCTF_FLAG:-C2C{fakeflag}}
# Start all services with supervisor
supervisord -c /etc/supervisor/conf.d/supervisord.conf