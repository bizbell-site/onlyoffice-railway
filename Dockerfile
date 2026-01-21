FROM onlyoffice/documentserver:latest                                                                             
                                                                                                                    
# nginx 설정에서 모든 listen 80 변형을 0.0.0.0:80으로 변경                                                        
RUN find /etc -name "*.conf" -type f 2>/dev/null | xargs grep -l "listen.*80" 2>/dev/null | xargs -I {} sed -i 's/listen\s*80/listen 0.0.0.0:80/g' {} 2>/dev/null || true                                                        
RUN find /etc -name "*.conf" -type f 2>/dev/null | xargs grep -l "listen.*\[::\]:80" 2>/dev/null | xargs -I {} sed -i 's/listen\s*\[::\]:80/listen [::]:80/g' {} 2>/dev/null || true                                                
                                                                                                                  
EXPOSE 80
