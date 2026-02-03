FROM onlyoffice/documentserver-de:latest

# 한국어 폰트 전체 설치
RUN apt-get update && apt-get install -y \
    fonts-nanum \
    fonts-nanum-extra \
    fonts-nanum-coding \
    fonts-noto-cjk \
    fonts-noto-cjk-extra \
    fonts-unfonts-core \
    fonts-unfonts-extra \
    fonts-baekmuk \
    fonts-alee \
    fonts-liberation \
    fonts-liberation2 \
    fonts-dejavu-core \
    fonts-dejavu-extra \
    && rm -rf /var/lib/apt/lists/*

# 모든 폰트를 OnlyOffice 폰트 디렉토리에 복사
RUN find /usr/share/fonts -name "*.ttf" -exec cp {} /var/www/onlyoffice/documentserver/core-fonts/ \; 2>/dev/null || true && \
    find /usr/share/fonts -name "*.otf" -exec cp {} /var/www/onlyoffice/documentserver/core-fonts/ \; 2>/dev/null || true && \
    find /usr/share/fonts -name "*.ttc" -exec cp {} /var/www/onlyoffice/documentserver/core-fonts/ \; 2>/dev/null || true

# 폰트 목록 재생성 (새 폰트 인식)
RUN /usr/bin/documentserver-generate-allfonts.sh || true

# HWP 스타일 단축키 패치 복사
COPY patches/hwp-shortcuts-patch.js /tmp/hwp-shortcuts-patch.js

# HWP 단축키 패치 적용 (Shortcuts.js에 추가)
RUN SHORTCUTS_FILE=$(find /var/www/onlyoffice/documentserver -name "Shortcuts.js" -path "*/word/*" 2>/dev/null | head -1) && \
    if [ -n "$SHORTCUTS_FILE" ] && [ -f "$SHORTCUTS_FILE" ]; then \
        cat /tmp/hwp-shortcuts-patch.js >> "$SHORTCUTS_FILE" && \
        echo "HWP shortcuts patched to: $SHORTCUTS_FILE"; \
    else \
        echo "WARNING: Shortcuts.js not found, skipping HWP patch"; \
    fi

# Railway nginx 설정
RUN mv /etc/init.d/nginx /etc/init.d/nginx.orig && \
    printf '#!/bin/bash\nrm -f /etc/nginx/sites-enabled/default\nfor f in /etc/nginx/conf.d/*.conf; do\n  [ -f "$f" ] && sed -i "s/listen 80;/listen 0.0.0.0:80;/g" "$f"\n  [ -f "$f" ] && sed -i "s/listen \\[::]:80 default_server;/#listen [::]:80 default_server;/g" "$f"\ndone\nexec /etc/init.d/nginx.orig "$@"\n' > /etc/init.d/nginx && \
    chmod +x /etc/init.d/nginx

# SecureLink 재생성 (403 에러 해결 - 모든 수정 후 마지막에 실행)
RUN /usr/bin/documentserver-update-securelink.sh || true

EXPOSE 80