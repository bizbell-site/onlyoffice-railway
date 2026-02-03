FROM onlyoffice/documentserver-de:latest

# 한국어 폰트 설치
RUN apt-get update && apt-get install -y \
    fonts-nanum \
    fonts-noto-cjk \
    fonts-noto-cjk-extra \
    && rm -rf /var/lib/apt/lists/*

# 폰트를 OnlyOffice 폰트 디렉토리에 복사
RUN cp /usr/share/fonts/truetype/nanum/*.ttf /var/www/onlyoffice/documentserver/core-fonts/ 2>/dev/null || true && \
    cp /usr/share/fonts/opentype/noto/*.otf /var/www/onlyoffice/documentserver/core-fonts/ 2>/dev/null || true && \
    cp /usr/share/fonts/opentype/noto/*.ttc /var/www/onlyoffice/documentserver/core-fonts/ 2>/dev/null || true

# 폰트 목록 재생성 (새 폰트 인식)
RUN /usr/bin/documentserver-generate-allfonts.sh || true

# Railway nginx 설정
RUN mv /etc/init.d/nginx /etc/init.d/nginx.orig && \
    printf '#!/bin/bash\nrm -f /etc/nginx/sites-enabled/default\nfor f in /etc/nginx/conf.d/*.conf; do\n  [ -f "$f" ] && sed -i "s/listen 80;/listen 0.0.0.0:80;/g" "$f"\n  [ -f "$f" ] && sed -i "s/listen \\[::]:80 default_server;/#listen [::]:80 default_server;/g" "$f"\ndone\nexec /etc/init.d/nginx.orig "$@"\n' > /etc/init.d/nginx && \
    chmod +x /etc/init.d/nginx

# SecureLink 재생성 (403 에러 해결)
RUN /usr/bin/documentserver-update-securelink.sh || true

EXPOSE 80