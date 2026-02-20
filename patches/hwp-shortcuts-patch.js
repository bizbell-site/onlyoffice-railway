/**
 * HWP/Word Keyboard Shortcuts Patch for OnlyOffice
 *
 * OnlyOffice 네이티브 단축키는 건드리지 않습니다.
 * HWP 또는 MS Word 스타일의 "추가" 단축키만 등록합니다.
 *
 * 핵심 원칙:
 * - OnlyOffice 기본 단축키(Ctrl+Z/C/V/B/I/U 등)는 절대 재등록하지 않음
 * - stopPropagation() 사용 시 OnlyOffice 내부 핸들러가 차단되므로 주의
 * - Ctrl+C/V/X는 브라우저 clipboard 이벤트로 처리되므로 keydown에서 가로채지 않음
 * - 에디터 인스턴스는 window.editor (window.Asc.editor 아님)
 */

(function() {
  'use strict';

  // localStorage 키
  var SHORTCUT_STYLE_KEY = 'bizbell-shortcut-style';

  // 현재 스타일 (기본값: hwp)
  var currentStyle = 'hwp';

  // 등록된 단축키 목록 (로깅용)
  var registeredShortcuts = [];

  // 스타일별 단축키 ID 목록
  var styleShortcutIds = [];

  // 키 리스너 목록
  var keyListeners = [];

  // 스타일 변경 함수 참조
  var _changeShortcutStyle = null;

  // 허용된 origin 목록 (postMessage 보안)
  var allowedOrigins = [];

  // OnlyOffice API가 로드될 때까지 대기
  var checkInterval = setInterval(function() {
    if (typeof window.Asc !== 'undefined' && window.Asc.asc_docs_api) {
      clearInterval(checkInterval);
      setTimeout(initShortcuts, 500);
    }
  }, 100);

  // 타임아웃 (15초)
  setTimeout(function() {
    clearInterval(checkInterval);
  }, 15000);

  function initShortcuts() {
    console.log('[BizBell] Initializing keyboard shortcuts...');

    // 허용된 origin 설정
    allowedOrigins = [window.location.origin];
    try {
      if (window.parent && window.parent !== window && document.referrer) {
        var referrerOrigin = new URL(document.referrer).origin;
        if (allowedOrigins.indexOf(referrerOrigin) === -1) {
          allowedOrigins.push(referrerOrigin);
        }
      }
    } catch (e) {}

    // localStorage에서 스타일 로드
    try {
      var saved = localStorage.getItem(SHORTCUT_STYLE_KEY);
      if (saved === 'hwp' || saved === 'word') {
        currentStyle = saved;
      }
    } catch (e) {}

    // 스타일 변경 이벤트 리스너
    window.addEventListener('shortcut-style-change', function(e) {
      if (e.detail && (e.detail.style === 'hwp' || e.detail.style === 'word')) {
        changeShortcutStyle(e.detail.style);
      }
    });

    // postMessage 리스너 (origin 검증)
    window.addEventListener('message', function(e) {
      if (allowedOrigins.indexOf(e.origin) === -1) return;
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
      try { localStorage.setItem(SHORTCUT_STYLE_KEY, newStyle); } catch (e) {}
      console.log('[BizBell] Shortcut style changed:', oldStyle, '->', currentStyle);
    }

    _changeShortcutStyle = changeShortcutStyle;

    // HWP/Word 스타일 전용 단축키만 등록
    // OnlyOffice 네이티브 단축키(Ctrl+Z/C/V/B/I/U/X/Y/A/S/P/F/H 등)는 등록하지 않음
    registerStyleShortcuts();

    // 키보드 이벤트 핸들러 등록
    // 중요: capture=false, stopPropagation 미사용 → OnlyOffice 네이티브 핸들러 보존
    document.addEventListener('keydown', handleKeyDown, false);

    console.log('[BizBell] Shortcuts initialized (' + registeredShortcuts.length + '):', registeredShortcuts.join(', '));
    console.log('[BizBell] Current style:', currentStyle);
    console.log('[BizBell] Note: OnlyOffice native shortcuts (Ctrl+Z/C/V/B/I/U etc.) are preserved');
  }

  // ============================================================
  // 스타일별 단축키 (OnlyOffice가 기본 지원하지 않는 것만)
  // ============================================================
  function registerStyleShortcuts() {
    // --- HWP 전용 단축키 ---

    // 글꼴 서식 (한글 스타일 - Alt+Shift 조합)
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

    // --- MS Word 전용 단축키 ---

    // 줄 간격 (Word 스타일 - OnlyOffice 기본 미지원)
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
  }

  // ============================================================
  // 키보드 이벤트 처리
  // ============================================================
  function handleKeyDown(e) {
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

      // e.code 우선, 폴백으로 e.key
      var codeMatch = ki.code && e.code === ki.code;
      var keyMatch = !codeMatch && e.key && e.key.toLowerCase() === ki.key.toLowerCase();

      if (ctrlMatch && altMatch && shiftMatch && (codeMatch || keyMatch)) {
        try {
          listener.callback();
          e.preventDefault();
          // 주의: stopPropagation()을 호출하지 않음
          // OnlyOffice 네이티브 핸들러를 차단하면 안 됨
        } catch (err) {
          console.error('[BizBell] Shortcut error:', err);
        }
        return;
      }
    }
  }

  // ============================================================
  // 유틸리티 함수
  // ============================================================
  function addShortcut(keys, description, callback, style) {
    var id = keys + ' (' + description + ')';
    if (style) {
      styleShortcutIds.push(id);
    }
    registeredShortcuts.push(id);

    var keyInfo = parseKeyCombo(keys);
    keyListeners.push({
      keyInfo: keyInfo,
      callback: callback,
      style: style || null
    });
  }

  function parseKeyCombo(keys) {
    var parts = keys.split('+');
    var result = {
      ctrl: false,
      alt: false,
      shift: false,
      key: '',
      code: ''
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
          result.code = getKeyCode(part);
      }
    });

    return result;
  }

  function getKeyCode(key) {
    // e.code 값 매핑 (키보드 레이아웃 독립적)
    var codeMap = {
      'a': 'KeyA', 'b': 'KeyB', 'c': 'KeyC', 'd': 'KeyD', 'e': 'KeyE',
      'f': 'KeyF', 'g': 'KeyG', 'h': 'KeyH', 'i': 'KeyI', 'j': 'KeyJ',
      'k': 'KeyK', 'l': 'KeyL', 'm': 'KeyM', 'n': 'KeyN', 'o': 'KeyO',
      'p': 'KeyP', 'q': 'KeyQ', 'r': 'KeyR', 's': 'KeyS', 't': 'KeyT',
      'u': 'KeyU', 'v': 'KeyV', 'w': 'KeyW', 'x': 'KeyX', 'y': 'KeyY',
      'z': 'KeyZ',
      '0': 'Digit0', '1': 'Digit1', '2': 'Digit2', '3': 'Digit3', '4': 'Digit4',
      '5': 'Digit5', '6': 'Digit6', '7': 'Digit7', '8': 'Digit8', '9': 'Digit9',
      'f1': 'F1', 'f2': 'F2', 'f3': 'F3', 'f4': 'F4', 'f5': 'F5', 'f6': 'F6',
      'f7': 'F7', 'f8': 'F8', 'f9': 'F9', 'f10': 'F10', 'f11': 'F11', 'f12': 'F12',
      'enter': 'Enter', 'tab': 'Tab', 'escape': 'Escape', 'space': 'Space',
      'backspace': 'Backspace', 'delete': 'Delete',
      'home': 'Home', 'end': 'End', 'pageup': 'PageUp', 'pagedown': 'PageDown',
      'left': 'ArrowLeft', 'up': 'ArrowUp', 'right': 'ArrowRight', 'down': 'ArrowDown',
      '[': 'BracketLeft', ']': 'BracketRight',
      '-': 'Minus', '=': 'Equal',
      '.': 'Period', ',': 'Comma',
      '<': 'Comma', '>': 'Period'
    };
    return codeMap[key.toLowerCase()] || '';
  }

  function getEditor() {
    // OnlyOffice의 올바른 에디터 인스턴스
    return window.editor || (window.Asc && window.Asc.editor) || null;
  }

  function execCommand(command) {
    try {
      var editor = getEditor();
      if (!editor) {
        console.warn('[BizBell] Editor not found for command:', command);
        return;
      }

      switch (command) {
        // 글꼴 서식
        case 'Bold':
          if (editor.put_TextPrBold) {
            var isBold = editor.get_TextProps && editor.get_TextProps();
            editor.put_TextPrBold(isBold ? !isBold.get_Bold() : true);
          } else if (editor.asc_SetBold) {
            editor.asc_SetBold(!editor.asc_GetBold());
          }
          break;
        case 'Italic':
          if (editor.put_TextPrItalic) {
            var isItalic = editor.get_TextProps && editor.get_TextProps();
            editor.put_TextPrItalic(isItalic ? !isItalic.get_Italic() : true);
          } else if (editor.asc_SetItalic) {
            editor.asc_SetItalic(!editor.asc_GetItalic());
          }
          break;
        case 'Underline':
          if (editor.put_TextPrUnderline) {
            var isUnderline = editor.get_TextProps && editor.get_TextProps();
            editor.put_TextPrUnderline(isUnderline ? !isUnderline.get_Underline() : true);
          } else if (editor.asc_SetUnderline) {
            editor.asc_SetUnderline(!editor.asc_GetUnderline());
          }
          break;
        case 'Superscript':
          if (editor.put_TextPrBaseline) {
            editor.put_TextPrBaseline(1); // Superscript
          } else if (editor.asc_SetSuperscript) {
            editor.asc_SetSuperscript(!editor.asc_GetSuperscript());
          }
          break;
        case 'Subscript':
          if (editor.put_TextPrBaseline) {
            editor.put_TextPrBaseline(2); // Subscript
          } else if (editor.asc_SetSubscript) {
            editor.asc_SetSubscript(!editor.asc_GetSubscript());
          }
          break;
        case 'ClearFormatting':
          if (editor.ClearFormatting) {
            editor.ClearFormatting();
          }
          break;

        // 글꼴 크기
        case 'IncreaseFontSize':
          if (editor.FontSizeIn) {
            editor.FontSizeIn();
          } else if (editor.asc_incDecFontSize) {
            editor.asc_incDecFontSize(true);
          }
          break;
        case 'DecreaseFontSize':
          if (editor.FontSizeOut) {
            editor.FontSizeOut();
          } else if (editor.asc_incDecFontSize) {
            editor.asc_incDecFontSize(false);
          }
          break;

        // 문단 정렬
        case 'AlignLeft':
          if (editor.put_PrAlign) {
            editor.put_PrAlign(1);
          } else if (editor.asc_SetParagraphAlign) {
            editor.asc_SetParagraphAlign(1);
          }
          break;
        case 'AlignCenter':
          if (editor.put_PrAlign) {
            editor.put_PrAlign(2);
          } else if (editor.asc_SetParagraphAlign) {
            editor.asc_SetParagraphAlign(2);
          }
          break;
        case 'AlignRight':
          if (editor.put_PrAlign) {
            editor.put_PrAlign(0);
          } else if (editor.asc_SetParagraphAlign) {
            editor.asc_SetParagraphAlign(0);
          }
          break;
        case 'AlignJustify':
          if (editor.put_PrAlign) {
            editor.put_PrAlign(3);
          } else if (editor.asc_SetParagraphAlign) {
            editor.asc_SetParagraphAlign(3);
          }
          break;

        // 찾기/바꾸기
        case 'Find':
          if (editor.asc_searchEnabled) {
            editor.asc_searchEnabled(true);
          }
          break;
        case 'Replace':
          if (editor.asc_replaceEnabled) {
            editor.asc_replaceEnabled(true);
          }
          break;

        // 삽입
        case 'InsertPageBreak':
          if (editor.asc_AddPageBreak) {
            editor.asc_AddPageBreak();
          }
          break;
        case 'InsertEquation':
          if (editor.asc_AddMath) {
            editor.asc_AddMath();
          }
          break;

        // 편집
        case 'Cut':
          if (AscCommon && AscCommon.g_clipboardBase && AscCommon.g_clipboardBase.Button_Cut) {
            AscCommon.g_clipboardBase.Button_Cut();
          }
          break;
        case 'FormatPainter':
          if (editor.asc_FormatPainter) {
            editor.asc_FormatPainter();
          }
          break;

        // 파일
        case 'Save':
          if (editor.asc_Save) {
            editor.asc_Save();
          }
          break;
        case 'Print':
          if (editor.asc_Print) {
            editor.asc_Print();
          }
          break;

        // 스타일
        case 'ApplyHeading1':
          if (editor.asc_SetParagraphStyle) {
            editor.asc_SetParagraphStyle('Heading 1');
          }
          break;
        case 'ApplyHeading2':
          if (editor.asc_SetParagraphStyle) {
            editor.asc_SetParagraphStyle('Heading 2');
          }
          break;
        case 'ApplyHeading3':
          if (editor.asc_SetParagraphStyle) {
            editor.asc_SetParagraphStyle('Heading 3');
          }
          break;
        case 'ApplyNormalStyle':
          if (editor.asc_SetParagraphStyle) {
            editor.asc_SetParagraphStyle('Normal');
          }
          break;

        // 줄 간격
        case 'LineSpacing1':
          if (editor.asc_SetParagraphSpacing) {
            editor.asc_SetParagraphSpacing({ LineRule: 1, Line: 1 });
          }
          break;
        case 'LineSpacing15':
          if (editor.asc_SetParagraphSpacing) {
            editor.asc_SetParagraphSpacing({ LineRule: 1, Line: 1.5 });
          }
          break;
        case 'LineSpacing2':
          if (editor.asc_SetParagraphSpacing) {
            editor.asc_SetParagraphSpacing({ LineRule: 1, Line: 2 });
          }
          break;

        // 기타
        case 'SpellCheck':
          // OnlyOffice 내장 맞춤법 검사 사용
          break;
        case 'ChangeCase':
          // OnlyOffice 내장 대소문자 변환 사용
          break;

        default:
          console.log('[BizBell] Unknown command:', command);
      }
    } catch (err) {
      console.error('[BizBell] Error executing command:', command, err);
    }
  }

  // 외부 API
  window.BizBellShortcuts = {
    getStyle: function() { return currentStyle; },
    setStyle: function(style) {
      if (_changeShortcutStyle && (style === 'hwp' || style === 'word')) {
        _changeShortcutStyle(style);
      }
    },
    getRegisteredShortcuts: function() { return registeredShortcuts.slice(); },
    getAllowedOrigins: function() { return allowedOrigins.slice(); }
  };

})();
