/**
 * HWP 단축키 패치 스크립트
 *
 * OnlyOffice SDKJS의 Shortcuts.js에 한글(HWP) 스타일 단축키를 추가합니다.
 *
 * 지원 단축키:
 * - Alt+L: 글자 모양 (Font Dialog) → c_oAscDocumentShortcutType.FontPanelOpen
 * - Alt+T: 문단 모양 (Paragraph Dialog) → c_oAscDocumentShortcutType.ParagraphPanelOpen
 * - Ctrl+N, T: 표 삽입 → InsertTable
 * - Ctrl+F10: 특수문자 → InsertSymbol
 *
 * 사용법:
 * node add-hwp-shortcuts.js /path/to/Shortcuts.js
 */

const fs = require('fs');
const path = require('path');

// 인자로 파일 경로 받기
const shortcutsFile = process.argv[2];

if (!shortcutsFile) {
  console.error('Usage: node add-hwp-shortcuts.js <path-to-Shortcuts.js>');
  process.exit(1);
}

if (!fs.existsSync(shortcutsFile)) {
  console.error(`File not found: ${shortcutsFile}`);
  process.exit(1);
}

console.log(`Patching ${shortcutsFile}...`);

let content = fs.readFileSync(shortcutsFile, 'utf8');

// HWP 단축키 정의 코드
const hwpShortcutsCode = `
// ============================================
// HWP (한글) 스타일 단축키 추가 - BizBell Custom
// ============================================
// Alt+L: 글자 모양 (Font Dialog)
if (typeof c_oAscDocumentShortcutType !== 'undefined' && typeof c_oAscDefaultShortcuts !== 'undefined') {
  // Alt+L (keyCode 76 = 'L')
  c_oAscDefaultShortcuts[c_oAscDocumentShortcutType.FontPanelOpen] =
    c_oAscDefaultShortcuts[c_oAscDocumentShortcutType.FontPanelOpen] || [];
  if (Array.isArray(c_oAscDefaultShortcuts[c_oAscDocumentShortcutType.FontPanelOpen])) {
    c_oAscDefaultShortcuts[c_oAscDocumentShortcutType.FontPanelOpen].push(
      new AscCommon.AscShortcut(c_oAscDocumentShortcutType.FontPanelOpen, 76, false, false, true, false)
    );
  } else {
    c_oAscDefaultShortcuts[c_oAscDocumentShortcutType.FontPanelOpen] = [
      c_oAscDefaultShortcuts[c_oAscDocumentShortcutType.FontPanelOpen],
      new AscCommon.AscShortcut(c_oAscDocumentShortcutType.FontPanelOpen, 76, false, false, true, false)
    ];
  }

  // Alt+T: 문단 모양 (Paragraph Dialog) (keyCode 84 = 'T')
  c_oAscDefaultShortcuts[c_oAscDocumentShortcutType.ParagraphPanelOpen] =
    c_oAscDefaultShortcuts[c_oAscDocumentShortcutType.ParagraphPanelOpen] || [];
  if (Array.isArray(c_oAscDefaultShortcuts[c_oAscDocumentShortcutType.ParagraphPanelOpen])) {
    c_oAscDefaultShortcuts[c_oAscDocumentShortcutType.ParagraphPanelOpen].push(
      new AscCommon.AscShortcut(c_oAscDocumentShortcutType.ParagraphPanelOpen, 84, false, false, true, false)
    );
  } else {
    c_oAscDefaultShortcuts[c_oAscDocumentShortcutType.ParagraphPanelOpen] = [
      c_oAscDefaultShortcuts[c_oAscDocumentShortcutType.ParagraphPanelOpen],
      new AscCommon.AscShortcut(c_oAscDocumentShortcutType.ParagraphPanelOpen, 84, false, false, true, false)
    ];
  }

  // Ctrl+F10: 특수문자 (keyCode 121 = F10)
  if (c_oAscDocumentShortcutType.InsertSymbol !== undefined) {
    c_oAscDefaultShortcuts[c_oAscDocumentShortcutType.InsertSymbol] =
      c_oAscDefaultShortcuts[c_oAscDocumentShortcutType.InsertSymbol] || [];
    if (Array.isArray(c_oAscDefaultShortcuts[c_oAscDocumentShortcutType.InsertSymbol])) {
      c_oAscDefaultShortcuts[c_oAscDocumentShortcutType.InsertSymbol].push(
        new AscCommon.AscShortcut(c_oAscDocumentShortcutType.InsertSymbol, 121, true, false, false, false)
      );
    } else {
      c_oAscDefaultShortcuts[c_oAscDocumentShortcutType.InsertSymbol] = [
        c_oAscDefaultShortcuts[c_oAscDocumentShortcutType.InsertSymbol],
        new AscCommon.AscShortcut(c_oAscDocumentShortcutType.InsertSymbol, 121, true, false, false, false)
      ];
    }
  }

  console.log('[BizBell] HWP shortcuts loaded: Alt+L (Font), Alt+T (Paragraph), Ctrl+F10 (Symbol)');
}
// ============================================
// END HWP 단축키
// ============================================
`;

// 파일 끝에 HWP 단축키 코드 추가
// 이미 패치되어 있는지 확인
if (content.includes('HWP (한글) 스타일 단축키')) {
  console.log('Already patched. Skipping...');
  process.exit(0);
}

// 파일 끝에 추가
content += hwpShortcutsCode;

// 백업 생성
fs.writeFileSync(shortcutsFile + '.bak', fs.readFileSync(shortcutsFile));

// 패치된 파일 저장
fs.writeFileSync(shortcutsFile, content);

console.log('Patch applied successfully!');
console.log('Backup saved to:', shortcutsFile + '.bak');
