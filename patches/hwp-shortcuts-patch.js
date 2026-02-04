
// ============================================
// HWP (한글) 스타일 단축키 - BizBell Custom
// 한컴오피스 한글의 실제 단축키를 OnlyOffice에 최대한 매핑
// 브라우저와 충돌하는 단축키는 제외
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
        // 한글(HWP) 단축키 매핑 (브라우저 충돌 제외)
        //
        // 제외된 단축키 (브라우저와 충돌):
        // - Ctrl+Shift+R: 브라우저 강력 새로고침
        // - Ctrl+Shift+C: 브라우저 개발자 도구
        // - Ctrl+Shift+J: 브라우저 콘솔
        // - Ctrl+N: 브라우저 새 창
        // - Ctrl+T: 브라우저 새 탭
        // - Ctrl+W: 브라우저 탭 닫기
        // - F5: 브라우저 새로고침
        // ============================================================

        // ===== 문단 정렬 =====
        // Ctrl+Shift+L: 왼쪽 정렬
        if (t.LeftPara !== undefined && addShortcut(t.LeftPara, KEY.L, true, true, false, false)) {
            added.push('Ctrl+Shift+L (왼쪽 정렬)');
        }
        // Ctrl+Shift+M: 양쪽 정렬 (가운데 정렬 Ctrl+Shift+C는 브라우저와 충돌)
        if (t.JustifyPara !== undefined && addShortcut(t.JustifyPara, KEY.M, true, true, false, false)) {
            added.push('Ctrl+Shift+M (양쪽 정렬)');
        }
        // Ctrl+Shift+T: 배분 정렬 (한글 기본)
        // 참고: Ctrl+Shift+R (오른쪽)과 Ctrl+Shift+C (가운데)는 브라우저 충돌로 제외

        // ===== 글자 서식 =====
        // Ctrl+B: 진하게
        if (t.Bold !== undefined && addShortcut(t.Bold, KEY.B, true, false, false, false)) {
            added.push('Ctrl+B (진하게)');
        }
        // Alt+Shift+B: 진하게 (대체)
        if (t.Bold !== undefined && addShortcut(t.Bold, KEY.B, false, true, true, false)) {
            added.push('Alt+Shift+B (진하게)');
        }
        // Ctrl+I: 기울임
        if (t.Italic !== undefined && addShortcut(t.Italic, KEY.I, true, false, false, false)) {
            added.push('Ctrl+I (기울임)');
        }
        // Alt+Shift+I: 기울임 (대체)
        if (t.Italic !== undefined && addShortcut(t.Italic, KEY.I, false, true, true, false)) {
            added.push('Alt+Shift+I (기울임)');
        }
        // Ctrl+U: 밑줄
        if (t.Underline !== undefined && addShortcut(t.Underline, KEY.U, true, false, false, false)) {
            added.push('Ctrl+U (밑줄)');
        }
        // Alt+Shift+U: 밑줄 (대체)
        if (t.Underline !== undefined && addShortcut(t.Underline, KEY.U, false, true, true, false)) {
            added.push('Alt+Shift+U (밑줄)');
        }
        // Ctrl+D: 취소선
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
        // Alt+Shift+C: 보통 모양 (서식 초기화)
        if (t.ResetChar !== undefined && addShortcut(t.ResetChar, KEY.C, false, true, true, false)) {
            added.push('Alt+Shift+C (보통 모양)');
        }

        // ===== 글자 크기 =====
        // Ctrl+]: 글자 크게
        if (t.IncreaseFontSize !== undefined && addShortcut(t.IncreaseFontSize, KEY.BracketRight, true, false, false, false)) {
            added.push('Ctrl+] (글자 크게)');
        }
        // Alt+Shift+E: 글자 크게 (한글 기본)
        if (t.IncreaseFontSize !== undefined && addShortcut(t.IncreaseFontSize, KEY.E, false, true, true, false)) {
            added.push('Alt+Shift+E (글자 크게)');
        }
        // Ctrl+[: 글자 작게
        if (t.DecreaseFontSize !== undefined && addShortcut(t.DecreaseFontSize, KEY.BracketLeft, true, false, false, false)) {
            added.push('Ctrl+[ (글자 작게)');
        }
        // 참고: Alt+Shift+R (글자 작게)는 Ctrl+Shift+R과 혼동 가능, 제외

        // ===== 찾기/바꾸기 =====
        // Ctrl+F: 찾기
        if (t.OpenFindDialog !== undefined && addShortcut(t.OpenFindDialog, KEY.F, true, false, false, false)) {
            added.push('Ctrl+F (찾기)');
        }
        // F2: 찾기 (한글 기본)
        if (t.OpenFindDialog !== undefined && addShortcut(t.OpenFindDialog, KEY.F2, false, false, false, false)) {
            added.push('F2 (찾기)');
        }
        // Ctrl+H: 찾아 바꾸기
        if (t.OpenFindAndReplaceMenu !== undefined && addShortcut(t.OpenFindAndReplaceMenu, KEY.H, true, false, false, false)) {
            added.push('Ctrl+H (찾아 바꾸기)');
        }
        // Ctrl+F2: 찾아 바꾸기 (한글 기본)
        if (t.OpenFindAndReplaceMenu !== undefined && addShortcut(t.OpenFindAndReplaceMenu, KEY.F2, true, false, false, false)) {
            added.push('Ctrl+F2 (찾아 바꾸기)');
        }

        // ===== 삽입 =====
        // Ctrl+K: 하이퍼링크
        if (t.InsertHyperlink !== undefined && addShortcut(t.InsertHyperlink, KEY.K, true, false, false, false)) {
            added.push('Ctrl+K (하이퍼링크)');
        }
        // Ctrl+Enter: 쪽 나누기
        if (t.InsertPageBreak !== undefined && addShortcut(t.InsertPageBreak, KEY.Enter, true, false, false, false)) {
            added.push('Ctrl+Enter (쪽 나누기)');
        }
        // Ctrl+J: 쪽 나누기 (한글 기본)
        if (t.InsertPageBreak !== undefined && addShortcut(t.InsertPageBreak, KEY.J, true, false, false, false)) {
            added.push('Ctrl+J (쪽 나누기)');
        }
        // Ctrl+Shift+Enter: 단 나누기
        if (t.InsertColumnBreak !== undefined && addShortcut(t.InsertColumnBreak, KEY.Enter, true, true, false, false)) {
            added.push('Ctrl+Shift+Enter (단 나누기)');
        }
        // Shift+Enter: 강제 줄 나누기
        if (t.InsertLineBreak !== undefined && addShortcut(t.InsertLineBreak, KEY.Enter, false, true, false, false)) {
            added.push('Shift+Enter (줄 나누기)');
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
        // Ctrl+Y: 다시 실행 (OnlyOffice 기본)
        if (t.EditRedo !== undefined && addShortcut(t.EditRedo, KEY.Y, true, false, false, false)) {
            added.push('Ctrl+Y (다시 실행)');
        }
        // Ctrl+A: 모두 선택
        if (t.EditSelectAll !== undefined && addShortcut(t.EditSelectAll, KEY.A, true, false, false, false)) {
            added.push('Ctrl+A (모두 선택)');
        }
        // Ctrl+X: 오려 두기
        if (t.Cut !== undefined && addShortcut(t.Cut, KEY.X, true, false, false, false)) {
            added.push('Ctrl+X (오려 두기)');
        }
        // Shift+Delete: 오려 두기 (한글 기본)
        if (t.Cut !== undefined && addShortcut(t.Cut, KEY.Delete, false, true, false, false)) {
            added.push('Shift+Delete (오려 두기)');
        }
        // Ctrl+C: 복사하기
        if (t.Copy !== undefined && addShortcut(t.Copy, KEY.C, true, false, false, false)) {
            added.push('Ctrl+C (복사하기)');
        }
        // Ctrl+V: 붙이기
        if (t.Paste !== undefined && addShortcut(t.Paste, KEY.V, true, false, false, false)) {
            added.push('Ctrl+V (붙이기)');
        }

        // ===== 커서 이동 =====
        // Home: 줄 처음으로
        if (t.MoveToStartLine !== undefined && addShortcut(t.MoveToStartLine, KEY.Home, false, false, false, false)) {
            added.push('Home (줄 처음)');
        }
        // End: 줄 끝으로
        if (t.MoveToEndLine !== undefined && addShortcut(t.MoveToEndLine, KEY.End, false, false, false, false)) {
            added.push('End (줄 끝)');
        }
        // Ctrl+Home: 문서 처음으로
        if (t.MoveToStartDocument !== undefined && addShortcut(t.MoveToStartDocument, KEY.Home, true, false, false, false)) {
            added.push('Ctrl+Home (문서 처음)');
        }
        // Ctrl+End: 문서 끝으로
        if (t.MoveToEndDocument !== undefined && addShortcut(t.MoveToEndDocument, KEY.End, true, false, false, false)) {
            added.push('Ctrl+End (문서 끝)');
        }
        // Ctrl+Right: 단어 끝으로
        if (t.MoveToEndWord !== undefined && addShortcut(t.MoveToEndWord, KEY.Right, true, false, false, false)) {
            added.push('Ctrl+Right (단어 끝)');
        }
        // Ctrl+Left: 단어 시작으로
        if (t.MoveToStartWord !== undefined && addShortcut(t.MoveToStartWord, KEY.Left, true, false, false, false)) {
            added.push('Ctrl+Left (단어 시작)');
        }
        // Ctrl+PageUp: 이전 쪽
        if (t.MoveToStartPreviousPage !== undefined && addShortcut(t.MoveToStartPreviousPage, KEY.PageUp, true, false, false, false)) {
            added.push('Ctrl+PageUp (이전 쪽)');
        }
        // Ctrl+PageDown: 다음 쪽
        if (t.MoveToStartNextPage !== undefined && addShortcut(t.MoveToStartNextPage, KEY.PageDown, true, false, false, false)) {
            added.push('Ctrl+PageDown (다음 쪽)');
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
        // Ctrl+S: 저장
        if (t.Save !== undefined && addShortcut(t.Save, KEY.S, true, false, false, false)) {
            added.push('Ctrl+S (저장)');
        }
        // Alt+S: 저장 (한글 기본)
        if (t.Save !== undefined && addShortcut(t.Save, KEY.S, false, false, true, false)) {
            added.push('Alt+S (저장)');
        }
        // Ctrl+P: 인쇄
        if (t.PrintPreviewAndPrint !== undefined && addShortcut(t.PrintPreviewAndPrint, KEY.P, true, false, false, false)) {
            added.push('Ctrl+P (인쇄)');
        }
        // Alt+P: 인쇄 (한글 기본)
        if (t.PrintPreviewAndPrint !== undefined && addShortcut(t.PrintPreviewAndPrint, KEY.P, false, false, true, false)) {
            added.push('Alt+P (인쇄)');
        }

        // ===== 보기 =====
        // Ctrl+0: 화면 확대 100%
        if (t.Zoom100 !== undefined && addShortcut(t.Zoom100, KEY.Num0, true, false, false, false)) {
            added.push('Ctrl+0 (100% 확대)');
        }

        // ===== 스타일 =====
        // Ctrl+1/2/3: 제목 스타일 (한글 스타일 단축키와 유사)
        if (t.ApplyHeading1 !== undefined && addShortcut(t.ApplyHeading1, KEY.Num1, true, false, false, false)) {
            added.push('Ctrl+1 (제목1)');
        }
        if (t.ApplyHeading2 !== undefined && addShortcut(t.ApplyHeading2, KEY.Num2, true, false, false, false)) {
            added.push('Ctrl+2 (제목2)');
        }
        if (t.ApplyHeading3 !== undefined && addShortcut(t.ApplyHeading3, KEY.Num3, true, false, false, false)) {
            added.push('Ctrl+3 (제목3)');
        }

        // ===== 특수 문자 삽입 =====
        // Ctrl+Alt+-: Em Dash (—)
        if (t.EmDash !== undefined && addShortcut(t.EmDash, KEY.Minus, true, false, true, false)) {
            added.push('Ctrl+Alt+- (Em Dash)');
        }
        // Ctrl+Alt+.: 줄임표 (…)
        if (t.HorizontalEllipsis !== undefined && addShortcut(t.HorizontalEllipsis, KEY.Period, true, false, true, false)) {
            added.push('Ctrl+Alt+. (줄임표)');
        }
        // Ctrl+Alt+C: 저작권 기호 (©)
        if (t.CopyrightSign !== undefined && addShortcut(t.CopyrightSign, KEY.C, true, false, true, false)) {
            added.push('Ctrl+Alt+C (©)');
        }
        // Ctrl+Alt+R: 등록상표 기호 (®)
        if (t.RegisteredSign !== undefined && addShortcut(t.RegisteredSign, KEY.R, true, false, true, false)) {
            added.push('Ctrl+Alt+R (®)');
        }
        // Ctrl+Alt+T: 상표 기호 (™)
        if (t.TrademarkSign !== undefined && addShortcut(t.TrademarkSign, KEY.T, true, false, true, false)) {
            added.push('Ctrl+Alt+T (™)');
        }

        // ===== 기타 =====
        // Alt+C: 모양 복사 (한글 기본)
        if (t.CopyFormat !== undefined && addShortcut(t.CopyFormat, KEY.C, false, false, true, false)) {
            added.push('Alt+C (모양 복사)');
        }
        // Ctrl+Alt+E: 수식 삽입
        if (t.InsertEquation !== undefined && addShortcut(t.InsertEquation, KEY.E, true, false, true, false)) {
            added.push('Ctrl+Alt+E (수식)');
        }
        // F1: 도움말
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
