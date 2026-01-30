
// ============================================
// HWP (한글) 스타일 단축키 - BizBell Custom
// ============================================
(function() {
  if (typeof window === 'undefined') return;

  var initHwpShortcuts = function() {
    if (typeof Asc === 'undefined' || !Asc.c_oAscDocumentShortcutType || !Asc.c_oAscDefaultShortcuts) {
      setTimeout(initHwpShortcuts, 500);
      return;
    }

    var t = Asc.c_oAscDocumentShortcutType;
    var d = Asc.c_oAscDefaultShortcuts;

    function addShortcut(type, keyCode, ctrl, shift, alt, meta) {
      if (type === undefined) return;
      var s = new AscCommon.AscShortcut(type, keyCode, ctrl, shift, alt, meta);
      if (Array.isArray(d[type])) d[type].push(s);
      else if (d[type]) d[type] = [d[type], s];
      else d[type] = s;
    }

    // Alt+L: 글자 모양 (Font Dialog)
    addShortcut(t.FontPanelOpen, 76, false, false, true, false);

    // Alt+T: 문단 모양 (Paragraph Dialog)
    addShortcut(t.ParagraphPanelOpen, 84, false, false, true, false);

    // Ctrl+F10: 특수문자 (Insert Symbol)
    if (t.InsertSymbol !== undefined) {
      addShortcut(t.InsertSymbol, 121, true, false, false, false);
    }

    console.log('[BizBell] HWP shortcuts: Alt+L, Alt+T, Ctrl+F10');
  };

  if (document.readyState === 'complete') initHwpShortcuts();
  else window.addEventListener('load', initHwpShortcuts);
})();
// ============================================
