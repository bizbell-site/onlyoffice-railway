
// ============================================
// HWP (한글) 스타일 단축키 - BizBell Custom
// 이 코드는 Shortcuts.js 파일 끝에 추가됩니다
// ============================================

(function() {
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

    // Ctrl+Shift+>: 글자 크기 키우기 (대체)
    if (addShortcut(t.IncreaseFontSize, KEY.Period, true, true, false, false)) {
        added.push('Ctrl+Shift+> (글자 크게)');
    }

    // Ctrl+Shift+<: 글자 크기 줄이기 (대체)
    if (addShortcut(t.DecreaseFontSize, KEY.Comma, true, true, false, false)) {
        added.push('Ctrl+Shift+< (글자 작게)');
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

    // Ctrl+Shift+Enter: 구역/열 나누기
    if (addShortcut(t.InsertColumnBreak, KEY.Enter, true, true, false, false)) {
        added.push('Ctrl+Shift+Enter (구역 나누기)');
    }

    // Alt+Shift+D: 날짜 삽입
    if (addShortcut(t.InsertDateTime, KEY.D, false, true, true, false)) {
        added.push('Alt+Shift+D (날짜)');
    }

    // ========== 편집/탐색 관련 ==========

    // F7: 편집 용지 설정 (Page Setup)
    if (addShortcut(t.OpenPageSetup, KEY.F7, false, false, false, false)) {
        added.push('F7 (편집 용지)');
    }

    // Ctrl+H: 찾아 바꾸기
    if (addShortcut(t.Replace, KEY.H, true, false, false, false)) {
        added.push('Ctrl+H (찾아 바꾸기)');
    }

    // Ctrl+G / F5: 찾아가기
    if (addShortcut(t.GoTo, KEY.G, true, false, false, false)) {
        added.push('Ctrl+G (찾아가기)');
    }
    if (addShortcut(t.GoTo, KEY.F5, false, false, false, false)) {
        added.push('F5 (찾아가기)');
    }

    // F3: 다음 찾기
    if (addShortcut(t.FindNext, KEY.F3, false, false, false, false)) {
        added.push('F3 (다음 찾기)');
    }

    // Shift+F3: 이전 찾기
    if (addShortcut(t.FindPrevious, KEY.F3, false, true, false, false)) {
        added.push('Shift+F3 (이전 찾기)');
    }

    // ========== 목록/번호 관련 ==========

    // Alt+Shift+N 또는 Ctrl+Shift+L: 번호 매기기
    if (addShortcut(t.ToggleNumberedList, KEY.N, false, true, true, false)) {
        added.push('Alt+Shift+N (번호 매기기)');
    }

    // Alt+Shift+B 또는 Ctrl+Shift+U: 글머리 기호
    if (addShortcut(t.ToggleBulletedList, KEY.B, false, true, true, false)) {
        added.push('Alt+Shift+B (글머리 기호)');
    }

    // ========== 보기/표시 관련 ==========

    // Ctrl+Shift+8: 서식 기호 표시
    if (addShortcut(t.ShowParagraphMarks, KEY.Num8, true, true, false, false)) {
        added.push('Ctrl+Shift+8 (서식 기호)');
    }

    // Ctrl+M: 메모/주석 삽입
    if (addShortcut(t.InsertComment, KEY.M, true, false, false, false)) {
        added.push('Ctrl+M (메모)');
    }

    // Alt+M: 메모/주석 삽입 (HWP 대체)
    if (addShortcut(t.InsertComment, KEY.M, false, false, true, false)) {
        added.push('Alt+M (메모)');
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

    // ========== 스타일 관련 ==========

    // Ctrl+Shift+N: 일반 스타일
    if (addShortcut(t.ApplyStyleNormal, KEY.N, true, true, false, false)) {
        added.push('Ctrl+Shift+N (일반 스타일)');
    }

    // Ctrl+Alt+1: 제목 1
    if (addShortcut(t.ApplyStyleHeading1, KEY.Num1, true, false, true, false)) {
        added.push('Ctrl+Alt+1 (제목 1)');
    }

    // Ctrl+Alt+2: 제목 2
    if (addShortcut(t.ApplyStyleHeading2, KEY.Num2, true, false, true, false)) {
        added.push('Ctrl+Alt+2 (제목 2)');
    }

    // Ctrl+Alt+3: 제목 3
    if (addShortcut(t.ApplyStyleHeading3, KEY.Num3, true, false, true, false)) {
        added.push('Ctrl+Alt+3 (제목 3)');
    }

    // ========== 들여쓰기/내어쓰기 ==========

    // Ctrl+M: 들여쓰기 (일부 환경)
    if (addShortcut(t.IncreaseIndent, KEY.M, true, false, false, false)) {
        added.push('Ctrl+M (들여쓰기)');
    }

    // Ctrl+Shift+M: 내어쓰기
    if (addShortcut(t.DecreaseIndent, KEY.M, true, true, false, false)) {
        added.push('Ctrl+Shift+M (내어쓰기)');
    }

    // ========== 기타 유용한 단축키 ==========

    // F4: 마지막 작업 반복
    if (addShortcut(t.Repeat, KEY.F4, false, false, false, false)) {
        added.push('F4 (반복)');
    }

    // Ctrl+D: 글꼴 대화상자 (MS Word 호환)
    if (addShortcut(t.OpenFontDialog, KEY.D, true, false, false, false)) {
        added.push('Ctrl+D (글꼴)');
    }

    // Shift+F7: 동의어 사전
    if (addShortcut(t.OpenThesaurus, KEY.F7, false, true, false, false)) {
        added.push('Shift+F7 (동의어)');
    }

    // F1: 도움말
    if (addShortcut(t.Help, KEY.F1, false, false, false, false)) {
        added.push('F1 (도움말)');
    }

    console.log('[BizBell] HWP shortcuts added:', added.length > 0 ? added.join(', ') : 'none');
})();
// ============================================