
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
            typeof Asc.c_oAscDefaultShortcuts === 'undefined' ||
            typeof AscCommon === 'undefined') {
            setTimeout(initHwpShortcuts, 100);
            return;
        }

        var t = Asc.c_oAscDocumentShortcutType;
        var d = Asc.c_oAscDefaultShortcuts;

        // 키코드 정의
        var KEY = {
            A: 65, B: 66, C: 67, D: 68, E: 69, F: 70, G: 71, H: 72, I: 73, J: 74,
            K: 75, L: 76, M: 77, N: 78, O: 79, P: 80, Q: 81, R: 82, S: 83, T: 84,
            U: 85, V: 86, W: 87, X: 88, Y: 89, Z: 90,
            F1: 112, F2: 113, F3: 114, F4: 115, F5: 116, F6: 117,
            F7: 118, F8: 119, F9: 120, F10: 121, F11: 122, F12: 123,
            Enter: 13, Tab: 9, Space: 32, Escape: 27,
            BracketLeft: 219, BracketRight: 221,
            Semicolon: 186, Quote: 222, Comma: 188, Period: 190,
            Num1: 49, Num2: 50, Num3: 51, Num4: 52, Num5: 53,
            Num6: 54, Num7: 55, Num8: 56, Num9: 57, Num0: 48
        };

        function addShortcut(type, keyCode, ctrl, shift, alt, cmd) {
            if (type === undefined || type === null) return false;
            try {
                var shortcut = new AscCommon.AscShortcut(type, keyCode, ctrl, shift, alt, cmd);
                if (!d[type]) {
                    d[type] = shortcut;
                } else if (Array.isArray(d[type])) {
                    d[type].push(shortcut);
                } else {
                    d[type] = [d[type], shortcut];
                }
                return true;
            } catch(e) {
                console.warn('[BizBell] Failed to add shortcut:', e);
                return false;
            }
        }

        var added = [];

        // ========== 서식 관련 ==========

        // Alt+L: 글자 모양 (Font Dialog)
        if (addShortcut(t.OpenFontDialog, KEY.L, false, false, true, false)) {
            added.push('Alt+L (글자 모양)');
        }

        // Alt+T: 문단 모양 (Paragraph Dialog)
        if (addShortcut(t.OpenParagraphDialog, KEY.T, false, false, true, false)) {
            added.push('Alt+T (문단 모양)');
        }

        // Ctrl+]: 글자 크기 키우기
        if (addShortcut(t.IncreaseFontSize, KEY.BracketRight, true, false, false, false)) {
            added.push('Ctrl+] (글자 크게)');
        }

        // Ctrl+[: 글자 크기 줄이기
        if (addShortcut(t.DecreaseFontSize, KEY.BracketLeft, true, false, false, false)) {
            added.push('Ctrl+[ (글자 작게)');
        }

        // ========== 삽입 관련 ==========

        // Ctrl+F10: 특수문자 (Insert Symbol)
        if (addShortcut(t.InsertSymbol, KEY.F10, true, false, false, false)) {
            added.push('Ctrl+F10 (특수문자)');
        }

        // Ctrl+K: 하이퍼링크
        if (addShortcut(t.InsertHyperlink, KEY.K, true, false, false, false)) {
            added.push('Ctrl+K (하이퍼링크)');
        }

        // Ctrl+Enter: 페이지 나누기
        if (addShortcut(t.InsertPageBreak, KEY.Enter, true, false, false, false)) {
            added.push('Ctrl+Enter (페이지 나누기)');
        }

        // ========== 편집/탐색 관련 ==========

        // Ctrl+H: 찾아 바꾸기
        if (addShortcut(t.Replace, KEY.H, true, false, false, false)) {
            added.push('Ctrl+H (찾아 바꾸기)');
        }

        // F3: 다음 찾기
        if (addShortcut(t.FindNext, KEY.F3, false, false, false, false)) {
            added.push('F3 (다음 찾기)');
        }

        // ========== 정렬 관련 ==========

        // Ctrl+Shift+L: 왼쪽 정렬
        if (addShortcut(t.JustifyLeft, KEY.L, true, true, false, false)) {
            added.push('Ctrl+Shift+L (왼쪽 정렬)');
        }

        // Ctrl+Shift+R: 오른쪽 정렬
        if (addShortcut(t.JustifyRight, KEY.R, true, true, false, false)) {
            added.push('Ctrl+Shift+R (오른쪽 정렬)');
        }

        // Ctrl+Shift+C: 가운데 정렬
        if (addShortcut(t.JustifyCenter, KEY.C, true, true, false, false)) {
            added.push('Ctrl+Shift+C (가운데 정렬)');
        }

        // Ctrl+Shift+J: 양쪽 정렬
        if (addShortcut(t.JustifyFull, KEY.J, true, true, false, false)) {
            added.push('Ctrl+Shift+J (양쪽 정렬)');
        }

        // ========== 기타 ==========

        // F4: 마지막 작업 반복
        if (addShortcut(t.Repeat, KEY.F4, false, false, false, false)) {
            added.push('F4 (반복)');
        }

        // Ctrl+D: 글꼴 대화상자 (MS Word 호환)
        if (addShortcut(t.OpenFontDialog, KEY.D, true, false, false, false)) {
            added.push('Ctrl+D (글꼴)');
        }

        console.log('[BizBell] HWP shortcuts added:', added.length > 0 ? added.join(', ') : 'none');
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
