/**
 * HWP 스타일 단축키 - 런타임 주입 버전
 * BizBell Custom
 *
 * 이 스크립트는 OnlyOffice Document Editor의 index.html에 주입되어
 * 에디터 로드 후 단축키를 등록합니다.
 */
(function() {
  'use strict';

  // 에디터가 준비될 때까지 대기
  function waitForEditor(callback, maxAttempts) {
    var attempts = 0;
    var maxTries = maxAttempts || 100;

    function check() {
      attempts++;

      // Asc 객체와 단축키 시스템이 로드되었는지 확인
      if (typeof Asc !== 'undefined' &&
          Asc.c_oAscDocumentShortcutType &&
          Asc.c_oAscDefaultShortcuts &&
          typeof AscCommon !== 'undefined' &&
          AscCommon.AscShortcut) {
        callback();
        return;
      }

      if (attempts < maxTries) {
        setTimeout(check, 100);
      } else {
        console.warn('[BizBell] Editor not ready after ' + maxTries + ' attempts');
      }
    }

    check();
  }

  function registerHwpShortcuts() {
    try {
      var t = Asc.c_oAscDocumentShortcutType;
      var d = Asc.c_oAscDefaultShortcuts;

      // 키코드
      var keyCodes = {
        KeyL: 76,
        KeyT: 84,
        F10: 121,
        F7: 118
      };

      function addShortcut(type, keyCode, ctrl, shift, alt, cmd) {
        if (type === undefined || type === null) {
          return false;
        }

        var shortcut = new AscCommon.AscShortcut(type, keyCode, ctrl, shift, alt, cmd);

        if (!d[type]) {
          d[type] = shortcut;
        } else if (Array.isArray(d[type])) {
          // 중복 확인
          var exists = d[type].some(function(s) {
            return s.keyCode === keyCode && s.ctrl === ctrl && s.shift === shift && s.alt === alt;
          });
          if (!exists) {
            d[type].push(shortcut);
          }
        } else {
          // 중복 확인
          var existing = d[type];
          if (!(existing.keyCode === keyCode && existing.ctrl === ctrl && existing.shift === shift && existing.alt === alt)) {
            d[type] = [d[type], shortcut];
          }
        }

        return true;
      }

      var registered = [];

      // Alt+L: 글자 모양 (Font Dialog)
      if (addShortcut(t.OpenFontDialog, keyCodes.KeyL, false, false, true, false)) {
        registered.push('Alt+L (글자 모양)');
      }

      // Alt+T: 문단 모양 (Paragraph Dialog)
      if (addShortcut(t.OpenParagraphDialog, keyCodes.KeyT, false, false, true, false)) {
        registered.push('Alt+T (문단 모양)');
      }

      // Ctrl+F10: 특수문자 (Insert Symbol)
      if (addShortcut(t.InsertSymbol, keyCodes.F10, true, false, false, false)) {
        registered.push('Ctrl+F10 (특수문자)');
      }

      // F7: 편집 용지 설정 (Page Setup) - 있는 경우만
      if (t.OpenPageSetup !== undefined) {
        if (addShortcut(t.OpenPageSetup, keyCodes.F7, false, false, false, false)) {
          registered.push('F7 (페이지 설정)');
        }
      }

      if (registered.length > 0) {
        console.log('[BizBell] HWP shortcuts registered: ' + registered.join(', '));
      }

    } catch (e) {
      console.error('[BizBell] Failed to register HWP shortcuts:', e);
    }
  }

  // DOM 로드 후 실행
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
      waitForEditor(registerHwpShortcuts);
    });
  } else {
    waitForEditor(registerHwpShortcuts);
  }

  // 추가로 window load 이벤트에서도 시도
  window.addEventListener('load', function() {
    setTimeout(function() {
      waitForEditor(registerHwpShortcuts, 50);
    }, 1000);
  });

})();
