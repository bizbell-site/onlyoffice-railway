
// ============================================
// HWP (한글) 스타일 단축키 - BizBell Custom
// 한컴오피스 한글의 실제 단축키를 OnlyOffice에 매핑
// 참조: https://help.hancom.com/hoffice/multi/ko_kr/hwp/view/toolbar/shortcut(table).htm
// ============================================

(function() {
    'use strict';

    function initHwpShortcuts() {
        if (typeof Asc === 'undefined' ||
            typeof Asc.c_oAscDocumentShortcutType === 'undefined' ||
            typeof AscCommon === 'undefined' ||
            typeof AscCommon.CShortcuts === 'undefined') {
            setTimeout(initHwpShortcuts, 100);
            return;
        }

        var t = Asc.c_oAscDocumentShortcutType;

        // 키 해시 생성 함수
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
                if (AscCommon.CShortcuts.prototype && AscCommon.CShortcuts.prototype.Get) {
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
            B: 66, C: 67, D: 68, E: 69, F: 70, H: 72, I: 73, J: 74,
            K: 75, L: 76, M: 77, N: 78, P: 80, R: 82, S: 83, T: 84, U: 85, W: 87,
            F2: 113, F3: 114, F10: 121,
            Enter: 13,
            BracketLeft: 219, BracketRight: 221
        };

        var added = [];

        // ============================================================
        // 한글(HWP) 실제 단축키 매핑
        // ============================================================

        // === 문단 정렬 (한글 기본 단축키) ===
        // Ctrl+Shift+L: 왼쪽 정렬
        if (t.LeftPara !== undefined && addShortcut(t.LeftPara, KEY.L, true, true, false, false)) {
            added.push('Ctrl+Shift+L (왼쪽 정렬)');
        }
        // Ctrl+Shift+C: 가운데 정렬
        if (t.CenterPara !== undefined && addShortcut(t.CenterPara, KEY.C, true, true, false, false)) {
            added.push('Ctrl+Shift+C (가운데 정렬)');
        }
        // Ctrl+Shift+R: 오른쪽 정렬
        if (t.RightPara !== undefined && addShortcut(t.RightPara, KEY.R, true, true, false, false)) {
            added.push('Ctrl+Shift+R (오른쪽 정렬)');
        }
        // Ctrl+Shift+M: 양쪽 정렬 (한글 기본)
        if (t.JustifyPara !== undefined && addShortcut(t.JustifyPara, KEY.M, true, true, false, false)) {
            added.push('Ctrl+Shift+M (양쪽 정렬)');
        }

        // === 글자 서식 (한글 기본 단축키) ===
        // Ctrl+B: 진하게 (굵게)
        if (t.Bold !== undefined && addShortcut(t.Bold, KEY.B, true, false, false, false)) {
            added.push('Ctrl+B (진하게)');
        }
        // Ctrl+I: 기울임
        if (t.Italic !== undefined && addShortcut(t.Italic, KEY.I, true, false, false, false)) {
            added.push('Ctrl+I (기울임)');
        }
        // Ctrl+U: 밑줄
        if (t.Underline !== undefined && addShortcut(t.Underline, KEY.U, true, false, false, false)) {
            added.push('Ctrl+U (밑줄)');
        }

        // === 위첨자/아래첨자 (한글: Alt+Shift+P/S) ===
        // Alt+Shift+P: 위 첨자
        if (t.Superscript !== undefined && addShortcut(t.Superscript, KEY.P, false, true, true, false)) {
            added.push('Alt+Shift+P (위첨자)');
        }
        // Alt+Shift+S: 아래 첨자
        if (t.Subscript !== undefined && addShortcut(t.Subscript, KEY.S, false, true, true, false)) {
            added.push('Alt+Shift+S (아래첨자)');
        }

        // === 찾기/바꾸기 (한글 기본 단축키) ===
        // Ctrl+F 또는 F2: 찾기
        if (t.OpenFindDialog !== undefined) {
            if (addShortcut(t.OpenFindDialog, KEY.F, true, false, false, false)) {
                added.push('Ctrl+F (찾기)');
            }
            if (addShortcut(t.OpenFindDialog, KEY.F2, false, false, false, false)) {
                added.push('F2 (찾기)');
            }
        }
        // Ctrl+H: 찾아 바꾸기
        if (t.OpenFindAndReplaceMenu !== undefined && addShortcut(t.OpenFindAndReplaceMenu, KEY.H, true, false, false, false)) {
            added.push('Ctrl+H (찾아 바꾸기)');
        }
        // F3: 다음 찾기 (한글에서는 Ctrl+L이지만 OnlyOffice 타입에 맞춤)
        // Ctrl+L: 다시 찾기 - OnlyOffice에 해당 타입이 있으면 매핑

        // === 글자 크기 조절 ===
        // Ctrl+]: 글자 크기 키우기
        if (t.IncreaseFontSize !== undefined && addShortcut(t.IncreaseFontSize, KEY.BracketRight, true, false, false, false)) {
            added.push('Ctrl+] (글자 크게)');
        }
        // Ctrl+[: 글자 크기 줄이기
        if (t.DecreaseFontSize !== undefined && addShortcut(t.DecreaseFontSize, KEY.BracketLeft, true, false, false, false)) {
            added.push('Ctrl+[ (글자 작게)');
        }

        // === 삽입 관련 ===
        // Ctrl+K: 하이퍼링크 삽입
        if (t.InsertHyperlink !== undefined && addShortcut(t.InsertHyperlink, KEY.K, true, false, false, false)) {
            added.push('Ctrl+K (하이퍼링크)');
        }
        // Ctrl+Enter: 페이지 나누기 (한글: Ctrl+Enter)
        if (t.InsertPageBreak !== undefined && addShortcut(t.InsertPageBreak, KEY.Enter, true, false, false, false)) {
            added.push('Ctrl+Enter (페이지 나누기)');
        }
        // Ctrl+Shift+Enter: 단 나누기 (한글 기본)
        // OnlyOffice에 InsertColumnBreak가 있으면 매핑
        if (t.InsertColumnBreak !== undefined && addShortcut(t.InsertColumnBreak, KEY.Enter, true, true, false, false)) {
            added.push('Ctrl+Shift+Enter (단 나누기)');
        }

        // === 들여쓰기 (한글: Tab, Shift+Tab) ===
        // 이미 OnlyOffice 기본값으로 동작

        // === 실행 취소/다시 실행 ===
        // Ctrl+Z: 실행 취소 (이미 기본)
        // Ctrl+Shift+Z: 다시 실행 (한글 기본)
        if (t.EditRedo !== undefined && addShortcut(t.EditRedo, 90, true, true, false, false)) { // Z=90
            added.push('Ctrl+Shift+Z (다시 실행)');
        }

        console.log('[BizBell] HWP shortcuts initialized:', added.length > 0 ? added.join(', ') : 'none');
    }

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
