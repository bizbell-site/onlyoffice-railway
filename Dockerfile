FROM onlyoffice/documentserver:latest                                                                             
RUN find /etc/nginx -name "*.conf" -type f && cat /etc/nginx/nginx.conf                                           
EXPOSE 80
