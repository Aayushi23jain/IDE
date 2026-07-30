import React from 'react';
import { BookOpen, Lightbulb, CheckCircle, CheckCircle2, XCircle, Terminal, Sparkles, ChevronDown, ChevronRight, AlertTriangle, AlertCircle } from 'lucide-react';


function QuestionPanel({ question }) {
  if (!question) {
    return (
      <div className="flex flex-col items-center justify-center h-full min-h-[300px] text-center p-6">
        <div className="p-4 rounded-full bg-white/5 mb-4 border border-white/10">
          <BookOpen className="w-10 h-10 text-gray-400" />
        </div>
        <p className="text-gray-400 font-medium">Select a challenge from the sidebar to start coding</p>
      </div>
    );
  }

  const difficultyColors = {
    Easy: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    Medium: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    Hard: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
  };

  return (
    <div className="h-full min-w-[200px] max-w-full flex flex-col overflow-y-auto space-y-6 text-gray-200 pr-2">
      {/* Header Info */}
      <div>
        <div className="flex items-center gap-3 mb-3">
          <span className={`text-xs px-3 py-1 rounded-full font-semibold border ${difficultyColors[question.difficulty]}`}>
            {question.difficulty}
          </span>
        </div>
        <h2 className="text-2xl font-bold tracking-tight text-white mb-3">{question.title}</h2>
        <p className="text-gray-300 leading-relaxed text-sm">{question.description}</p>
      </div>

      {/* Examples Section */}
      <div className="space-y-4">
        <h3 className="flex items-center gap-2 text-sm font-semibold text-cyan-400 uppercase tracking-wider">
          <Lightbulb className="w-4 h-4" />
          Test Cases
        </h3>
        
        <div className="space-y-3">
          {question.examples?.map((example, index) => (
            <div key={index} className="bg-black/40 rounded-xl p-4 border border-white/10 space-y-2">
              <div className="text-xs font-mono">
                <span className="text-gray-500 mr-2">Input:</span>
                <code className="text-cyan-300 bg-cyan-950/40 px-2 py-0.5 rounded border border-cyan-800/30">
                  {example.input}
                </code>
              </div>
              <div className="text-xs font-mono">
                <span className="text-gray-500 mr-2">Output:</span>
                <code className="text-emerald-300 bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-800/30">
                  {example.output}
                </code>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Constraints Section */}
      {question.constraints && (
        <div className="bg-gradient-to-br from-amber-900/20 to-orange-900/20 rounded-xl p-4 border border-amber-500/20">
          <h4 className="flex items-center gap-2 text-xs font-semibold text-amber-300 uppercase tracking-wider mb-2">
            <AlertTriangle className="w-4 h-4" />
            Constraints
          </h4>
          <div className="text-xs text-gray-300 space-y-2">
            
            {question.constraints.inputRanges && (
              <div className="space-y-1">
                <span className="text-amber-400 font-medium">Input Ranges:</span>
                <ul className="text-gray-400 list-disc list-inside ml-2">
                  {Object.entries(question.constraints.inputRanges).map(([key, value]) => (
                    <li key={key}>
                      <span className="text-cyan-300">{key}:</span> {value}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Hints Section */}
      {question.hints && question.hints.length > 0 && (
        <div className="bg-gradient-to-br from-blue-900/20 to-indigo-900/20 rounded-xl p-4 border border-blue-500/20">
          <h4 className="flex items-center gap-2 text-xs font-semibold text-blue-300 uppercase tracking-wider mb-2">
            <Lightbulb className="w-4 h-4" />
            Hints
          </h4>
          <ul className="text-xs text-gray-300 space-y-1.5 list-disc list-inside">
            {question.hints.map((hint, index) => (
              <li key={index}>{hint}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Quick Tips */}
      <div className="bg-gradient-to-br from-purple-900/20 to-pink-900/20 rounded-xl p-4 border border-purple-500/20">
        <h4 className="flex items-center gap-2 text-xs font-semibold text-purple-300 uppercase tracking-wider mb-2">
          <CheckCircle className="w-4 h-4" />
          Instructions
        </h4>
        <ul className="text-xs text-gray-300 space-y-1.5 list-disc list-inside">
          <li>Write standard input/output logic if needed.</li>
          <li>Click <span className="text-cyan-400 font-semibold">Run Code</span> to test against the compiler.</li>
        </ul>
      </div>
    </div>
  );
}

function OutputPanel({ output, question }) {
  const [expandedTestCases, setExpandedTestCases] = React.useState({});

  const toggleTestCase = (index) => {
    setExpandedTestCases(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  const formatValue = (value) => {
    if (Array.isArray(value)) {
      return `[${value.join(', ')}]`;
    }
    return String(value);
  };

  return (
    <div className="h-full min-w-[200px] max-w-full flex flex-col bg-slate-900/60 backdrop-blur-xl border border-white/10 rounded-xl overflow-hidden shadow-2xl shadow-cyan-500/10">
      {/* Terminal Header */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-white/5 border-b border-white/10 shrink-0">
        <div className="flex items-center gap-2">
          <div className="relative">
            <div className="absolute inset-0 bg-cyan-500/20 blur-lg rounded-full"></div>
            <Terminal className="w-4 h-4 text-cyan-400 relative z-10 drop-shadow-[0_0_8px_rgba(34,211,238,0.6)]" />
          </div>
          <span className="text-xs font-semibold tracking-wider text-gray-300 uppercase">Execution Console</span>
        </div>
        
        {/* Status Indicator */}
        {output && (
          <div>
            {output.success ? (
              <span className="flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow-lg shadow-emerald-500/20">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Passed
              </span>
            ) : (
              <span className="flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/20 shadow-lg shadow-rose-500/20">
                <XCircle className="w-3.5 h-3.5" />
                Failed
              </span>
            )}
          </div>
        )}
      </div>

      {/* Terminal Content - Dynamic Height & Auto Scroll */}
      <div className="flex-1 overflow-y-auto bg-[#090A0F]">
        {/* Custom Input Section */}
        {output?.customInput && (
          <div className="p-4 border-b border-white/10 bg-cyan-900/10">
            <div className="flex items-center gap-2 mb-2">
              <Terminal className="w-4 h-4 text-cyan-400" />
              <span className="text-xs font-semibold text-cyan-300 uppercase tracking-wider">Custom Input</span>
            </div>
            <div className="bg-black/40 rounded p-2 border border-cyan-500/20 mb-2">
              <pre className="text-xs text-cyan-300 font-mono whitespace-pre-wrap break-all">
                {output.customInput}
              </pre>
            </div>
            <div className="flex items-center gap-2 mb-2">
              <Terminal className="w-4 h-4 text-emerald-400" />
              <span className="text-xs font-semibold text-emerald-300 uppercase tracking-wider">Your Output</span>
            </div>
            <div className="bg-black/40 rounded p-2 border border-emerald-500/20">
              <pre className="text-xs text-emerald-300 font-mono whitespace-pre-wrap break-all">
                {output.customOutput || output.output}
              </pre>
            </div>
          </div>
        )}

        {/* Test Cases Section */}
        {(output?.validation?.details && output.validation.details.length > 0) || (question?.testCases && question.testCases.length > 0) ? (
          <div className="p-4 border-b border-white/10">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-4 h-4 text-purple-400" />
              <span className="text-xs font-semibold text-purple-300 uppercase tracking-wider">Test Cases</span>
              {output?.validation?.details && (
                <span className="text-xs text-gray-500">
                  ({output.validation.details.filter(d => d.passed).length}/{output.validation.details.length} passed)
                </span>
              )}
            </div>
            
            <div className="space-y-2">
              {(output?.validation?.details || question?.testCases || []).map((detail, index) => {
                const testCase = output?.validation?.details ? detail : question.testCases[index];
                const hasResult = output?.validation?.details;
                
                return (
                  <div key={index} className="bg-black/40 rounded-lg border border-white/10 overflow-hidden">
                    {/* Test Case Header - Toggle Button */}
                    <button
                      onClick={() => toggleTestCase(index)}
                      className="w-full px-3 py-2 flex items-center justify-between hover:bg-white/5 transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        {expandedTestCases[index] ? (
                          <ChevronDown className="w-4 h-4 text-gray-400" />
                        ) : (
                          <ChevronRight className="w-4 h-4 text-gray-400" />
                        )}
                        <span className="text-xs font-medium text-gray-300">
                          Test Case {index + 1}
                        </span>
                        {hasResult && (
                          <>
                            {testCase.passed ? (
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                            ) : (
                              <XCircle className="w-3.5 h-3.5 text-rose-400" />
                            )}
                          </>
                        )}
                      </div>
                      {hasResult && (
                        <span className={`text-xs px-2 py-0.5 rounded-full ${
                          testCase.passed 
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                            : testCase.actual === 'Constraint Violation'
                              ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                              : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                        }`}>
                          {testCase.passed ? 'Passed' : (testCase.actual === 'Constraint Violation' ? 'Constraint Violation' : 'Failed')}
                        </span>
                      )}
                    </button>

                    {/* Expanded Test Case Details */}
                    {expandedTestCases[index] && (
                      <div className="px-3 py-2 border-t border-white/10 space-y-2 bg-black/20">
                        <div className="grid grid-cols-1 gap-2 text-xs">
                          <div className="flex items-start gap-2">
                            <span className="text-gray-500 shrink-0 w-16">Input:</span>
                            <code className="text-cyan-300 bg-cyan-950/40 px-2 py-0.5 rounded border border-cyan-800/30 flex-1 break-all">
                              {formatValue(testCase.input)}
                            </code>
                          </div>
                          {hasResult ? (
                            <>
                              {testCase.actual === 'Constraint Violation' ? (
                                <div className="flex items-start gap-2">
                                  <span className="text-gray-500 shrink-0 w-16">Error:</span>
                                  <code className="text-amber-300 bg-amber-950/40 px-2 py-0.5 rounded border border-amber-800/30 flex-1 break-all">
                                    {testCase.error || 'Constraint Violation'}
                                  </code>
                                </div>
                              ) : (
                                <>
                                  <div className="flex items-start gap-2">
                                    <span className="text-gray-500 shrink-0 w-16">Your Output:</span>
                                    <code className={`${
                                      testCase.passed ? 'text-emerald-300 bg-emerald-950/40 border-emerald-800/30' : 'text-rose-300 bg-rose-950/40 border-rose-800/30'
                                    } px-2 py-0.5 rounded border flex-1 break-all`}>
                                      {formatValue(testCase.actual)}
                                    </code>
                                  </div>
                                  <div className="flex items-start gap-2">
                                    <span className="text-gray-500 shrink-0 w-16">Expected:</span>
                                    <code className="text-purple-300 bg-purple-950/40 px-2 py-0.5 rounded border border-purple-800/30 flex-1 break-all">
                                      {formatValue(testCase.expected)}
                                    </code>
                                  </div>
                                </>
                              )}
                            </>
                          ) : (
                            <div className="flex items-start gap-2">
                              <span className="text-gray-500 shrink-0 w-16">Expected:</span>
                              <code className="text-purple-300 bg-purple-950/40 px-2 py-0.5 rounded border border-purple-800/30 flex-1 break-all">
                                {formatValue(testCase.expected)}
                              </code>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ) : null}

        
      </div>
    </div>
  );
}

export { QuestionPanel, OutputPanel };