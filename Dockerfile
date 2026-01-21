FROM onlyoffice/documentserver:latest                                                                             
                                                                                                                  
RUN mv /app/ds/run-document-server.sh /app/ds/run-document-server-original.sh && echo '#!/bin/bash' >             
/app/ds/run-document-server.sh && echo 'sleep 2' >> /app/ds/run-document-server.sh && echo 'find /etc/nginx -name 
"*.conf" -exec sed -i "s/listen 80;/listen 0.0.0.0:80;/g" {} \; 2>/dev/null || true' >>                           
/app/ds/run-document-server.sh && echo 'exec /app/ds/run-document-server-original.sh "$@"' >>                     
/app/ds/run-document-server.sh && chmod +x /app/ds/run-document-server.sh                                         
                                                                                                                  
EXPOSE 80
