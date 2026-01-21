FROM onlyoffice/documentserver:latest                                                                             
RUN sed -i 's/listen 80;/listen 0.0.0.0:80;/g' /etc/nginx/sites-enabled/ds.conf                                   
EXPOSE 80
