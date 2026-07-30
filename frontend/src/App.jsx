import { useState, useEffect } from 'react';
import axios from 'axios';
import { QuestionPanel, OutputPanel } from './components/QuestionOutputPanel';
import Header from './components/Header';
import HamburgerMenu from './components/HamburgerMenu';
import SolvedCounter from './components/SolvedCounter';
import ProblemDrawer from './components/ProblemDrawer';
import CodePanel from './components/CodePanel';

function App() {
  const [questions, setQuestions] = useState([]);
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [code, setCode] = useState('');
  const [output, setOutput] = useState(null);
  const [isRunning, setIsRunning] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [problemsSolved, setProblemsSolved] = useState(0);
  const [solvedQuestionIds, setSolvedQuestionIds] = useState(new Set());
  const [outputHeight, setOutputHeight] = useState(33);
  const [isResizing, setIsResizing] = useState(false);
  const [leftPanelWidth, setLeftPanelWidth] = useState(50);
  const [isHorizontalResizing, setIsHorizontalResizing] = useState(false);

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/questions');
      setQuestions(response.data);
      if (response.data.length > 0) {
        setSelectedQuestion(response.data[0]);
        setCode(response.data[0].starterCode);
      }
    } catch (error) {
      console.error('Error fetching questions:', error);
    }
  };

  const handleQuestionSelect = (question) => {
    setSelectedQuestion(question);
    setCode(question.starterCode);
    setOutput(null);
  };

  const handleRunCode = async (customInput = null) => {
    setIsRunning(true);
    setOutput(null);
    try {
      const response = await axios.post('http://localhost:5000/api/compile', {
        code: code,
        questionId: selectedQuestion?.id,
        customInput: customInput
      });
      setOutput(response.data);
      if (response.data?.success && selectedQuestion?.id && !solvedQuestionIds.has(selectedQuestion.id) && !customInput) {
        setSolvedQuestionIds(prev => new Set(prev).add(selectedQuestion.id));
        setProblemsSolved(prev => prev + 1);
      }
    } catch (error) {
      setOutput({ success: false, error: 'Network Error', output: error.message });
    }
    setIsRunning(false);
  };

  const handleResetCode = () => {
    if (selectedQuestion) {
      setCode(selectedQuestion.starterCode);
      setOutput(null);
    }
  };

  const handleMouseDown = (e) => {
    setIsResizing(true);
    e.preventDefault();
  };

  const handleHorizontalMouseDown = (e) => {
    setIsHorizontalResizing(true);
    e.preventDefault();
  };

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (isResizing) {
        const container = document.getElementById('right-panel');
        if (container) {
          const containerRect = container.getBoundingClientRect();
          const newHeight = ((containerRect.bottom - e.clientY) / containerRect.height) * 100;
          const clampedHeight = Math.max(10, Math.min(80, newHeight));
          setOutputHeight(clampedHeight);
        }
      }
      
      if (isHorizontalResizing) {
        const container = document.getElementById('main-panel');
        if (container) {
          const containerRect = container.getBoundingClientRect();
          const newWidth = ((e.clientX - containerRect.left) / containerRect.width) * 100;
          const clampedWidth = Math.max(20, Math.min(80, newWidth));
          setLeftPanelWidth(clampedWidth);
        }
      }
    };

    const handleMouseUp = () => {
      setIsResizing(false);
      setIsHorizontalResizing(false);
    };

    if (isResizing || isHorizontalResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizing, isHorizontalResizing]);

  return (
    <div className="h-screen w-screen flex flex-col overflow-hidden text-slate-100 font-sans antialiased bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950">
      {/* Top Bar with Header and Controls */}
      <div className="flex items-center justify-between px-4 pt-4">
        <HamburgerMenu 
          isMenuOpen={isMenuOpen} 
          setIsMenuOpen={setIsMenuOpen} 
        />
        <Header />
        <SolvedCounter problemsSolved={problemsSolved} />
      </div>

      <ProblemDrawer 
        isMenuOpen={isMenuOpen}
        setIsMenuOpen={setIsMenuOpen}
        questions={questions}
        selectedQuestion={selectedQuestion}
        handleQuestionSelect={handleQuestionSelect}
      />

      <main id="main-panel" className="flex-1 w-full h-full p-3 overflow-hidden flex gap-3">
        <div className="h-full" style={{ width: `${leftPanelWidth}%` }}>
          <QuestionPanel question={selectedQuestion} />
        </div>
        <div
          className="w-1 bg-white/10 hover:bg-cyan-500/30 cursor-col-resize transition-colors"
          onMouseDown={handleHorizontalMouseDown}
        />
        <div id="right-panel" className="h-full flex flex-col" style={{ width: `${100 - leftPanelWidth}%` }}>
          <div className="flex-1" style={{ height: `${100 - outputHeight}%` }}>
            <CodePanel 
              code={code}
              setCode={setCode}
              isRunning={isRunning}
              handleRunCode={handleRunCode}
              handleResetCode={handleResetCode}
            />
          </div>
          <div
            className="h-1 bg-white/10 hover:bg-cyan-500/30 cursor-row-resize transition-colors"
            onMouseDown={handleMouseDown}
          />
          <div style={{ height: `${outputHeight}%` }}>
            <OutputPanel 
              output={output}
              question={selectedQuestion}
            />
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;