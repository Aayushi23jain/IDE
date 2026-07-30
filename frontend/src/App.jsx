import { useState, useEffect } from 'react';
import axios from 'axios';
import { QuestionPanel, OutputPanel } from './components/QuestionOutputPanel';
import Header from './components/Header';
import IDELayout from './components/IDELayout';
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

  const handleRunCode = async () => {
    setIsRunning(true);
    setOutput(null);
    try {
      const response = await axios.post('http://localhost:5000/api/compile', {
        code: code,
        questionId: selectedQuestion?.id
      });
      setOutput(response.data);
      if (response.data?.success && selectedQuestion?.id && !solvedQuestionIds.has(selectedQuestion.id)) {
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

      <main className="flex-1 w-full h-full p-3 overflow-hidden">
        <IDELayout
          questionPanel={<QuestionPanel question={selectedQuestion} />}
          codePanel={
            <CodePanel 
              code={code}
              setCode={setCode}
              isRunning={isRunning}
              handleRunCode={handleRunCode}
              handleResetCode={handleResetCode}
            />
          }
          outputPanel={<OutputPanel 
              output={output}
              question={selectedQuestion}
            />}
        />
      </main>
    </div>
  );
}

export default App;