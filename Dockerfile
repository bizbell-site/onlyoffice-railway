FROM onlyoffice/documentserver:latest                                                                             
                                                                                                                  
RUN mv /etc/init.d/nginx /etc/init.d/nginx.orig && \                                                              
    printf '#!/bin/bash\nfor f in /etc/nginx/conf.d/*.conf /etc/nginx/sites-enabled/*; do\n  [ -f "$f" ] && sed -i "s/listen 80;/listen 0.0.0.0:80;/g" "$f"\n  [ -f "$f" ] && sed -i "s/listen \\[::]:80/listen 0.0.0.0:80/g" "$f"\ndone\nexec /etc/init.d/nginx.orig "$@"\n' > /etc/init.d/nginx && \                                          
    chmod +x /etc/init.d/nginx                                                                                    
                                                                                                                  
EXPOSE 80
