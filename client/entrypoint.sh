# #!/bin/sh
# envsubst '$SERVER_URL' < /etc/nginx/conf.d/default.conf > /etc/nginx/conf.d/default.conf.tmp
# mv /etc/nginx/conf.d/default.conf.tmp /etc/nginx/conf.d/default.conf
# exec nginx -g 'daemon off;'