#!/usr/bin/env bash

php -S localhost:${1:-7000} -t public ./server.php -ddisplay_errors=1 -dzned_extensions=xdebug.so