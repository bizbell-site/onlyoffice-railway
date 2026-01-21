FROM onlyoffice/documentserver:latest                                                                             
COPY <<EOF /fix-nginx.sh                                                                                          
#!/bin/bash                                                                                                       
sed -i 's/listen 80;/listen 0.0.0.0:80;/g' /etc/nginx/conf.d/*.conf 2>/dev/null || true                           
sed -i 's/listen 80 /listen 0.0.0.0:80 /g' /etc/nginx/conf.d/*.conf 2>/dev/null || true                           
EOF                                                                                                               
RUN chmod +x /fix-nginx.sh                                                                                        
EXPOSE 80                                                                                                         
CMD ["/bin/bash", "-c", "/fix-nginx.sh && /app/ds/run-document-server.sh"]
