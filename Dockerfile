FROM onlyoffice/documentserver:latest

# NGINX 설정 수정 (Railway 호환성)
RUN mv /etc/init.d/nginx /etc/init.d/nginx.orig && \
    printf '#!/bin/bash\nrm -f /etc/nginx/sites-enabled/default\nfor f in /etc/nginx/conf.d/*.conf; do\n  [ -f "$f" ] && sed -i "s/listen 80;/listen 0.0.0.0:80;/g" "$f"\n  [ -f "$f" ] && sed -i "s/listen \\[::]:80 default_server;/#listen [::]:80 default_server;/g" "$f"\ndone\nexec /etc/init.d/nginx.orig "$@"\n' > /etc/init.d/nginx && \
    chmod +x /etc/init.d/nginx

# ============================================
# 한글 폰트 설치 (한글/HWP 호환 폰트 전체)
# ============================================
RUN apt-get update && apt-get install -y --no-install-recommends \
    # 나눔 폰트 시리즈 (네이버)
    fonts-nanum \
    fonts-nanum-coding \
    fonts-nanum-extra \
    # Noto CJK 폰트 (Google) - 한중일 통합
    fonts-noto-cjk \
    fonts-noto-cjk-extra \
    # 은글꼴 시리즈 - 한글 호환용 (은바탕, 은돋움, 은그래픽, 은궁서 등)
    fonts-unfonts-core \
    fonts-unfonts-extra \
    # 백묵 폰트 - 바탕, 돋움, 굴림, 궁서 대체
    fonts-baekmuk \
    # 기타 한글 폰트
    fonts-alee \
    # D2Coding (네이버 개발자 폰트) - if available
    fonts-naver-d2coding || true \
    && rm -rf /var/lib/apt/lists/* \
    && apt-get clean

# ============================================
# 추가 폰트 다운로드 (apt에 없는 폰트)
# ============================================
# D2Coding 폰트 (네이버) - 코드용 한글 폰트
RUN mkdir -p /usr/share/fonts/truetype/d2coding && \
    curl -L -o /tmp/d2coding.zip "https://github.com/naver/d2codingfont/releases/download/VER1.3.2/D2Coding-Ver1.3.2-20180524.zip" && \
    unzip -j /tmp/d2coding.zip "D2Coding/*.ttf" -d /usr/share/fonts/truetype/d2coding/ || true && \
    rm -f /tmp/d2coding.zip

# 스포카 한 산스 (Spoqa Han Sans) - 현대적인 고딕체
RUN mkdir -p /usr/share/fonts/truetype/spoqa && \
    curl -L -o /tmp/spoqa.zip "https://github.com/spoqa/spoqa-han-sans/releases/download/3.2.1/SpoqaHanSansNeo.zip" && \
    unzip -j /tmp/spoqa.zip "*.ttf" -d /usr/share/fonts/truetype/spoqa/ || true && \
    rm -f /tmp/spoqa.zip

# 프리텐다드 (Pretendard) - 애플 SF Pro 한글 대체
RUN mkdir -p /usr/share/fonts/truetype/pretendard && \
    curl -L -o /tmp/pretendard.zip "https://github.com/orioncactus/pretendard/releases/download/v1.3.9/Pretendard-1.3.9.zip" && \
    unzip -j /tmp/pretendard.zip "public/static/Pretendard-*.ttf" -d /usr/share/fonts/truetype/pretendard/ 2>/dev/null || \
    unzip -j /tmp/pretendard.zip "*.ttf" -d /usr/share/fonts/truetype/pretendard/ 2>/dev/null || true && \
    rm -f /tmp/pretendard.zip

# IBM Plex Sans KR - IBM 공식 한글 폰트
RUN mkdir -p /usr/share/fonts/truetype/ibm-plex && \
    curl -L -o /tmp/ibm-plex-kr.zip "https://github.com/IBM/plex/releases/download/v6.4.2/OpenType.zip" && \
    unzip -j /tmp/ibm-plex-kr.zip "OpenType/IBM-Plex-Sans-KR/*.otf" -d /usr/share/fonts/truetype/ibm-plex/ 2>/dev/null || true && \
    rm -f /tmp/ibm-plex-kr.zip

# ============================================
# 폰트 캐시 재생성
# ============================================
RUN fc-cache -fv

# ONLYOFFICE 폰트 등록
RUN /usr/bin/documentserver-generate-allfonts.sh

# ============================================
# HWP 단축키 플러그인 설치
# ============================================
# 플러그인 디렉토리에 복사 (코어 파일 수정 없음 - 안전)
COPY plugins/hwp-shortcuts /var/www/onlyoffice/documentserver/sdkjs-plugins/hwp-shortcuts/

EXPOSE 80