
// ============================================
// HWP (한글) 스타일 단축키 - BizBell Custom
// Keyboard.js 패치 - OnlyOffice Document Editor
// ============================================

// 기존 onKeyDown 함수를 확장하여 HWP 단축키 추가
(function() {
    // 원본 onKeyDown 저장
    var originalOnKeyDown = null;

    function initHwpKeyboardPatch() {
        if (typeof AscCommon === 'undefined' || typeof AscCommon.CEditorPage === 'undefined') {
            setTimeout(initHwpKeyboardPatch, 100);
            return;
        }

        var EditorPage = AscCommon.CEditorPage;
        if (!EditorPage || !EditorPage.prototype) {
            setTimeout(initHwpKeyboardPatch, 100);
            return;
        }

        // 원본 함수 백업
        if (!originalOnKeyDown && EditorPage.prototype.onKeyDown) {
            originalOnKeyDown = EditorPage.prototype.onKeyDown;
        }

        // HWP 단축키를 처리하는 확장된 onKeyDown
        EditorPage.prototype.onKeyDown = function(e) {
            var isHandled = false;
            var api = this.m_oApi;

            if (!api) {
                if (originalOnKeyDown) {
                    return originalOnKeyDown.call(this, e);
                }
                return;
            }

            // Alt + L: 글자 모양 (Font Dialog)
            if (e.altKey && !e.ctrlKey && !e.shiftKey && e.keyCode === 76) {
                e.preventDefault();
                e.stopPropagation();
                if (api.asc_openFontAdvancedSettings) {
                    api.asc_openFontAdvancedSettings();
                } else if (api.FontAdvancedSettings) {
                    api.FontAdvancedSettings();
                }
                isHandled = true;
            }

            // Alt + T: 문단 모양 (Paragraph Dialog)
            if (e.altKey && !e.ctrlKey && !e.shiftKey && e.keyCode === 84) {
                e.preventDefault();
                e.stopPropagation();
                if (api.asc_openParagraphAdvancedSettings) {
                    api.asc_openParagraphAdvancedSettings();
                } else if (api.ParagraphAdvancedSettings) {
                    api.ParagraphAdvancedSettings();
                }
                isHandled = true;
            }

            // Ctrl + F10: 특수문자 입력 (Insert Symbol)
            if (e.ctrlKey && !e.altKey && !e.shiftKey && e.keyCode === 121) {
                e.preventDefault();
                e.stopPropagation();
                if (api.asc_openSymbolDialog) {
                    api.asc_openSymbolDialog();
                } else if (api.asc_InsertSymbol) {
                    api.asc_InsertSymbol();
                }
                isHandled = true;
            }

            // F7: 편집 용지 (Page Setup)
            if (!e.ctrlKey && !e.altKey && !e.shiftKey && e.keyCode === 118) {
                e.preventDefault();
                e.stopPropagation();
                if (api.asc_openPageSetupDialog) {
                    api.asc_openPageSetupDialog();
                } else if (api.change_DocInfo) {
                    api.change_DocInfo();
                }
                isHandled = true;
            }

            // 처리되지 않은 키는 원본 함수로 전달
            if (!isHandled && originalOnKeyDown) {
                return originalOnKeyDown.call(this, e);
            }
        };

        console.log('[BizBell] HWP keyboard shortcuts patch applied: Alt+L, Alt+T, Ctrl+F10, F7');
    }

    // 초기화
    if (typeof window !== 'undefined') {
        if (document.readyState === 'complete') {
            initHwpKeyboardPatch();
        } else {
            window.addEventListener('load', initHwpKeyboardPatch);
        }
    } else {
        // Node.js 환경 (빌드 시)
        initHwpKeyboardPatch();
    }
})();
// ============================================
