
// ============================================
// HWP (한글) 스타일 단축키 - BizBell Custom
// 한컴오피스 한글의 실제 단축키를 OnlyOffice에 최대한 매핑
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
            A: 65, B: 66, C: 67, D: 68, E: 69, F: 70, G: 71, H: 72, I: 73, J: 74,
            K: 75, L: 76, M: 77, N: 78, O: 79, P: 80, Q: 81, R: 82, S: 83, T: 84,
            U: 85, V: 86, W: 87, X: 88, Y: 89, Z: 90,
            Num0: 48, Num1: 49, Num2: 50, Num3: 51, Num4: 52,
            Num5: 53, Num6: 54, Num7: 55, Num8: 56, Num9: 57,
            F1: 112, F2: 113, F3: 114, F4: 115, F5: 116, F6: 117,
            F7: 118, F8: 119, F9: 120, F10: 121, F11: 122, F12: 123,
            Enter: 13, Tab: 9, Space: 32, Escape: 27, Backspace: 8, Delete: 46,
            Left: 37, Up: 38, Right: 39, Down: 40,
            Home: 36, End: 35, PageUp: 33, PageDown: 34,
            BracketLeft: 219, BracketRight: 221,
            Minus: 189, Equal: 187, Semicolon: 186, Quote: 222,
            Comma: 188, Period: 190, Slash: 191, Backslash: 220
        };

        var added = [];

        // ============================================================
        // 한글(HWP) 단축키 최대 매핑
        // ============================================================

        // ===== 문단 정렬 =====
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
        // Ctrl+Shift+M: 양쪽 정렬
        if (t.JustifyPara !== undefined && addShortcut(t.JustifyPara, KEY.M, true, true, false, false)) {
            added.push('Ctrl+Shift+M (양쪽 정렬)');
        }

        // ===== 글자 서식 =====
        // Ctrl+B / Alt+Shift+B: 진하게
        if (t.Bold !== undefined) {
            if (addShortcut(t.Bold, KEY.B, true, false, false, false)) added.push('Ctrl+B (진하게)');
            if (addShortcut(t.Bold, KEY.B, false, true, true, false)) added.push('Alt+Shift+B (진하게)');
        }
        // Ctrl+I / Alt+Shift+I: 기울임
        if (t.Italic !== undefined) {
            if (addShortcut(t.Italic, KEY.I, true, false, false, false)) added.push('Ctrl+I (기울임)');
            if (addShortcut(t.Italic, KEY.I, false, true, true, false)) added.push('Alt+Shift+I (기울임)');
        }
        // Ctrl+U / Alt+Shift+U: 밑줄
        if (t.Underline !== undefined) {
            if (addShortcut(t.Underline, KEY.U, true, false, false, false)) added.push('Ctrl+U (밑줄)');
            if (addShortcut(t.Underline, KEY.U, false, true, true, false)) added.push('Alt+Shift+U (밑줄)');
        }
        // 취소선
        if (t.Strikeout !== undefined && addShortcut(t.Strikeout, KEY.D, true, false, false, false)) {
            added.push('Ctrl+D (취소선)');
        }
        // Alt+Shift+P: 위첨자
        if (t.Superscript !== undefined && addShortcut(t.Superscript, KEY.P, false, true, true, false)) {
            added.push('Alt+Shift+P (위첨자)');
        }
        // Alt+Shift+S: 아래첨자
        if (t.Subscript !== undefined && addShortcut(t.Subscript, KEY.S, false, true, true, false)) {
            added.push('Alt+Shift+S (아래첨자)');
        }

        // ===== 글자 크기 =====
        // Ctrl+] / Alt+Shift+E: 글자 크게
        if (t.IncreaseFontSize !== undefined) {
            if (addShortcut(t.IncreaseFontSize, KEY.BracketRight, true, false, false, false)) added.push('Ctrl+] (글자 크게)');
            if (addShortcut(t.IncreaseFontSize, KEY.E, false, true, true, false)) added.push('Alt+Shift+E (글자 크게)');
        }
        // Ctrl+[ / Alt+Shift+R: 글자 작게
        if (t.DecreaseFontSize !== undefined) {
            if (addShortcut(t.DecreaseFontSize, KEY.BracketLeft, true, false, false, false)) added.push('Ctrl+[ (글자 작게)');
            if (addShortcut(t.DecreaseFontSize, KEY.R, false, true, true, false)) added.push('Alt+Shift+R (글자 작게)');
        }

        // ===== 찾기/바꾸기 =====
        // Ctrl+F / F2: 찾기
        if (t.OpenFindDialog !== undefined) {
            if (addShortcut(t.OpenFindDialog, KEY.F, true, false, false, false)) added.push('Ctrl+F (찾기)');
            if (addShortcut(t.OpenFindDialog, KEY.F2, false, false, false, false)) added.push('F2 (찾기)');
        }
        // Ctrl+H / Ctrl+F2: 찾아 바꾸기
        if (t.OpenFindAndReplaceMenu !== undefined) {
            if (addShortcut(t.OpenFindAndReplaceMenu, KEY.H, true, false, false, false)) added.push('Ctrl+H (찾아 바꾸기)');
            if (addShortcut(t.OpenFindAndReplaceMenu, KEY.F2, true, false, false, false)) added.push('Ctrl+F2 (찾아 바꾸기)');
        }

        // ===== 삽입 =====
        // Ctrl+K,H 대신 Ctrl+K: 하이퍼링크
        if (t.InsertHyperlink !== undefined && addShortcut(t.InsertHyperlink, KEY.K, true, false, false, false)) {
            added.push('Ctrl+K (하이퍼링크)');
        }
        // Ctrl+Enter / Ctrl+J: 쪽 나누기
        if (t.InsertPageBreak !== undefined) {
            if (addShortcut(t.InsertPageBreak, KEY.Enter, true, false, false, false)) added.push('Ctrl+Enter (쪽 나누기)');
            if (addShortcut(t.InsertPageBreak, KEY.J, true, false, false, false)) added.push('Ctrl+J (쪽 나누기)');
        }
        // Ctrl+Shift+Enter: 단 나누기
        if (t.InsertColumnBreak !== undefined && addShortcut(t.InsertColumnBreak, KEY.Enter, true, true, false, false)) {
            added.push('Ctrl+Shift+Enter (단 나누기)');
        }
        // Shift+Enter: 강제 줄 나누기
        if (t.InsertLineBreak !== undefined && addShortcut(t.InsertLineBreak, KEY.Enter, false, true, false, false)) {
            added.push('Shift+Enter (줄 나누기)');
        }
        // 각주
        if (t.InsertFootnoteNow !== undefined && addShortcut(t.InsertFootnoteNow, KEY.N, true, false, false, false)) {
            added.push('Ctrl+N (각주)');
        }
        // 미주
        if (t.InsertEndnoteNow !== undefined && addShortcut(t.InsertEndnoteNow, KEY.E, true, false, false, false)) {
            added.push('Ctrl+E (미주)');
        }

        // ===== 편집 =====
        // Ctrl+Z: 되돌리기
        if (t.EditUndo !== undefined && addShortcut(t.EditUndo, KEY.Z, true, false, false, false)) {
            added.push('Ctrl+Z (되돌리기)');
        }
        // Ctrl+Shift+Z: 다시 실행
        if (t.EditRedo !== undefined && addShortcut(t.EditRedo, KEY.Z, true, true, false, false)) {
            added.push('Ctrl+Shift+Z (다시 실행)');
        }
        // Ctrl+Y: 한 줄 지우기 (한글) -> OnlyOffice에서는 Redo로 동작할 수 있음
        // Ctrl+A: 모두 선택
        if (t.EditSelectAll !== undefined && addShortcut(t.EditSelectAll, KEY.A, true, false, false, false)) {
            added.push('Ctrl+A (모두 선택)');
        }
        // Ctrl+X / Shift+Delete: 오려 두기
        if (t.Cut !== undefined) {
            if (addShortcut(t.Cut, KEY.X, true, false, false, false)) added.push('Ctrl+X (오려 두기)');
            if (addShortcut(t.Cut, KEY.Delete, false, true, false, false)) added.push('Shift+Delete (오려 두기)');
        }
        // Ctrl+C / Ctrl+Insert: 복사하기
        if (t.Copy !== undefined) {
            if (addShortcut(t.Copy, KEY.C, true, false, false, false)) added.push('Ctrl+C (복사하기)');
        }
        // Ctrl+V / Shift+Insert: 붙이기
        if (t.Paste !== undefined) {
            if (addShortcut(t.Paste, KEY.V, true, false, false, false)) added.push('Ctrl+V (붙이기)');
            if (addShortcut(t.Paste, KEY.Insert, false, true, false, false)) added.push('Shift+Insert (붙이기)');
        }

        // ===== 커서 이동 =====
        // Ctrl+Home: 화면 처음으로
        if (t.MoveToStartDocument !== undefined && addShortcut(t.MoveToStartDocument, KEY.Home, true, false, false, false)) {
            added.push('Ctrl+Home (문서 처음)');
        }
        // Ctrl+End: 화면 끝으로
        if (t.MoveToEndDocument !== undefined && addShortcut(t.MoveToEndDocument, KEY.End, true, false, false, false)) {
            added.push('Ctrl+End (문서 끝)');
        }
        // Home: 줄 처음으로
        if (t.MoveToStartLine !== undefined && addShortcut(t.MoveToStartLine, KEY.Home, false, false, false, false)) {
            added.push('Home (줄 처음)');
        }
        // End: 줄 끝으로
        if (t.MoveToEndLine !== undefined && addShortcut(t.MoveToEndLine, KEY.End, false, false, false, false)) {
            added.push('End (줄 끝)');
        }
        // Ctrl+PageUp: 문서의 처음으로
        if (t.MoveToStartPreviousPage !== undefined && addShortcut(t.MoveToStartPreviousPage, KEY.PageUp, true, false, false, false)) {
            added.push('Ctrl+PageUp (이전 쪽)');
        }
        // Ctrl+PageDown: 문서의 끝으로
        if (t.MoveToStartNextPage !== undefined && addShortcut(t.MoveToStartNextPage, KEY.PageDown, true, false, false, false)) {
            added.push('Ctrl+PageDown (다음 쪽)');
        }
        // Ctrl+Right: 한 단어 오른쪽으로
        if (t.MoveToEndWord !== undefined && addShortcut(t.MoveToEndWord, KEY.Right, true, false, false, false)) {
            added.push('Ctrl+Right (단어 끝)');
        }
        // Ctrl+Left: 한 단어 왼쪽으로
        if (t.MoveToStartWord !== undefined && addShortcut(t.MoveToStartWord, KEY.Left, true, false, false, false)) {
            added.push('Ctrl+Left (단어 시작)');
        }

        // ===== 선택 =====
        // Shift+Home: 줄 처음까지 선택
        if (t.SelectToStartLine !== undefined && addShortcut(t.SelectToStartLine, KEY.Home, false, true, false, false)) {
            added.push('Shift+Home (줄 처음까지 선택)');
        }
        // Shift+End: 줄 끝까지 선택
        if (t.SelectToEndLine !== undefined && addShortcut(t.SelectToEndLine, KEY.End, false, true, false, false)) {
            added.push('Shift+End (줄 끝까지 선택)');
        }
        // Ctrl+Shift+Home: 문서 처음까지 선택
        if (t.SelectToStartDocument !== undefined && addShortcut(t.SelectToStartDocument, KEY.Home, true, true, false, false)) {
            added.push('Ctrl+Shift+Home (문서 처음까지 선택)');
        }
        // Ctrl+Shift+End: 문서 끝까지 선택
        if (t.SelectToEndDocument !== undefined && addShortcut(t.SelectToEndDocument, KEY.End, true, true, false, false)) {
            added.push('Ctrl+Shift+End (문서 끝까지 선택)');
        }

        // ===== 들여쓰기 =====
        // Tab: 들여쓰기
        if (t.Indent !== undefined && addShortcut(t.Indent, KEY.Tab, false, false, false, false)) {
            added.push('Tab (들여쓰기)');
        }
        // Shift+Tab: 내어쓰기
        if (t.UnIndent !== undefined && addShortcut(t.UnIndent, KEY.Tab, false, true, false, false)) {
            added.push('Shift+Tab (내어쓰기)');
        }

        // ===== 파일 =====
        // Ctrl+S / Alt+S: 저장하기
        if (t.Save !== undefined) {
            if (addShortcut(t.Save, KEY.S, true, false, false, false)) added.push('Ctrl+S (저장)');
            if (addShortcut(t.Save, KEY.S, false, false, true, false)) added.push('Alt+S (저장)');
        }
        // Ctrl+P / Alt+P: 인쇄
        if (t.PrintPreviewAndPrint !== undefined) {
            if (addShortcut(t.PrintPreviewAndPrint, KEY.P, true, false, false, false)) added.push('Ctrl+P (인쇄)');
            if (addShortcut(t.PrintPreviewAndPrint, KEY.P, false, false, true, false)) added.push('Alt+P (인쇄)');
        }

        // ===== 보기 =====
        // 화면 확대 100%
        if (t.Zoom100 !== undefined && addShortcut(t.Zoom100, KEY.Num0, true, false, false, false)) {
            added.push('Ctrl+0 (100% 확대)');
        }
        // 화면 확대
        if (t.ZoomIn !== undefined && addShortcut(t.ZoomIn, KEY.Equal, true, false, false, false)) {
            added.push('Ctrl+= (확대)');
        }
        // 화면 축소
        if (t.ZoomOut !== undefined && addShortcut(t.ZoomOut, KEY.Minus, true, false, false, false)) {
            added.push('Ctrl+- (축소)');
        }

        // ===== 스타일/제목 =====
        // Ctrl+1: 제목1 스타일 (한글: Ctrl+1~0 스타일)
        if (t.ApplyHeading1 !== undefined && addShortcut(t.ApplyHeading1, KEY.Num1, true, false, false, false)) {
            added.push('Ctrl+1 (제목1)');
        }
        if (t.ApplyHeading2 !== undefined && addShortcut(t.ApplyHeading2, KEY.Num2, true, false, false, false)) {
            added.push('Ctrl+2 (제목2)');
        }
        if (t.ApplyHeading3 !== undefined && addShortcut(t.ApplyHeading3, KEY.Num3, true, false, false, false)) {
            added.push('Ctrl+3 (제목3)');
        }

        // ===== 특수 문자 =====
        // Em Dash (—)
        if (t.EmDash !== undefined && addShortcut(t.EmDash, KEY.Minus, true, false, true, false)) {
            added.push('Ctrl+Alt+- (Em Dash)');
        }
        // En Dash (–)
        if (t.EnDash !== undefined && addShortcut(t.EnDash, KEY.Minus, true, false, false, false)) {
            // 이미 Ctrl+-가 축소로 사용될 수 있음
        }
        // 줄임표
        if (t.HorizontalEllipsis !== undefined && addShortcut(t.HorizontalEllipsis, KEY.Period, true, false, true, false)) {
            added.push('Ctrl+Alt+. (줄임표)');
        }
        // 저작권 기호
        if (t.CopyrightSign !== undefined && addShortcut(t.CopyrightSign, KEY.C, true, false, true, false)) {
            added.push('Ctrl+Alt+C (©)');
        }
        // 등록상표 기호
        if (t.RegisteredSign !== undefined && addShortcut(t.RegisteredSign, KEY.R, true, false, true, false)) {
            added.push('Ctrl+Alt+R (®)');
        }
        // 상표 기호
        if (t.TrademarkSign !== undefined && addShortcut(t.TrademarkSign, KEY.T, true, false, true, false)) {
            added.push('Ctrl+Alt+T (™)');
        }

        // ===== 기타 =====
        // 조판 부호 보이기 (한글: Ctrl+G,C)
        if (t.ShowAll !== undefined && addShortcut(t.ShowAll, KEY.G, true, false, false, false)) {
            added.push('Ctrl+G (조판 부호)');
        }
        // 서식 복사 (한글: Alt+C)
        if (t.CopyFormat !== undefined && addShortcut(t.CopyFormat, KEY.C, false, false, true, false)) {
            added.push('Alt+C (모양 복사)');
        }
        // 서식 붙이기
        if (t.PasteFormat !== undefined && addShortcut(t.PasteFormat, KEY.V, false, false, true, false)) {
            added.push('Alt+V (모양 붙이기)');
        }
        // 수식 삽입
        if (t.InsertEquation !== undefined && addShortcut(t.InsertEquation, KEY.E, true, false, true, false)) {
            added.push('Ctrl+Alt+E (수식)');
        }

        // ===== 도움말 =====
        if (t.OpenHelpMenu !== undefined && addShortcut(t.OpenHelpMenu, KEY.F1, false, false, false, false)) {
            added.push('F1 (도움말)');
        }

        console.log('[BizBell] HWP shortcuts initialized (' + added.length + '):', added.join(', '));
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
