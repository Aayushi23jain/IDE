import Editor from '@monaco-editor/react';

function CodeEditor({ code, setCode }) {
  const handleEditorWillMount = (monaco) => {
    monaco.editor.defineTheme('custom-dark', {
      base: 'vs-dark',
      inherit: true,
      rules: [
        { token: 'comment', foreground: '6A9955', fontStyle: 'italic' },
        { token: 'keyword', foreground: 'C586C0', fontStyle: 'bold' },
        { token: 'string', foreground: 'CE9178' },
        { token: 'number', foreground: 'B5CEA8' },
      ],
      colors: {
        'editor.background': '#0D0E15',
        'editor.lineHighlightBackground': '#1A1C28',
        'editorCursor.foreground': '#38BDF8',
        'editorLineNumber.foreground': '#475569',
        'editorLineNumber.activeForeground': '#38BDF8',
      },
    });
  };

  return (
    <div className="w-full h-full rounded-xl overflow-hidden border border-white/10 shadow-2xl bg-[#0D0E15]">
      <Editor
        height="100%"
        width="100%"
        defaultLanguage="cpp"
        value={code}
        onChange={(value) => setCode(value)}
        beforeMount={handleEditorWillMount}
        theme="custom-dark"
        options={{
          minimap: { enabled: false },
          fontSize: 14,
          lineNumbers: 'on',
          roundedSelection: true,
          scrollBeyondLastLine: false,
          automaticLayout: true, // Auto adjustment when panel resizes
          tabSize: 2,
          wordWrap: 'on',
          fontFamily: "'Fira Code', 'Consolas', monospace",
          fontLigatures: true,
          cursorBlinking: 'smooth',
          cursorSmoothCaretAnimation: 'on',
          smoothScrolling: true,
          padding: { top: 16, bottom: 16 },
          suggest: { showKeywords: true, showSnippets: true },
        }}
      />
    </div>
  );
}

export default CodeEditor;