FROM onlyoffice/documentserver:latest                                                                             
RUN find /etc -name "*.conf" -exec grep -l "listen 80;" {} \; | xargs -I {} sed -i 's/listen 80;/listen 0.0.0.0:80;/g' {}                                                                                                 
EXPOSE 80 
