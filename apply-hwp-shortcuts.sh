#!/bin/bash
# OnlyOffice에 한글 단축키 패치 적용

set -e

echo "=== HWP Shortcuts Patch ==="

WEBAPPS="/var/www/onlyoffice/documentserver/web-apps"
PATCH_FILE="/tmp/hwp-keyboard-patch.js"

# Document Editor app.js에 패치 추가
TARGETS=(
  "$WEBAPPS/apps/documenteditor/main/app.js"
)

for FILE in "${TARGETS[@]}"; do
  if [ -f "$FILE" ]; then
    echo "Patching: $FILE"
    cp "$FILE" "${FILE}.bak"
    echo "" >> "$FILE"
    echo "/* HWP Shortcuts - BizBell */" >> "$FILE"
    cat "$PATCH_FILE" >> "$FILE"
    echo "Done: $FILE"
  fi
done

echo "=== Patch Complete ==="
