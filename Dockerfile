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

# 디버깅: sdkjs 폴더 구조 확인
RUN echo "=== SDKJS folder structure ===" && \
    ls -la /var/www/onlyoffice/documentserver/sdkjs/ && \
    echo "=== Word folder ===" && \
    ls -la /var/www/onlyoffice/documentserver/sdkjs/word/ 2>/dev/null || echo "word folder not found" && \
    echo "=== Looking for any JS files in word folder ===" && \
    find /var/www/onlyoffice/documentserver/sdkjs/word -name "*.js" 2>/dev/null | head -10 && \
    echo "=== Looking for sdk*.js anywhere ===" && \
    find /var/www/onlyoffice/documentserver -name "sdk*.js" 2>/dev/null | head -10 && \
    echo "=== Web-apps folder ===" && \
    ls -la /var/www/onlyoffice/documentserver/web-apps/ 2>/dev/null | head -10 && \
    echo "=== Looking for app.js in web-apps ===" && \
    find /var/www/onlyoffice/documentserver/web-apps -name "app.js" 2>/dev/null | head -5

# HWP 단축키 패치 적용 (Word 에디터 JS 파일에)
RUN echo "=== Applying HWP patch ===" && \
    WORD_SDK=$(find /var/www/onlyoffice/documentserver/sdkjs/word -name "*.js" 2>/dev/null | head -1) && \
    if [ -n "$WORD_SDK" ] && [ -f "$WORD_SDK" ]; then \
        cat /tmp/hwp-shortcuts-patch.js >> "$WORD_SDK" && \
        echo "HWP shortcuts patched to WORD SDK: $WORD_SDK"; \
    else \
        echo "Word SDK not found, trying web-apps..."; \
        WEBAPP_JS=$(find /var/www/onlyoffice/documentserver/web-apps -name "app.js" -path "*documenteditor*" 2>/dev/null | head -1); \
        if [ -n "$WEBAPP_JS" ] && [ -f "$WEBAPP_JS" ]; then \
            cat /tmp/hwp-shortcuts-patch.js >> "$WEBAPP_JS" && \
            echo "HWP shortcuts patched to web-app: $WEBAPP_JS"; \
        else \
            echo "Trying any documenteditor JS..."; \
            DOC_JS=$(find /var/www/onlyoffice/documentserver -path "*documenteditor*" -name "*.js" 2>/dev/null | head -1); \
            if [ -n "$DOC_JS" ] && [ -f "$DOC_JS" ]; then \
                cat /tmp/hwp-shortcuts-patch.js >> "$DOC_JS" && \
                echo "HWP shortcuts patched to: $DOC_JS"; \
            else \
                echo "WARNING: No suitable Word editor JS file found"; \
            fi; \
        fi; \
    fi

# Railway nginx 설정
RUN mv /etc/init.d/nginx /etc/init.d/nginx.orig && \
    printf '#!/bin/bash\nrm -f /etc/nginx/sites-enabled/default\nfor f in /etc/nginx/conf.d/*.conf; do\n  [ -f "$f" ] && sed -i "s/listen 80;/listen 0.0.0.0:80;/g" "$f"\n  [ -f "$f" ] && sed -i "s/listen \\[::]:80 default_server;/#listen [::]:80 default_server;/g" "$f"\ndone\nexec /etc/init.d/nginx.orig "$@"\n' > /etc/init.d/nginx && \
    chmod +x /etc/init.d/nginx

# SecureLink 재생성 (403 에러 해결 - 모든 수정 후 마지막에 실행)
RUN /usr/bin/documentserver-update-securelink.sh || true

EXPOSE 80
