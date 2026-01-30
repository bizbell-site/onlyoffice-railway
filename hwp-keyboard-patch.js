/**
 * HWP Keyboard Shortcuts Patch for OnlyOffice
 *
 * 한글(HWP) 스타일 단축키를 OnlyOffice Document Editor에 추가합니다.
 *
 * 지원 단축키:
 * - Alt+L: 글자 모양 (Font Dialog)
 * - Alt+T: 문단 모양 (Paragraph Dialog)
 * - Ctrl+N, T: 표 삽입 (Insert Table)
 * - Ctrl+N, I: 그림 삽입 (Insert Image)
 * - Ctrl+N, E: 수식 삽입 (Insert Equation)
 * - Ctrl+N, P: 쪽 번호 (Page Number)
 * - Ctrl+F10: 특수문자 (Insert Symbol)
 */

(function() {
  'use strict';

  // OnlyOffice API가 로드될 때까지 대기
  var checkInterval = setInterval(function() {
    if (typeof window.Asc !== 'undefined' &&
        window.Asc.editor) {
      clearInterval(checkInterval);
      initHwpShortcuts();
    }
  }, 100);

  // 타임아웃 (10초)
  setTimeout(function() {
    clearInterval(checkInterval);
  }, 10000);

  function initHwpShortcuts() {
    console.log('[HWP Shortcuts] Initializing...');

    // 순차 키 입력 상태
    var waitingForSecondKey = false;
    var firstKeyTime = 0;
    var SEQUENCE_TIMEOUT = 1000; // 1초

    // 키보드 이벤트 핸들러
    document.addEventListener('keydown', function(e) {
      var handled = handleHwpShortcut(e);
      if (handled) {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        return false;
      }
    }, true);

    function handleHwpShortcut(e) {
      var keyCode = e.keyCode || e.which;
      var isCtrl = e.ctrlKey || e.metaKey;
      var isAlt = e.altKey;
      var isShift = e.shiftKey;
      var now = Date.now();

      // Ctrl+N 후 다음 키 대기
      if (isCtrl && !isAlt && !isShift && keyCode === 78) { // N
        waitingForSecondKey = true;
        firstKeyTime = now;
        return true;
      }

      // 순차 키 입력 처리 (Ctrl+N 이후)
      if (waitingForSecondKey && (now - firstKeyTime) < SEQUENCE_TIMEOUT) {
        waitingForSecondKey = false;

        switch (keyCode) {
          case 84: // T - 표 삽입
            triggerMenuAction('table');
            return true;
          case 73: // I - 그림 삽입
            triggerMenuAction('image');
            return true;
          case 69: // E - 수식 삽입
            triggerMenuAction('equation');
            return true;
          case 80: // P - 쪽 번호
            triggerMenuAction('pagenumber');
            return true;
        }
      }

      waitingForSecondKey = false;

      // Alt+L: 글자 모양 (Font Dialog)
      if (isAlt && !isCtrl && !isShift && keyCode === 76) {
        triggerMenuAction('font');
        return true;
      }

      // Alt+T: 문단 모양 (Paragraph Dialog)
      if (isAlt && !isCtrl && !isShift && keyCode === 84) {
        triggerMenuAction('paragraph');
        return true;
      }

      // Ctrl+F10: 특수문자 (Insert Symbol)
      if (isCtrl && !isAlt && !isShift && keyCode === 121) {
        triggerMenuAction('symbol');
        return true;
      }

      return false;
    }

    function triggerMenuAction(action) {
      console.log('[HWP Shortcuts] Action:', action);

      var editor = window.Asc.editor;
      if (!editor) return;

      try {
        switch (action) {
          case 'font':
            // 폰트 다이얼로그 열기
            if (editor.asc_setFontSize) {
              // 현재 선택 영역에 대한 폰트 설정 다이얼로그
              var common = window.Common;
              if (common && common.NotificationCenter) {
                common.NotificationCenter.trigger('edit:complete', editor);
                common.NotificationCenter.trigger('fonts:show');
              }
            }
            clickToolbarButton('id-toolbar-btn-fontcolor') ||
            clickMenuItem('menu-item-text');
            break;

          case 'paragraph':
            // 문단 설정 다이얼로그
            clickMenuItem('menu-item-paragraph') ||
            clickToolbarButton('id-toolbar-btn-linespacing');
            break;

          case 'table':
            // 표 삽입
            if (editor.asc_addTableLine) {
              editor.asc_addTableLine(3, 3);
            } else {
              clickMenuItem('menu-item-insert-table') ||
              clickToolbarButton('tlbtn-inserttable');
            }
            break;

          case 'image':
            // 이미지 삽입
            clickMenuItem('menu-item-insert-image') ||
            clickToolbarButton('tlbtn-insertimage');
            break;

          case 'equation':
            // 수식 삽입
            if (editor.asc_AddMath) {
              editor.asc_AddMath();
            } else {
              clickMenuItem('menu-item-insert-equation') ||
              clickToolbarButton('tlbtn-insertequation');
            }
            break;

          case 'pagenumber':
            // 페이지 번호 삽입
            clickMenuItem('menu-item-insert-page-number') ||
            clickToolbarButton('id-toolbar-btn-insertpagenumber');
            break;

          case 'symbol':
            // 특수문자 삽입
            clickMenuItem('menu-item-insert-symbol') ||
            clickToolbarButton('tlbtn-insertsymbol');
            break;
        }
      } catch (err) {
        console.error('[HWP Shortcuts] Error:', err);
      }
    }

    function clickMenuItem(id) {
      var el = document.getElementById(id);
      if (el) {
        el.click();
        return true;
      }
      // 클래스로 찾기
      el = document.querySelector('[data-value="' + id.replace('menu-item-', '') + '"]');
      if (el) {
        el.click();
        return true;
      }
      return false;
    }

    function clickToolbarButton(id) {
      var el = document.getElementById(id);
      if (el) {
        el.click();
        return true;
      }
      // 클래스로 찾기
      el = document.querySelector('.' + id);
      if (el) {
        el.click();
        return true;
      }
      return false;
    }

    console.log('[HWP Shortcuts] Initialized');
    console.log('  Alt+L: Font Dialog');
    console.log('  Alt+T: Paragraph Dialog');
    console.log('  Ctrl+N,T: Insert Table');
    console.log('  Ctrl+N,I: Insert Image');
    console.log('  Ctrl+N,E: Insert Equation');
    console.log('  Ctrl+F10: Insert Symbol');
  }
})();
