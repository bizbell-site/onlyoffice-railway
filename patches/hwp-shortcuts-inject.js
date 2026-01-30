/**
 * HWP 스타일 단축키 - 런타임 주입 버전
 * BizBell Custom
 */
(function() {
  'use strict';

  var MAX_ATTEMPTS = 300; // 30초 대기
  var CHECK_INTERVAL = 100; // 100ms마다 체크

  function registerHwpShortcuts() {
    try {
      var Asc = window.Asc;
      var AscCommon = window.AscCommon;

      if (!Asc || !AscCommon) {
        return false;
      }

      var t = Asc.c_oAscDocumentShortcutType;
      var d = Asc.c_oAscDefaultShortcuts;

      if (!t || !d || !AscCommon.AscShortcut) {
        return false;
      }

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

        try {
          var shortcut = new AscCommon.AscShortcut(type, keyCode, ctrl, shift, alt, cmd);

          if (!d[type]) {
            d[type] = shortcut;
          } else if (Array.isArray(d[type])) {
            var exists = d[type].some(function(s) {
              return s && s.keyCode === keyCode && s.ctrl === ctrl && s.shift === shift && s.alt === alt;
            });
            if (!exists) {
              d[type].push(shortcut);
            }
          } else {
            var existing = d[type];
            if (!(existing && existing.keyCode === keyCode && existing.ctrl === ctrl && existing.shift === shift && existing.alt === alt)) {
              d[type] = [d[type], shortcut];
            }
          }
          return true;
        } catch (e) {
          return false;
        }
      }

      var registered = [];

      // Alt+L: 글자 모양 (Font Dialog)
      if (t.OpenFontDialog !== undefined && addShortcut(t.OpenFontDialog, keyCodes.KeyL, false, false, true, false)) {
        registered.push('Alt+L');
      }

      // Alt+T: 문단 모양 (Paragraph Dialog)
      if (t.OpenParagraphDialog !== undefined && addShortcut(t.OpenParagraphDialog, keyCodes.KeyT, false, false, true, false)) {
        registered.push('Alt+T');
      }

      // Ctrl+F10: 특수문자 (Insert Symbol)
      if (t.InsertSymbol !== undefined && addShortcut(t.InsertSymbol, keyCodes.F10, true, false, false, false)) {
        registered.push('Ctrl+F10');
      }

      // F7: 편집 용지 설정 (Page Setup)
      if (t.OpenPageSetup !== undefined && addShortcut(t.OpenPageSetup, keyCodes.F7, false, false, false, false)) {
        registered.push('F7');
      }

      if (registered.length > 0) {
        console.log('[BizBell] HWP shortcuts OK: ' + registered.join(', '));
        return true;
      }

      return false;
    } catch (e) {
      console.error('[BizBell] Error:', e);
      return false;
    }
  }

  function waitAndRegister() {
    var attempts = 0;

    function tryRegister() {
      attempts++;

      if (registerHwpShortcuts()) {
        return; // 성공
      }

      if (attempts < MAX_ATTEMPTS) {
        setTimeout(tryRegister, CHECK_INTERVAL);
      }
    }

    tryRegister();
  }

  // 여러 시점에서 시도
  if (document.readyState === 'complete') {
    waitAndRegister();
  } else {
    window.addEventListener('load', waitAndRegister);
  }

  // 추가 시도 (에디터 초기화 후)
  setTimeout(waitAndRegister, 2000);
  setTimeout(waitAndRegister, 5000);
  setTimeout(waitAndRegister, 10000);

})();
