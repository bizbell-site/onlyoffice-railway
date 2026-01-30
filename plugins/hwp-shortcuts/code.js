/**
 * HWP Shortcuts Plugin for OnlyOffice
 *
 * 한글(HWP) 스타일 단축키를 OnlyOffice에서 사용할 수 있도록 매핑
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

(function(window, undefined) {
  'use strict';

  // 순차 키 입력을 위한 상태 관리
  var waitingForSecondKey = false;
  var firstKeyTime = 0;
  var SEQUENCE_TIMEOUT = 1500; // 1.5초 내에 두 번째 키 입력

  window.Asc.plugin.init = function() {
    console.log('[HWP Shortcuts] Plugin initialized');
  };

  window.Asc.plugin.onDocumentContentReady = function() {
    console.log('[HWP Shortcuts] Document content ready - attaching keyboard handler');

    // 에디터 iframe 내부에서 키보드 이벤트 캡처
    var editorFrame = document.querySelector('iframe');
    if (editorFrame && editorFrame.contentDocument) {
      editorFrame.contentDocument.addEventListener('keydown', handleKeyDown, true);
    }

    // 현재 document에도 등록
    document.addEventListener('keydown', handleKeyDown, true);

    // window에도 등록 (capture phase)
    window.addEventListener('keydown', handleKeyDown, true);
  };

  function handleKeyDown(event) {
    var now = Date.now();
    var key = event.key ? event.key.toLowerCase() : '';
    var keyCode = event.keyCode || event.which;
    var ctrlKey = event.ctrlKey || event.metaKey;
    var altKey = event.altKey;
    var shiftKey = event.shiftKey;

    // 순차 키 입력 처리 (Ctrl+N 이후)
    if (waitingForSecondKey && (now - firstKeyTime) < SEQUENCE_TIMEOUT) {
      waitingForSecondKey = false;

      switch (key) {
        case 't': // 표 삽입
          event.preventDefault();
          event.stopPropagation();
          insertTable();
          console.log('[HWP Shortcuts] Ctrl+N → T: Insert Table');
          return false;

        case 'i': // 그림 삽입
          event.preventDefault();
          event.stopPropagation();
          insertImage();
          console.log('[HWP Shortcuts] Ctrl+N → I: Insert Image');
          return false;

        case 'e': // 수식 삽입
          event.preventDefault();
          event.stopPropagation();
          insertEquation();
          console.log('[HWP Shortcuts] Ctrl+N → E: Insert Equation');
          return false;

        case 'p': // 쪽 번호
          event.preventDefault();
          event.stopPropagation();
          insertPageNumber();
          console.log('[HWP Shortcuts] Ctrl+N → P: Insert Page Number');
          return false;
      }
    }

    // 시퀀스 타임아웃 처리
    if (waitingForSecondKey && (now - firstKeyTime) >= SEQUENCE_TIMEOUT) {
      waitingForSecondKey = false;
    }

    // Ctrl+N: 순차 입력 시작
    if (ctrlKey && !altKey && !shiftKey && key === 'n') {
      event.preventDefault();
      event.stopPropagation();
      waitingForSecondKey = true;
      firstKeyTime = now;
      console.log('[HWP Shortcuts] Ctrl+N pressed - waiting for second key');
      return false;
    }

    // Alt+L: 글자 모양
    if (altKey && !ctrlKey && !shiftKey && key === 'l') {
      event.preventDefault();
      event.stopPropagation();
      openFontDialog();
      console.log('[HWP Shortcuts] Alt+L: Font Dialog');
      return false;
    }

    // Alt+T: 문단 모양
    if (altKey && !ctrlKey && !shiftKey && key === 't') {
      event.preventDefault();
      event.stopPropagation();
      openParagraphDialog();
      console.log('[HWP Shortcuts] Alt+T: Paragraph Dialog');
      return false;
    }

    // Ctrl+F10: 특수문자
    if (ctrlKey && !altKey && !shiftKey && keyCode === 121) {
      event.preventDefault();
      event.stopPropagation();
      openSymbolDialog();
      console.log('[HWP Shortcuts] Ctrl+F10: Symbol Dialog');
      return false;
    }

    return true;
  }

  // 글자 모양 다이얼로그 열기
  function openFontDialog() {
    window.Asc.plugin.executeMethod('StartAction', ['Information', '글자 모양']);

    // OnlyOffice 내부 API 호출
    window.Asc.plugin.callCommand(function() {
      var oDocument = Api.GetDocument();
      // 에디터 API를 통해 Font Dialog 열기 시도
      if (typeof Asc !== 'undefined' && Asc.editor) {
        Asc.editor.asc_ShowParaFormatDialog && Asc.editor.asc_ShowFontDialog();
      }
    }, false, false, function(result) {
      window.Asc.plugin.executeMethod('EndAction', ['Information', '글자 모양']);
    });
  }

  // 문단 모양 다이얼로그 열기
  function openParagraphDialog() {
    window.Asc.plugin.executeMethod('StartAction', ['Information', '문단 모양']);

    window.Asc.plugin.callCommand(function() {
      var oDocument = Api.GetDocument();
      if (typeof Asc !== 'undefined' && Asc.editor) {
        Asc.editor.asc_ShowParagraphDialog && Asc.editor.asc_ShowParagraphDialog();
      }
    }, false, false, function(result) {
      window.Asc.plugin.executeMethod('EndAction', ['Information', '문단 모양']);
    });
  }

  // 표 삽입
  function insertTable() {
    window.Asc.plugin.callCommand(function() {
      var oDocument = Api.GetDocument();
      var oTable = Api.CreateTable(3, 3);
      oTable.SetWidth('percent', 100);
      oDocument.Push(oTable);
    }, true, true);
  }

  // 그림 삽입 (다이얼로그)
  function insertImage() {
    window.Asc.plugin.executeMethod('StartAction', ['Information', '그림 삽입']);

    // 파일 선택 input 생성
    var input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.style.display = 'none';

    input.onchange = function(e) {
      var file = e.target.files[0];
      if (!file) {
        window.Asc.plugin.executeMethod('EndAction', ['Information', '그림 삽입']);
        return;
      }

      var reader = new FileReader();
      reader.onload = function() {
        var base64 = reader.result;

        window.Asc.plugin.callCommand(function() {
          var oDocument = Api.GetDocument();
          var oParagraph = Api.CreateParagraph();
          var oDrawing = Api.CreateImage(base64, 100 * 36000, 100 * 36000);
          oParagraph.AddDrawing(oDrawing);
          oDocument.Push(oParagraph);
        }, true, true, function() {
          window.Asc.plugin.executeMethod('EndAction', ['Information', '그림 삽입']);
        });
      };
      reader.readAsDataURL(file);

      document.body.removeChild(input);
    };

    document.body.appendChild(input);
    input.click();
  }

  // 수식 삽입
  function insertEquation() {
    window.Asc.plugin.callCommand(function() {
      var oDocument = Api.GetDocument();
      var oParagraph = Api.CreateParagraph();
      var oRun = Api.CreateRun();
      oRun.AddText('수식');
      oParagraph.AddElement(oRun);
      oDocument.Push(oParagraph);
      // TODO: 실제 수식 편집기 열기
    }, true, true);
  }

  // 쪽 번호 삽입
  function insertPageNumber() {
    window.Asc.plugin.callCommand(function() {
      var oDocument = Api.GetDocument();
      var oSection = oDocument.GetFinalSection();
      var oFooter = oSection.GetFooter('default', true);
      var oParagraph = Api.CreateParagraph();
      oParagraph.SetJc('center');
      var oRun = Api.CreateRun();
      oRun.AddPageNumber();
      oParagraph.AddElement(oRun);
      oFooter.Push(oParagraph);
    }, true, true);
  }

  // 특수문자 다이얼로그
  function openSymbolDialog() {
    window.Asc.plugin.executeMethod('StartAction', ['Information', '특수문자']);

    // 간단한 특수문자 삽입 (★)
    window.Asc.plugin.callCommand(function() {
      var oDocument = Api.GetDocument();
      var oParagraph = oDocument.GetElement(oDocument.GetElementsCount() - 1);
      var oRun = Api.CreateRun();
      oRun.AddText('★');
      oParagraph.AddElement(oRun);
    }, true, true, function() {
      window.Asc.plugin.executeMethod('EndAction', ['Information', '특수문자']);
    });
  }

  window.Asc.plugin.button = function(id) {
    this.executeCommand('close', '');
  };

})(window);
