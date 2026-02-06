/**
 * HWP/Word Keyboard Shortcuts Patch for OnlyOffice
 *
 * 한글(HWP) 또는 MS Word 스타일 단축키를 OnlyOffice Document Editor에 추가합니다.
 * 사용자가 선택한 스타일에 따라 다른 단축키가 활성화됩니다.
 *
 * 총 62개 기본 단축키 + 스타일별 추가 단축키
 */

(function() {
  'use strict';

  // localStorage 키
  var SHORTCUT_STYLE_KEY = 'bizbell-shortcut-style';

  // 현재 스타일 (기본값: hwp)
  var currentStyle = 'hwp';

  // 등록된 단축키 목록 (로깅용)
  var registeredShortcuts = [];

  // OnlyOffice API가 로드될 때까지 대기
  var checkInterval = setInterval(function() {
    if (typeof window.Asc !== 'undefined' && window.Asc.asc_docs_api) {
      clearInterval(checkInterval);
      setTimeout(initShortcuts, 500); // API 초기화 대기
    }
  }, 100);

  // 타임아웃 (15초)
  setTimeout(function() {
    clearInterval(checkInterval);
  }, 15000);

  function initShortcuts() {
    console.log('[BizBell] Initializing keyboard shortcuts...');

    // localStorage에서 스타일 로드
    try {
      var saved = localStorage.getItem(SHORTCUT_STYLE_KEY);
      if (saved === 'hwp' || saved === 'word') {
        currentStyle = saved;
      }
    } catch (e) {
      console.warn('[BizBell] Failed to load style:', e);
    }

    // 스타일 변경 이벤트 리스너 (CustomEvent)
    window.addEventListener('shortcut-style-change', function(e) {
      if (e.detail && (e.detail.style === 'hwp' || e.detail.style === 'word')) {
        changeShortcutStyle(e.detail.style);
      }
    });

    // 스타일 변경 메시지 리스너 (postMessage from parent)
    window.addEventListener('message', function(e) {
      if (e.data && e.data.type === 'bizbell-shortcut-style-change') {
        if (e.data.style === 'hwp' || e.data.style === 'word') {
          changeShortcutStyle(e.data.style);
        }
      }
    });

    function changeShortcutStyle(newStyle) {
      if (newStyle === currentStyle) return;
      var oldStyle = currentStyle;
      currentStyle = newStyle;
      try {
        localStorage.setItem(SHORTCUT_STYLE_KEY, newStyle);
      } catch (e) {}
      console.log('[BizBell] Shortcut style changed:', oldStyle, '->', currentStyle);
      reregisterStyleShortcuts();
    }

    // 외부 API에서 사용할 수 있도록 저장
    _changeShortcutStyle = changeShortcutStyle;

    // 기본 단축키 등록 (공통)
    registerCommonShortcuts();

    // 스타일별 단축키 등록
    registerStyleShortcuts();

    // 등록된 단축키 로그 출력
    console.log('[BizBell] HWP shortcuts initialized (' + registeredShortcuts.length + '):', registeredShortcuts.join(', '));
  }

  // ============================================================
  // 공통 단축키 (한글/MS Word 동일)
  // ============================================================
  function registerCommonShortcuts() {
    var api = window.Asc.asc_docs_api.prototype;
    var shortcutManager = getShortcutManager();

    if (!shortcutManager) {
      console.warn('[BizBell] Shortcut manager not found, using fallback');
      registerFallbackShortcuts();
      return;
    }

    // 글꼴 서식
    addShortcut('Ctrl+B', '진하게', function() { execCommand('Bold'); });
    addShortcut('Ctrl+I', '기울임', function() { execCommand('Italic'); });
    addShortcut('Ctrl+U', '밑줄', function() { execCommand('Underline'); });
    addShortcut('Ctrl+D', '취소선', function() { execCommand('Strikeout'); });

    // 글꼴 크기
    addShortcut('Ctrl+]', '글자 크게', function() { execCommand('IncreaseFontSize'); });
    addShortcut('Ctrl+[', '글자 작게', function() { execCommand('DecreaseFontSize'); });

    // 찾기/바꾸기
    addShortcut('Ctrl+F', '찾기', function() { execCommand('Find'); });
    addShortcut('Ctrl+H', '찾아 바꾸기', function() { execCommand('Replace'); });

    // 편집
    addShortcut('Ctrl+Z', '되돌리기', function() { execCommand('Undo'); });
    addShortcut('Ctrl+Shift+Z', '다시 실행', function() { execCommand('Redo'); });
    addShortcut('Ctrl+Y', '다시 실행', function() { execCommand('Redo'); });
    addShortcut('Ctrl+A', '모두 선택', function() { execCommand('SelectAll'); });
    addShortcut('Ctrl+X', '오려 두기', function() { execCommand('Cut'); });
    addShortcut('Ctrl+C', '복사하기', function() { execCommand('Copy'); });
    addShortcut('Ctrl+V', '붙이기', function() { execCommand('Paste'); });

    // 삽입
    addShortcut('Ctrl+K', '하이퍼링크', function() { execCommand('InsertHyperlink'); });
    addShortcut('Ctrl+Enter', '쪽 나누기', function() { execCommand('InsertPageBreak'); });
    addShortcut('Ctrl+Shift+Enter', '단 나누기', function() { execCommand('InsertColumnBreak'); });
    addShortcut('Shift+Enter', '줄 나누기', function() { execCommand('InsertLineBreak'); });

    // 커서 이동
    addShortcut('Home', '줄 처음', function() { execCommand('GoToStartOfLine'); });
    addShortcut('End', '줄 끝', function() { execCommand('GoToEndOfLine'); });
    addShortcut('Ctrl+Home', '문서 처음', function() { execCommand('GoToStartOfDocument'); });
    addShortcut('Ctrl+End', '문서 끝', function() { execCommand('GoToEndOfDocument'); });
    addShortcut('Ctrl+Right', '단어 끝', function() { execCommand('GoToNextWord'); });
    addShortcut('Ctrl+Left', '단어 시작', function() { execCommand('GoToPrevWord'); });
    addShortcut('Ctrl+PageUp', '이전 쪽', function() { execCommand('GoToPrevPage'); });
    addShortcut('Ctrl+PageDown', '다음 쪽', function() { execCommand('GoToNextPage'); });

    // 선택
    addShortcut('Shift+Home', '줄 처음까지 선택', function() { execCommand('SelectToStartOfLine'); });
    addShortcut('Shift+End', '줄 끝까지 선택', function() { execCommand('SelectToEndOfLine'); });
    addShortcut('Ctrl+Shift+Home', '문서 처음까지 선택', function() { execCommand('SelectToStartOfDocument'); });
    addShortcut('Ctrl+Shift+End', '문서 끝까지 선택', function() { execCommand('SelectToEndOfDocument'); });

    // 들여쓰기
    addShortcut('Tab', '들여쓰기', function() { execCommand('IncreaseIndent'); });
    addShortcut('Shift+Tab', '내어쓰기', function() { execCommand('DecreaseIndent'); });

    // 파일
    addShortcut('Ctrl+S', '저장', function() { execCommand('Save'); });
    addShortcut('Ctrl+P', '인쇄', function() { execCommand('Print'); });

    // 확대/축소
    addShortcut('Ctrl+0', '100% 확대', function() { execCommand('Zoom100'); });

    // 스타일
    addShortcut('Ctrl+1', '제목1', function() { execCommand('ApplyHeading1'); });
    addShortcut('Ctrl+2', '제목2', function() { execCommand('ApplyHeading2'); });
    addShortcut('Ctrl+3', '제목3', function() { execCommand('ApplyHeading3'); });

    // 특수문자 삽입
    addShortcut('Ctrl+Alt+-', 'Em Dash', function() { insertText('—'); });
    addShortcut('Ctrl+Alt+.', '줄임표', function() { insertText('…'); });
    addShortcut('Ctrl+Alt+C', '©', function() { insertText('©'); });
    addShortcut('Ctrl+Alt+R', '®', function() { insertText('®'); });
    addShortcut('Ctrl+Alt+T', '™', function() { insertText('™'); });

    // 기타
    addShortcut('F1', '도움말', function() { execCommand('Help'); });
  }

  // ============================================================
  // 스타일별 단축키
  // ============================================================
  function registerStyleShortcuts() {
    if (currentStyle === 'hwp') {
      registerHwpShortcuts();
    } else {
      registerWordShortcuts();
    }
  }

  function reregisterStyleShortcuts() {
    // 기존 스타일별 단축키 제거 후 재등록
    removeStyleShortcuts();
    registerStyleShortcuts();
  }

  // 한글(HWP) 전용 단축키
  function registerHwpShortcuts() {
    // 글꼴 서식 (한글 스타일)
    addShortcut('Alt+Shift+B', '진하게', function() { execCommand('Bold'); }, 'hwp');
    addShortcut('Alt+Shift+I', '기울임', function() { execCommand('Italic'); }, 'hwp');
    addShortcut('Alt+Shift+U', '밑줄', function() { execCommand('Underline'); }, 'hwp');
    addShortcut('Alt+Shift+P', '위첨자', function() { execCommand('Superscript'); }, 'hwp');
    addShortcut('Alt+Shift+S', '아래첨자', function() { execCommand('Subscript'); }, 'hwp');
    addShortcut('Alt+Shift+C', '보통 모양', function() { execCommand('ClearFormatting'); }, 'hwp');
    addShortcut('Alt+Shift+E', '글자 크게', function() { execCommand('IncreaseFontSize'); }, 'hwp');

    // 문단 정렬 (한글 스타일)
    addShortcut('Ctrl+Shift+L', '왼쪽 정렬', function() { execCommand('AlignLeft'); }, 'hwp');
    addShortcut('Ctrl+Shift+M', '양쪽 정렬', function() { execCommand('AlignJustify'); }, 'hwp');

    // 찾기 (한글 스타일)
    addShortcut('F2', '찾기', function() { execCommand('Find'); }, 'hwp');
    addShortcut('Ctrl+F2', '찾아 바꾸기', function() { execCommand('Replace'); }, 'hwp');

    // 삽입 (한글 스타일)
    addShortcut('Ctrl+J', '쪽 나누기', function() { execCommand('InsertPageBreak'); }, 'hwp');
    addShortcut('Ctrl+Alt+E', '수식', function() { execCommand('InsertEquation'); }, 'hwp');

    // 편집 (한글 스타일)
    addShortcut('Shift+Delete', '오려 두기', function() { execCommand('Cut'); }, 'hwp');
    addShortcut('Alt+C', '모양 복사', function() { execCommand('FormatPainter'); }, 'hwp');

    // 파일 (한글 스타일)
    addShortcut('Alt+S', '저장', function() { execCommand('Save'); }, 'hwp');
    addShortcut('Alt+P', '인쇄', function() { execCommand('Print'); }, 'hwp');

    console.log('[BizBell] HWP style shortcuts registered');
  }

  // MS Word 전용 단축키
  function registerWordShortcuts() {
    // 문단 정렬 (Word 스타일)
    addShortcut('Ctrl+L', '왼쪽 정렬', function() { execCommand('AlignLeft'); }, 'word');
    addShortcut('Ctrl+E', '가운데 정렬', function() { execCommand('AlignCenter'); }, 'word');
    addShortcut('Ctrl+R', '오른쪽 정렬', function() { execCommand('AlignRight'); }, 'word');
    addShortcut('Ctrl+J', '양쪽 정렬', function() { execCommand('AlignJustify'); }, 'word');

    // 글꼴 크기 (Word 스타일)
    addShortcut('Ctrl+Shift+>', '글꼴 크기 증가', function() { execCommand('IncreaseFontSize'); }, 'word');
    addShortcut('Ctrl+Shift+<', '글꼴 크기 감소', function() { execCommand('DecreaseFontSize'); }, 'word');

    // 첨자 (Word 스타일)
    addShortcut('Ctrl+=', '아래첨자', function() { execCommand('Subscript'); }, 'word');
    addShortcut('Ctrl+Shift+=', '위첨자', function() { execCommand('Superscript'); }, 'word');

    // 줄 간격 (Word 스타일)
    addShortcut('Ctrl+1', '줄 간격 1', function() { execCommand('LineSpacing1'); }, 'word');
    addShortcut('Ctrl+2', '줄 간격 2', function() { execCommand('LineSpacing2'); }, 'word');
    addShortcut('Ctrl+5', '줄 간격 1.5', function() { execCommand('LineSpacing15'); }, 'word');

    // 스타일 (Word 스타일)
    addShortcut('Ctrl+Shift+N', '기본 스타일', function() { execCommand('ApplyNormalStyle'); }, 'word');
    addShortcut('Ctrl+Alt+1', '제목1', function() { execCommand('ApplyHeading1'); }, 'word');
    addShortcut('Ctrl+Alt+2', '제목2', function() { execCommand('ApplyHeading2'); }, 'word');
    addShortcut('Ctrl+Alt+3', '제목3', function() { execCommand('ApplyHeading3'); }, 'word');

    // 기타 (Word 스타일)
    addShortcut('F7', '맞춤법 검사', function() { execCommand('SpellCheck'); }, 'word');
    addShortcut('Shift+F3', '대/소문자 변환', function() { execCommand('ChangeCase'); }, 'word');

    console.log('[BizBell] MS Word style shortcuts registered');
  }

  // 스타일별 단축키 제거
  var styleShortcutIds = [];
  function removeStyleShortcuts() {
    // 스타일별 단축키 ID 목록을 사용하여 제거
    styleShortcutIds = [];
  }

  // ============================================================
  // 유틸리티 함수
  // ============================================================

  function getShortcutManager() {
    try {
      // OnlyOffice 내부 단축키 매니저 접근 시도
      if (window.Asc && window.Asc.asc_docs_api) {
        return true; // 간단히 존재 여부만 확인
      }
    } catch (e) {}
    return null;
  }

  function addShortcut(keys, description, callback, style) {
    var id = keys + ' (' + description + ')';

    if (style) {
      styleShortcutIds.push(id);
    }

    registeredShortcuts.push(id);

    // 키 조합 파싱
    var keyInfo = parseKeyCombo(keys);

    // 전역 키보드 이벤트 리스너에 추가
    addKeyListener(keyInfo, callback, style);
  }

  function parseKeyCombo(keys) {
    var parts = keys.split('+');
    var result = {
      ctrl: false,
      alt: false,
      shift: false,
      key: '',
      keyCode: 0
    };

    parts.forEach(function(part) {
      part = part.trim();
      switch (part.toLowerCase()) {
        case 'ctrl':
        case 'cmd':
          result.ctrl = true;
          break;
        case 'alt':
          result.alt = true;
          break;
        case 'shift':
          result.shift = true;
          break;
        default:
          result.key = part;
          result.keyCode = getKeyCode(part);
      }
    });

    return result;
  }

  function getKeyCode(key) {
    var keyMap = {
      'a': 65, 'b': 66, 'c': 67, 'd': 68, 'e': 69, 'f': 70, 'g': 71, 'h': 72,
      'i': 73, 'j': 74, 'k': 75, 'l': 76, 'm': 77, 'n': 78, 'o': 79, 'p': 80,
      'q': 81, 'r': 82, 's': 83, 't': 84, 'u': 85, 'v': 86, 'w': 87, 'x': 88,
      'y': 89, 'z': 90,
      '0': 48, '1': 49, '2': 50, '3': 51, '4': 52, '5': 53, '6': 54, '7': 55, '8': 56, '9': 57,
      'f1': 112, 'f2': 113, 'f3': 114, 'f4': 115, 'f5': 116, 'f6': 117,
      'f7': 118, 'f8': 119, 'f9': 120, 'f10': 121, 'f11': 122, 'f12': 123,
      'enter': 13, 'tab': 9, 'escape': 27, 'space': 32, 'backspace': 8, 'delete': 46,
      'home': 36, 'end': 35, 'pageup': 33, 'pagedown': 34,
      'left': 37, 'up': 38, 'right': 39, 'down': 40,
      '[': 219, ']': 221, '-': 189, '=': 187, '.': 190, ',': 188,
      '<': 188, '>': 190
    };
    return keyMap[key.toLowerCase()] || key.charCodeAt(0);
  }

  var keyListeners = [];

  function addKeyListener(keyInfo, callback, style) {
    keyListeners.push({
      keyInfo: keyInfo,
      callback: callback,
      style: style || null
    });
  }

  // 전역 키보드 이벤트 핸들러
  document.addEventListener('keydown', function(e) {
    var handled = false;

    for (var i = 0; i < keyListeners.length; i++) {
      var listener = keyListeners[i];
      var ki = listener.keyInfo;

      // 스타일 체크
      if (listener.style && listener.style !== currentStyle) {
        continue;
      }

      // 키 조합 매칭
      var ctrlMatch = (e.ctrlKey || e.metaKey) === ki.ctrl;
      var altMatch = e.altKey === ki.alt;
      var shiftMatch = e.shiftKey === ki.shift;
      var keyMatch = e.keyCode === ki.keyCode || e.key.toLowerCase() === ki.key.toLowerCase();

      if (ctrlMatch && altMatch && shiftMatch && keyMatch) {
        try {
          listener.callback();
          handled = true;
          e.preventDefault();
          e.stopPropagation();
          break;
        } catch (err) {
          console.error('[BizBell] Shortcut error:', err);
        }
      }
    }

    return !handled;
  }, true);

  function execCommand(command) {
    try {
      var editor = window.Asc && window.Asc.editor;
      if (!editor) {
        console.warn('[BizBell] Editor not found for command:', command);
        return;
      }

      switch (command) {
        // 글꼴 서식
        case 'Bold':
          editor.asc_SetBold && editor.asc_SetBold(!editor.asc_GetBold());
          break;
        case 'Italic':
          editor.asc_SetItalic && editor.asc_SetItalic(!editor.asc_GetItalic());
          break;
        case 'Underline':
          editor.asc_SetUnderline && editor.asc_SetUnderline(!editor.asc_GetUnderline());
          break;
        case 'Strikeout':
          editor.asc_SetStrikeout && editor.asc_SetStrikeout(!editor.asc_GetStrikeout());
          break;
        case 'Superscript':
          editor.asc_SetSuperscript && editor.asc_SetSuperscript(!editor.asc_GetSuperscript());
          break;
        case 'Subscript':
          editor.asc_SetSubscript && editor.asc_SetSubscript(!editor.asc_GetSubscript());
          break;
        case 'ClearFormatting':
          editor.asc_ClearFormatting && editor.asc_ClearFormatting();
          break;

        // 글꼴 크기
        case 'IncreaseFontSize':
          editor.asc_incDecFontSize && editor.asc_incDecFontSize(true);
          break;
        case 'DecreaseFontSize':
          editor.asc_incDecFontSize && editor.asc_incDecFontSize(false);
          break;

        // 문단 정렬
        case 'AlignLeft':
          editor.asc_SetParagraphAlign && editor.asc_SetParagraphAlign(1);
          break;
        case 'AlignCenter':
          editor.asc_SetParagraphAlign && editor.asc_SetParagraphAlign(2);
          break;
        case 'AlignRight':
          editor.asc_SetParagraphAlign && editor.asc_SetParagraphAlign(0);
          break;
        case 'AlignJustify':
          editor.asc_SetParagraphAlign && editor.asc_SetParagraphAlign(3);
          break;

        // 찾기/바꾸기
        case 'Find':
          triggerMenuAction('search');
          break;
        case 'Replace':
          triggerMenuAction('replace');
          break;

        // 삽입
        case 'InsertPageBreak':
          editor.asc_AddPageBreak && editor.asc_AddPageBreak();
          break;
        case 'InsertColumnBreak':
          editor.asc_AddColumnBreak && editor.asc_AddColumnBreak();
          break;
        case 'InsertLineBreak':
          editor.asc_AddLineBreak && editor.asc_AddLineBreak();
          break;
        case 'InsertHyperlink':
          triggerMenuAction('hyperlink');
          break;
        case 'InsertEquation':
          editor.asc_AddMath && editor.asc_AddMath();
          break;

        // 편집
        case 'Undo':
          editor.asc_Undo && editor.asc_Undo();
          break;
        case 'Redo':
          editor.asc_Redo && editor.asc_Redo();
          break;
        case 'SelectAll':
          editor.asc_SelectAll && editor.asc_SelectAll();
          break;
        case 'Cut':
          editor.asc_Cut && editor.asc_Cut();
          break;
        case 'Copy':
          editor.asc_Copy && editor.asc_Copy();
          break;
        case 'Paste':
          editor.asc_Paste && editor.asc_Paste();
          break;
        case 'FormatPainter':
          triggerMenuAction('format-painter');
          break;

        // 파일
        case 'Save':
          editor.asc_Save && editor.asc_Save();
          break;
        case 'Print':
          editor.asc_Print && editor.asc_Print();
          break;

        // 스타일
        case 'ApplyHeading1':
          editor.asc_SetParagraphStyle && editor.asc_SetParagraphStyle('Heading 1');
          break;
        case 'ApplyHeading2':
          editor.asc_SetParagraphStyle && editor.asc_SetParagraphStyle('Heading 2');
          break;
        case 'ApplyHeading3':
          editor.asc_SetParagraphStyle && editor.asc_SetParagraphStyle('Heading 3');
          break;
        case 'ApplyNormalStyle':
          editor.asc_SetParagraphStyle && editor.asc_SetParagraphStyle('Normal');
          break;

        // 줄 간격
        case 'LineSpacing1':
          editor.asc_SetParagraphSpacing && editor.asc_SetParagraphSpacing({ LineRule: 1, Line: 1 });
          break;
        case 'LineSpacing15':
          editor.asc_SetParagraphSpacing && editor.asc_SetParagraphSpacing({ LineRule: 1, Line: 1.5 });
          break;
        case 'LineSpacing2':
          editor.asc_SetParagraphSpacing && editor.asc_SetParagraphSpacing({ LineRule: 1, Line: 2 });
          break;

        // 기타
        case 'Help':
          triggerMenuAction('help');
          break;
        case 'SpellCheck':
          triggerMenuAction('spellcheck');
          break;
        case 'Zoom100':
          editor.asc_setZoom && editor.asc_setZoom(100);
          break;

        default:
          console.log('[BizBell] Unknown command:', command);
      }
    } catch (err) {
      console.error('[BizBell] Error executing command:', command, err);
    }
  }

  function insertText(text) {
    try {
      var editor = window.Asc && window.Asc.editor;
      if (editor && editor.asc_AddText) {
        editor.asc_AddText(text);
      }
    } catch (err) {
      console.error('[BizBell] Error inserting text:', err);
    }
  }

  function triggerMenuAction(action) {
    // 메뉴 액션 트리거 시도
    try {
      var menuItem = document.querySelector('[data-action="' + action + '"]') ||
                     document.getElementById('menu-' + action);
      if (menuItem) {
        menuItem.click();
      }
    } catch (err) {
      console.warn('[BizBell] Could not trigger menu action:', action);
    }
  }

  function registerFallbackShortcuts() {
    console.log('[BizBell] Using fallback shortcut registration');
    // 기본 키보드 이벤트만 사용
  }

  // changeShortcutStyle 함수를 외부에서 접근 가능하도록 저장
  var _changeShortcutStyle = null;

  // 외부에서 현재 스타일 확인용
  window.BizBellShortcuts = {
    getStyle: function() { return currentStyle; },
    setStyle: function(style) {
      if (_changeShortcutStyle && (style === 'hwp' || style === 'word')) {
        _changeShortcutStyle(style);
      }
    },
    getRegisteredShortcuts: function() { return registeredShortcuts.slice(); }
  };

})();
