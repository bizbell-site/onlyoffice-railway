/**
 * HWP (한글) 스타일 단축키 - BizBell Custom
 *
 * 지원 단축키:
 * - Alt+L: 글자 모양 (Font Dialog)
 * - Alt+T: 문단 모양 (Paragraph Dialog)
 * - Ctrl+F10: 특수문자 (Insert Symbol)
 *
 * OnlyOffice Document Editor에서 로드됩니다.
 */
(function() {
  'use strict';

  var HWP_SHORTCUTS_VERSION = '1.0.0';
  var DEBUG = false;

  function log() {
    if (DEBUG) {
      console.log.apply(console, ['[HWP Shortcuts]'].concat(Array.prototype.slice.call(arguments)));
    }
  }

  function info() {
    console.log.apply(console, ['[HWP Shortcuts]'].concat(Array.prototype.slice.call(arguments)));
  }

  /**
   * OnlyOffice API가 준비되었을 때 단축키 등록
   */
  function registerShortcuts() {
    // Asc 객체 확인
    if (typeof Asc === 'undefined') {
      log('Asc not available, retrying...');
      setTimeout(registerShortcuts, 500);
      return;
    }

    var shortcutTypes = Asc.c_oAscDocumentShortcutType;
    var defaultShortcuts = Asc.c_oAscDefaultShortcuts;

    if (!shortcutTypes || !defaultShortcuts) {
      log('Shortcut types not available, retrying...');
      setTimeout(registerShortcuts, 500);
      return;
    }

    if (typeof AscCommon === 'undefined' || typeof AscCommon.AscShortcut === 'undefined') {
      log('AscCommon.AscShortcut not available, retrying...');
      setTimeout(registerShortcuts, 500);
      return;
    }

    info('Registering HWP shortcuts v' + HWP_SHORTCUTS_VERSION);

    // 단축키 추가 헬퍼 함수
    function addShortcut(type, keyCode, ctrl, shift, alt, meta) {
      if (type === undefined) {
        log('Shortcut type undefined, skipping');
        return false;
      }

      var shortcut = new AscCommon.AscShortcut(type, keyCode, ctrl, shift, alt, meta);

      if (Array.isArray(defaultShortcuts[type])) {
        defaultShortcuts[type].push(shortcut);
      } else if (defaultShortcuts[type]) {
        defaultShortcuts[type] = [defaultShortcuts[type], shortcut];
      } else {
        defaultShortcuts[type] = shortcut;
      }

      return true;
    }

    // Alt+L: 글자 모양 (Font Dialog)
    // keyCode 76 = 'L', ctrl=false, shift=false, alt=true, meta=false
    if (addShortcut(shortcutTypes.FontPanelOpen, 76, false, false, true, false)) {
      info('Alt+L -> Font Dialog');
    }

    // Alt+T: 문단 모양 (Paragraph Dialog)
    // keyCode 84 = 'T', ctrl=false, shift=false, alt=true, meta=false
    if (addShortcut(shortcutTypes.ParagraphPanelOpen, 84, false, false, true, false)) {
      info('Alt+T -> Paragraph Dialog');
    }

    // Ctrl+F10: 특수문자 (Insert Symbol)
    // keyCode 121 = F10, ctrl=true, shift=false, alt=false, meta=false
    if (shortcutTypes.InsertSymbol !== undefined) {
      if (addShortcut(shortcutTypes.InsertSymbol, 121, true, false, false, false)) {
        info('Ctrl+F10 -> Insert Symbol');
      }
    } else {
      log('InsertSymbol shortcut type not available');
    }

    info('HWP shortcuts registered successfully');
  }

  // DOM이 준비되면 실행
  if (document.readyState === 'complete' || document.readyState === 'interactive') {
    setTimeout(registerShortcuts, 100);
  } else {
    document.addEventListener('DOMContentLoaded', function() {
      setTimeout(registerShortcuts, 100);
    });
  }

  // window load 이벤트에서도 실행 (백업)
  window.addEventListener('load', function() {
    setTimeout(registerShortcuts, 500);
  });

})();
