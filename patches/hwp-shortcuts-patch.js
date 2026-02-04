
// ============================================
// HWP (한글) 스타일 단축키 - BizBell Custom
// sdk-all-min.js 끝에 추가되어 실행됩니다
// ============================================

(function() {
    'use strict';

    function initHwpShortcuts() {
        // Asc 객체가 준비될 때까지 대기
        if (typeof Asc === 'undefined' ||
            typeof Asc.c_oAscDocumentShortcutType === 'undefined' ||
            typeof AscCommon === 'undefined' ||
            typeof AscCommon.CShortcuts === 'undefined') {
            setTimeout(initHwpShortcuts, 100);
            return;
        }

        var t = Asc.c_oAscDocumentShortcutType;

        // 키 해시 생성 함수 (OnlyOffice 내부 방식)
        function makeKeyHash(keyCode, ctrl, shift, alt, cmd) {
            var hash = keyCode;
            if (ctrl) hash |= 0x0100;
            if (shift) hash |= 0x0200;
            if (alt) hash |= 0x0400;
            if (cmd) hash |= 0x0800;
            return hash;
        }

        // 단축키 추가 함수
        function addShortcut(type, keyCode, ctrl, shift, alt, cmd) {
            if (type === undefined || type === null) return false;
            try {
                var hash = makeKeyHash(keyCode, ctrl, shift, alt, cmd);
                // CShortcuts 프로토타입에 접근하여 단축키 맵에 추가
                if (AscCommon.CShortcuts.prototype && AscCommon.CShortcuts.prototype.Get) {
                    // 기존 Get 메서드를 래핑
                    var originalGet = AscCommon.CShortcuts.prototype.Get;
                    if (!AscCommon.CShortcuts.prototype._bizbell_patched) {
                        AscCommon.CShortcuts.prototype._bizbell_shortcuts = {};
                        AscCommon.CShortcuts.prototype._bizbell_patched = true;
                        AscCommon.CShortcuts.prototype.Get = function(nHash) {
                            var custom = AscCommon.CShortcuts.prototype._bizbell_shortcuts[nHash];
                            if (custom !== undefined) return custom;
                            return originalGet.call(this, nHash);
                        };
                    }
                    AscCommon.CShortcuts.prototype._bizbell_shortcuts[hash] = type;
                    return true;
                }
                return false;
            } catch(e) {
                console.warn('[BizBell] Failed to add shortcut:', e);
                return false;
            }
        }

        // 키코드 정의
        var KEY = {
            A: 65, B: 66, C: 67, D: 68, E: 69, F: 70, G: 71, H: 72, I: 73, J: 74,
            K: 75, L: 76, M: 77, N: 78, O: 79, P: 80, Q: 81, R: 82, S: 83, T: 84,
            U: 85, V: 86, W: 87, X: 88, Y: 89, Z: 90,
            F1: 112, F2: 113, F3: 114, F4: 115, F5: 116, F6: 117,
            F7: 118, F8: 119, F9: 120, F10: 121, F11: 122, F12: 123,
            Enter: 13, Tab: 9, Space: 32, Escape: 27,
            BracketLeft: 219, BracketRight: 221,
            Semicolon: 186, Quote: 222, Comma: 188, Period: 190
        };

        var added = [];

        // ========== HWP 스타일 단축키 ==========

        // Alt+L: 글자 모양 (Font Dialog)
        if (t.OpenFontDialog !== undefined && addShortcut(t.OpenFontDialog, KEY.L, false, false, true, false)) {
            added.push('Alt+L (글자 모양)');
        }

        // Alt+T: 문단 모양 (Paragraph Dialog)
        if (t.OpenParagraphDialog !== undefined && addShortcut(t.OpenParagraphDialog, KEY.T, false, false, true, false)) {
            added.push('Alt+T (문단 모양)');
        }

        // Ctrl+]: 글자 크기 키우기
        if (t.IncreaseFontSize !== undefined && addShortcut(t.IncreaseFontSize, KEY.BracketRight, true, false, false, false)) {
            added.push('Ctrl+] (글자 크게)');
        }

        // Ctrl+[: 글자 크기 줄이기
        if (t.DecreaseFontSize !== undefined && addShortcut(t.DecreaseFontSize, KEY.BracketLeft, true, false, false, false)) {
            added.push('Ctrl+[ (글자 작게)');
        }

        // Ctrl+F10: 특수문자 (Insert Symbol)
        if (t.InsertSymbol !== undefined && addShortcut(t.InsertSymbol, KEY.F10, true, false, false, false)) {
            added.push('Ctrl+F10 (특수문자)');
        }

        // Ctrl+K: 하이퍼링크
        if (t.InsertHyperlink !== undefined && addShortcut(t.InsertHyperlink, KEY.K, true, false, false, false)) {
            added.push('Ctrl+K (하이퍼링크)');
        }

        // Ctrl+Enter: 페이지 나누기
        if (t.InsertPageBreak !== undefined && addShortcut(t.InsertPageBreak, KEY.Enter, true, false, false, false)) {
            added.push('Ctrl+Enter (페이지 나누기)');
        }

        // Ctrl+H: 찾아 바꾸기
        if (t.Replace !== undefined && addShortcut(t.Replace, KEY.H, true, false, false, false)) {
            added.push('Ctrl+H (찾아 바꾸기)');
        }

        // F3: 다음 찾기
        if (t.FindNext !== undefined && addShortcut(t.FindNext, KEY.F3, false, false, false, false)) {
            added.push('F3 (다음 찾기)');
        }

        // Ctrl+Shift+L: 왼쪽 정렬
        if (t.JustifyLeft !== undefined && addShortcut(t.JustifyLeft, KEY.L, true, true, false, false)) {
            added.push('Ctrl+Shift+L (왼쪽 정렬)');
        }

        // Ctrl+Shift+R: 오른쪽 정렬
        if (t.JustifyRight !== undefined && addShortcut(t.JustifyRight, KEY.R, true, true, false, false)) {
            added.push('Ctrl+Shift+R (오른쪽 정렬)');
        }

        // Ctrl+Shift+C: 가운데 정렬
        if (t.JustifyCenter !== undefined && addShortcut(t.JustifyCenter, KEY.C, true, true, false, false)) {
            added.push('Ctrl+Shift+C (가운데 정렬)');
        }

        // Ctrl+Shift+J: 양쪽 정렬
        if (t.JustifyFull !== undefined && addShortcut(t.JustifyFull, KEY.J, true, true, false, false)) {
            added.push('Ctrl+Shift+J (양쪽 정렬)');
        }

        // Ctrl+D: 글꼴 대화상자 (MS Word 호환)
        if (t.OpenFontDialog !== undefined && addShortcut(t.OpenFontDialog, KEY.D, true, false, false, false)) {
            added.push('Ctrl+D (글꼴)');
        }

        console.log('[BizBell] HWP shortcuts initialized:', added.length > 0 ? added.join(', ') : 'none');

        // 디버깅: 사용 가능한 shortcut 타입들 출력
        console.log('[BizBell] Available shortcut types:', Object.keys(t).filter(k => t[k] !== undefined).join(', '));
    }

    // 즉시 실행 시도 + DOM 로드 후에도 시도
    initHwpShortcuts();

    if (typeof document !== 'undefined') {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', initHwpShortcuts);
        }
        window.addEventListener('load', function() {
            setTimeout(initHwpShortcuts, 1000);
        });
    }
})();
// ============================================
