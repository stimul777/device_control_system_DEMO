#!/bin/sh

sed -i 's|~~~VUE_APP_ENV_API_URL~~~|'${VUE_APP_ENV_API_URL}'|g' /app/htdocs/js/app.*.js

exec "$@"
