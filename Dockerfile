FROM onlyoffice/documentserver:latest

# NGINX 설정 수정 (Railway 호환성)
RUN mv /etc/init.d/nginx /etc/init.d/nginx.orig && \
    printf '#!/bin/bash\nrm -f /etc/nginx/sites-enabled/default\nfor f in /etc/nginx/conf.d/*.conf; do\n  [ -f "$f" ] && sed -i "s/listen 80;/listen 0.0.0.0:80;/g" "$f"\n  [ -f "$f" ] && sed -i "s/listen \\[::]:80 default_server;/#listen [::]:80 default_server;/g" "$f"\ndone\nexec /etc/init.d/nginx.orig "$@"\n' > /etc/init.d/nginx && \
    chmod +x /etc/init.d/nginx

# 한글 폰트 설치 (나눔폰트, Noto Sans KR)
RUN apt-get update && apt-get install -y --no-install-recommends \
    fonts-nanum \
    fonts-nanum-coding \
    fonts-nanum-extra \
    fonts-noto-cjk \
    && rm -rf /var/lib/apt/lists/* \
    && apt-get clean

# ONLYOFFICE 폰트 캐시 재생성
RUN /usr/bin/documentserver-generate-allfonts.sh

EXPOSE 80