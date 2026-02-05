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

# 추가 한글 폰트 수동 설치 (D2Coding, Pretendard, IBM Plex Sans KR, Gmarket Sans, 본명조)
RUN apt-get update && apt-get install -y curl unzip && \
    # D2Coding (네이버 개발자 폰트)
    curl -L -o /tmp/D2Coding.zip https://github.com/naver/d2codingfont/releases/download/VER1.3.2/D2Coding-Ver1.3.2-20180524.zip && \
    unzip -o /tmp/D2Coding.zip -d /tmp/d2coding && \
    find /tmp/d2coding -name "*.ttf" -exec cp {} /var/www/onlyoffice/documentserver/core-fonts/ \; && \
    # Pretendard
    curl -L -o /tmp/Pretendard.zip https://github.com/orioncactus/pretendard/releases/download/v1.3.9/Pretendard-1.3.9.zip && \
    unzip -o /tmp/Pretendard.zip -d /tmp/pretendard && \
    find /tmp/pretendard -name "*.otf" -exec cp {} /var/www/onlyoffice/documentserver/core-fonts/ \; && \
    # IBM Plex Sans KR
    curl -L -o /tmp/IBMPlexSansKR.zip https://github.com/IBM/plex/releases/download/v6.4.0/IBM-Plex-Sans-KR.zip && \
    unzip -o /tmp/IBMPlexSansKR.zip -d /tmp/ibmplex && \
    find /tmp/ibmplex -name "*.otf" -exec cp {} /var/www/onlyoffice/documentserver/core-fonts/ \; && \
    # Gmarket Sans (G마켓 산스 - 강조/제목용)
    curl -L -o /tmp/GmarketSans.zip https://corp.gmarket.com/fonts/GmarketSansOTF.zip && \
    unzip -o /tmp/GmarketSans.zip -d /tmp/gmarketsans && \
    find /tmp/gmarketsans -name "*.otf" -exec cp {} /var/www/onlyoffice/documentserver/core-fonts/ \; && \
    # Source Han Serif KR (본명조 - 공식 문서용 명조체)
    curl -L -o /tmp/SourceHanSerifKR.zip https://github.com/adobe-fonts/source-han-serif/releases/download/2.003R/08_SourceHanSerifK.zip && \
    unzip -o /tmp/SourceHanSerifKR.zip -d /tmp/sourcehanserif && \
    find /tmp/sourcehanserif -name "*.otf" -exec cp {} /var/www/onlyoffice/documentserver/core-fonts/ \; && \
    # 정리
    rm -rf /tmp/*.zip /tmp/d2coding /tmp/pretendard /tmp/ibmplex /tmp/gmarketsans /tmp/sourcehanserif /var/lib/apt/lists/*

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
