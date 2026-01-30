
// ============================================
// HWP (한글) 스타일 단축키 - BizBell Custom
// 이 코드는 Shortcuts.js 파일 끝에 추가됩니다
// ============================================

(function() {
    // Shortcuts.js가 로드된 후 실행
    var t = Asc.c_oAscDocumentShortcutType;
    var d = Asc.c_oAscDefaultShortcuts;
    var keyCodes = AscCommon.keyCodes || {
        KeyL: 76,
        KeyT: 84,
        F10: 121,
        F7: 118
    };

    function addHwpShortcut(type, keyCode, ctrl, shift, alt, cmd) {
        if (type === undefined || type === null) return;
        var shortcut = new AscCommon.AscShortcut(type, keyCode, ctrl, shift, alt, cmd);
        if (!d[type]) {
            d[type] = shortcut;
        } else if (Array.isArray(d[type])) {
            d[type].push(shortcut);
        } else {
            d[type] = [d[type], shortcut];
        }
    }

    // Alt+L: 글자 모양 (Font Dialog)
    if (t.OpenFontDialog !== undefined) {
        addHwpShortcut(t.OpenFontDialog, keyCodes.KeyL || 76, false, false, true, false);
    }

    // Alt+T: 문단 모양 (Paragraph Dialog)
    if (t.OpenParagraphDialog !== undefined) {
        addHwpShortcut(t.OpenParagraphDialog, keyCodes.KeyT || 84, false, false, true, false);
    }

    // Ctrl+F10: 특수문자 (Insert Symbol)
    if (t.InsertSymbol !== undefined) {
        addHwpShortcut(t.InsertSymbol, keyCodes.F10 || 121, true, false, false, false);
    }

    // F7: 편집 용지 설정 (Page Setup) - if available
    if (t.OpenPageSetup !== undefined) {
        addHwpShortcut(t.OpenPageSetup, keyCodes.F7 || 118, false, false, false, false);
    }

    console.log('[BizBell] HWP shortcuts added: Alt+L, Alt+T, Ctrl+F10');
})();
// ============================================
