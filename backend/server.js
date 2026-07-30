const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { exec, spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(bodyParser.json());

// Helper function to parse output from C++ program
function parseOutput(output) {
  try {
    // Try to parse as JSON first
    const trimmed = output.trim();
    if (trimmed.startsWith('[') || trimmed.startsWith('{')) {
      return JSON.parse(trimmed);
    }
    
    // Try to parse as array-like format: [0,1] or 0,1
    const arrayMatch = trimmed.match(/[\[\]]?\s*([0-9,\s]+)\s*[\[\]]?/);
    if (arrayMatch) {
      const numbers = arrayMatch[1].split(',').map(n => parseInt(n.trim()));
      return numbers;
    }
    
    // Try to parse as boolean
    if (trimmed === 'true' || trimmed === 'false') {
      return trimmed === 'true';
    }
    
    // Try to parse as number
    const num = parseInt(trimmed);
    if (!isNaN(num)) {
      return num;
    }
    
    return trimmed;
  } catch (e) {
    return output.trim();
  }
}

// Helper function to validate constraints
function validateConstraints(code, question) {
  if (!question.constraints) return { passed: true, error: null };
  
  const violations = [];
  
  // Only check for obvious O(n²) violations (nested loops)
  const nestedLoopPattern = /for\s*\([^)]*\)\s*\{[^}]*for\s*\(/g;
  const nestedWhilePattern = /while\s*\([^)]*\)\s*\{[^}]*while\s*\(/g;
  
  if (nestedLoopPattern.test(code) || nestedWhilePattern.test(code)) {
    violations.push("Nested loops detected - O(n²) complexity may violate time constraints");
  }
  
  // Check for specific forbidden operations in Reverse Integer
  if (question.id === 3 && (code.includes("to_string") || code.includes("string") || code.includes("stoi"))) {
    violations.push("String conversion detected - try using mathematical operations for this problem");
  }
  
  if (violations.length > 0) {
    return { passed: false, error: violations.join(", ") };
  }
  
  return { passed: true, error: null };
}

// Helper function to validate output against expected
function validateOutput(actual, expected) {
  // Handle array comparison
  if (Array.isArray(expected)) {
    if (!Array.isArray(actual)) return false;
    if (actual.length !== expected.length) return false;
    return expected.every((val, idx) => actual[idx] === val);
  }
  
  // Handle boolean comparison
  if (typeof expected === 'boolean') {
    return actual === expected || actual === (expected ? 'true' : 'false');
  }
  
  // Handle number comparison
  if (typeof expected === 'number') {
    return parseInt(actual) === expected;
  }
  
  // String comparison (case-insensitive)
  return String(actual).toLowerCase() === String(expected).toLowerCase();
}

// Sample C++ questions
const questions = [
  {
    id: 1,
    title: "Two Sum",
    difficulty: "Easy",
    description: "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.",
    examples: [
      { input: "nums = [2,7,11,15], target = 9", output: "[0,1]" },
      { input: "nums = [3,2,4], target = 6", output: "[1,2]" }
    ],
    constraints: {
     
      inputRanges: {
        nums: "2 <= nums.length <= 10^4",
        numsValues: "-10^9 <= nums[i] <= 10^9",
        target: "-10^9 <= target <= 10^9"
      }
    },
    hints: [
      "Use a hash map to store visited elements and their indices",
      "For each element, check if (target - current element) exists in the map",
      "This approach gives O(n) time complexity"
    ],
    starterCode: `#include <iostream>
#include <vector>
#include <unordered_map>
using namespace std;

vector<int> twoSum(vector<int>& nums, int target) {
    // Your code here
    
}

int main() {
    vector<int> nums = {2, 7, 11, 15};
    int target = 9;
    vector<int> result = twoSum(nums, target);
    cout << "[";
    for (int i = 0; i < result.size(); i++) {
        cout << result[i];
        if (i < result.size() - 1) cout << ",";
    }
    cout << "]" << endl;
    return 0;
}`,
    testCases: [
      { input: [2, 7, 11, 15], target: 9, expected: [0, 1] },
      { input: [3, 2, 4], target: 6, expected: [1, 2] }
    ],
    // Custom validation function for flexible solution acceptance
    validate: (output) => {
      const parsed = parseOutput(output);
      // Accept any array of 2 integers
      return Array.isArray(parsed) && parsed.length === 2 && 
             parsed.every(n => typeof n === 'number' && !isNaN(n));
    }
  },
  {
    id: 2,
    title: "Palindrome Number",
    difficulty: "Easy",
    description: "Given an integer x, return true if x is a palindrome, and false otherwise.",
    examples: [
      { input: "x = 121", output: "true" },
      { input: "x = -121", output: "false" }
    ],
    constraints: {
      
      inputRanges: {
        x: "-2^31 <= x <= 2^31 - 1"
      }
    },
    hints: [
      "Negative numbers are never palindromes",
      "You can reverse the number and compare with original",
      "For O(1) space, try reversing only half of the number"
    ],
    starterCode: `#include <iostream>
using namespace std;

bool isPalindrome(int x) {
    // Your code here
    
}

int main() {
    int x = 121;
    cout << (isPalindrome(x) ? "true" : "false") << endl;
    return 0;
}`,
    testCases: [
      { input: 121, expected: true },
      { input: -121, expected: false },
      { input: 10, expected: false }
    ],
    validate: (output) => {
      const parsed = parseOutput(output);
      // Accept boolean or string 'true'/'false'
      return typeof parsed === 'boolean' || 
             (typeof parsed === 'string' && (parsed === 'true' || parsed === 'false'));
    }
  },
  {
    id: 3,
    title: "Reverse Integer",
    difficulty: "Medium",
    description: "Given a signed 32-bit integer x, return x with its digits reversed.",
    examples: [
      { input: "x = 123", output: "321" },
      { input: "x = -123", output: "-321" }
    ],
    constraints: {
      
      inputRanges: {
        x: "-2^31 <= x <= 2^31 - 1",
        output: "If reversed integer overflows, return 0"
      }
    },
    hints: [
      "Handle overflow by checking before it happens",
      "Use INT_MAX and INT_MIN from climits header",
      "You can use modulo and division operations"
    ],
    starterCode: `#include <iostream>
#include <climits>
using namespace std;

int reverse(int x) {
    // Your code here
    
}

int main() {
    int x = 123;
    cout << reverse(x) << endl;
    return 0;
}`,
    testCases: [
      { input: 123, expected: 321 },
      { input: -123, expected: -321 },
      { input: 120, expected: 21 }
    ],
    validate: (output) => {
      const parsed = parseOutput(output);
      // Accept any integer
      return typeof parsed === 'number' && !isNaN(parsed);
    }
  }
];

// Get all questions
app.get('/api/questions', (req, res) => {
  res.json(questions);
});

// Get specific question
app.get('/api/questions/:id', (req, res) => {
  const question = questions.find(q => q.id === parseInt(req.params.id));
  if (question) {
    res.json(question);
  } else {
    res.status(404).json({ error: 'Question not found' });
  }
});

// Helper function to run test cases
async function runTestCasesAndRespond(code, question, customInput, customOutput, res, tempDir) {
  const testResults = [];
  let allPassed = true;

  for (let i = 0; i < question.testCases.length; i++) {
    const testCase = question.testCases[i];
    const timestamp = Date.now() + i;
    const cppFile = path.join(tempDir, `solution_${timestamp}.cpp`);
    const exeFile = path.join(tempDir, `solution_${timestamp}.exe`);

    const modifiedCode = injectTestCase(String(code), testCase);
    fs.writeFileSync(cppFile, modifiedCode);

    try {
      await new Promise((resolve, reject) => {
        exec(`g++ "${cppFile}" -o "${exeFile}"`, (compileError, compileStdout, compileStderr) => {
          if (compileError) {
            fs.unlinkSync(cppFile);
            reject({ error: 'Compilation Error', output: compileStderr });
          } else {
            resolve();
          }
        });
      });

      const runOutput = await new Promise((resolve, reject) => {
        const runProcess = spawn(exeFile, [], { windowsHide: true });
        let runStdout = '';
        let runStderr = '';

        const timeout = setTimeout(() => {
          runProcess.kill();
          reject({ error: 'Timeout Error', output: 'Program execution timed out after 5 seconds' });
        }, 5000);

        runProcess.stdout.on('data', (data) => {
          runStdout += data.toString();
        });

        runProcess.stderr.on('data', (data) => {
          runStderr += data.toString();
        });

        runProcess.on('close', (code) => {
          clearTimeout(timeout);
          if (code !== 0) {
            reject({ error: 'Runtime Error', output: runStderr || `Process exited with code ${code}` });
          } else {
            resolve(runStdout);
          }
        });

        runProcess.on('error', (error) => {
          clearTimeout(timeout);
          reject({ error: 'Execution Error', output: error.message });
        });
      });

      const userOutput = parseOutput(runOutput);
      const passed = validateOutput(userOutput, testCase.expected);

      testResults.push({
        testCase: i + 1,
        input: testCase.input,
        expected: testCase.expected,
        actual: userOutput,
        passed: passed
      });

      if (!passed) allPassed = false;

    } catch (error) {
      testResults.push({
        testCase: i + 1,
        input: testCase.input,
        expected: testCase.expected,
        actual: error.output || 'Error',
        passed: false
      });
      allPassed = false;
    } finally {
      try {
        if (fs.existsSync(cppFile)) fs.unlinkSync(cppFile);
        if (fs.existsSync(exeFile)) fs.unlinkSync(exeFile);
      } catch (e) {
        console.error('Cleanup error:', e);
      }
    }
  }

  res.json({ 
    success: allPassed, 
    output: customOutput,
    customInput: customInput,
    customOutput: customOutput,
    validation: {
      passed: allPassed,
      details: testResults
    }
  });
}

// Helper function to inject test case values into code
function injectTestCase(code, testCase) {
  let modifiedCode = String(code); // Ensure code is always a string
  
  if (testCase.input !== undefined) {
    // Handle array inputs like {2, 7, 11, 15}
    if (Array.isArray(testCase.input)) {
      const arrayStr = `{${testCase.input.join(', ')}}`;
      // Replace vector initialization with proper escaping
      modifiedCode = modifiedCode.replace(
        /vector<int>\s+nums\s*=\s*\{[^}]*\}/, 
        `vector<int> nums = ${arrayStr}`
      );
      // Also handle simple array pattern
      modifiedCode = modifiedCode.replace(
        /nums\s*=\s*\{[^}]*\}/, 
        `nums = ${arrayStr}`
      );
      
      // Handle target value if exists
      if (testCase.target !== undefined) {
        modifiedCode = modifiedCode.replace(
          /int\s+target\s*=\s*\d+/, 
          `int target = ${testCase.target}`
        );
        modifiedCode = modifiedCode.replace(
          /target\s*=\s*\d+/, 
          `target = ${testCase.target}`
        );
      }
    } 
    // Handle single value inputs like x = 121
    else {
      modifiedCode = modifiedCode.replace(
        /int\s+x\s*=\s*\d+/, 
        `int x = ${testCase.input}`
      );
      modifiedCode = modifiedCode.replace(
        /x\s*=\s*\d+/, 
        `x = ${testCase.input}`
      );
    }
  }
  
  return modifiedCode;
}

// Compile and run C++ code with test case validation
app.post('/api/compile', async (req, res) => {
  const { code, questionId, customInput } = req.body;
  
  if (!code) {
    return res.status(400).json({ error: 'No code provided' });
  }

  // Find question to get test cases
  const question = questions.find(q => q.id === parseInt(questionId));
  
  const tempDir = path.join(__dirname, 'temp');
  if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir, { recursive: true });
  }

  try {
    // Handle custom input if provided
    if (customInput !== undefined && customInput !== null && customInput !== '') {
      const timestamp = Date.now();
      const cppFile = path.join(tempDir, `solution_${timestamp}.cpp`);
      const exeFile = path.join(tempDir, `solution_${timestamp}.exe`);

      fs.writeFileSync(cppFile, String(code));

      exec(`g++ "${cppFile}" -o "${exeFile}"`, (compileError, compileStdout, compileStderr) => {
        if (compileError) {
          fs.unlinkSync(cppFile);
          return res.json({ 
            success: false, 
            error: 'Compilation Error',
            output: compileStderr 
          });
        }

        const runProcess = spawn(exeFile, [], { windowsHide: true });
        let runStdout = '';
        let runStderr = '';

        const timeout = setTimeout(() => {
          runProcess.kill();
          try {
            if (fs.existsSync(cppFile)) fs.unlinkSync(cppFile);
            if (fs.existsSync(exeFile)) fs.unlinkSync(exeFile);
          } catch (e) {
            console.error('Cleanup error:', e);
          }
          return res.json({ 
            success: false, 
            error: 'Timeout Error',
            output: 'Program execution timed out after 5 seconds' 
          });
        }, 5000);

        // Write custom input to process
        if (customInput) {
          runProcess.stdin.write(customInput);
          runProcess.stdin.end();
        }

        runProcess.stdout.on('data', (data) => {
          runStdout += data.toString();
        });

        runProcess.stderr.on('data', (data) => {
          runStderr += data.toString();
        });

        runProcess.on('close', (exitCode) => {
          clearTimeout(timeout);
          try {
            if (fs.existsSync(cppFile)) fs.unlinkSync(cppFile);
            if (fs.existsSync(exeFile)) fs.unlinkSync(exeFile);
          } catch (e) {
            console.error('Cleanup error:', e);
          }

          if (exitCode !== 0) {
            return res.json({ 
              success: false, 
              error: 'Runtime Error',
              output: runStderr || `Process exited with code ${exitCode}` 
            });
          }

          // Store custom output and run test cases
          const customOutput = runStdout;
          
          // Now run test cases
          if (question && question.testCases) {
            runTestCasesAndRespond(code, question, customInput, customOutput, res, tempDir);
          } else {
            res.json({ 
              success: true, 
              output: customOutput,
              customInput: customInput,
              customOutput: customOutput,
              validation: { passed: true, details: [] }
            });
          }
        });

        runProcess.on('error', (error) => {
          clearTimeout(timeout);
          try {
            if (fs.existsSync(cppFile)) fs.unlinkSync(cppFile);
            if (fs.existsSync(exeFile)) fs.unlinkSync(exeFile);
          } catch (e) {
            console.error('Cleanup error:', e);
          }
          return res.json({ 
            success: false, 
            error: 'Execution Error',
            output: error.message 
          });
        });
      });
    }
    else if (!question || !question.testCases) {
      // If no test cases, just run the code normally
      const timestamp = Date.now();
      const cppFile = path.join(tempDir, `solution_${timestamp}.cpp`);
      const exeFile = path.join(tempDir, `solution_${timestamp}.exe`);

      fs.writeFileSync(cppFile, String(code));

      exec(`g++ "${cppFile}" -o "${exeFile}"`, (compileError, compileStdout, compileStderr) => {
        if (compileError) {
          fs.unlinkSync(cppFile);
          return res.json({ 
            success: false, 
            error: 'Compilation Error',
            output: compileStderr 
          });
        }

        const runProcess = spawn(exeFile, [], { windowsHide: true });
        let runStdout = '';
        let runStderr = '';

        const timeout = setTimeout(() => {
          runProcess.kill();
          try {
            if (fs.existsSync(cppFile)) fs.unlinkSync(cppFile);
            if (fs.existsSync(exeFile)) fs.unlinkSync(exeFile);
          } catch (e) {
            console.error('Cleanup error:', e);
          }
          return res.json({ 
            success: false, 
            error: 'Timeout Error',
            output: 'Program execution timed out after 5 seconds' 
          });
        }, 5000);

        runProcess.stdout.on('data', (data) => {
          runStdout += data.toString();
        });

        runProcess.stderr.on('data', (data) => {
          runStderr += data.toString();
        });

        runProcess.on('close', (exitCode) => {
          clearTimeout(timeout);
          try {
            if (fs.existsSync(cppFile)) fs.unlinkSync(cppFile);
            if (fs.existsSync(exeFile)) fs.unlinkSync(exeFile);
          } catch (e) {
            console.error('Cleanup error:', e);
          }

          if (exitCode !== 0) {
            return res.json({ 
              success: false, 
              error: 'Runtime Error',
              output: runStderr || `Process exited with code ${exitCode}` 
            });
          }

          res.json({ 
            success: true, 
            output: runStdout,
            validation: { passed: true, details: [] }
          });
        });

        runProcess.on('error', (error) => {
          clearTimeout(timeout);
          try {
            if (fs.existsSync(cppFile)) fs.unlinkSync(cppFile);
            if (fs.existsSync(exeFile)) fs.unlinkSync(exeFile);
          } catch (e) {
            console.error('Cleanup error:', e);
          }
          return res.json({ 
            success: false, 
            error: 'Execution Error',
            output: error.message 
          });
        });
      });
    } else {
      // Run code against each test case individually
      const testResults = [];
      let allPassed = true;

      for (let i = 0; i < question.testCases.length; i++) {
        const testCase = question.testCases[i];
        const timestamp = Date.now() + i;
        const cppFile = path.join(tempDir, `solution_${timestamp}.cpp`);
        const exeFile = path.join(tempDir, `solution_${timestamp}.exe`);

        // Inject test case values into code
        const modifiedCode = injectTestCase(String(code), testCase);
        fs.writeFileSync(cppFile, modifiedCode);

        // Validate constraints before compilation
        const constraintCheck = validateConstraints(code, question);
        if (!constraintCheck.passed) {
          testResults.push({
            testCase: i + 1,
            input: testCase.input,
            expected: testCase.expected,
            actual: 'Constraint Violation',
            passed: false,
            error: `Constraint Error: ${constraintCheck.error}`
          });
          allPassed = false;
          continue;
        }

        // Compile
        try {
          await new Promise((resolve, reject) => {
            exec(`g++ "${cppFile}" -o "${exeFile}"`, (compileError, compileStdout, compileStderr) => {
              if (compileError) {
                fs.unlinkSync(cppFile);
                reject({ error: 'Compilation Error', output: compileStderr });
              } else {
                resolve();
              }
            });
          });

          // Run
          const runOutput = await new Promise((resolve, reject) => {
            const runProcess = spawn(exeFile, [], { windowsHide: true });
            let runStdout = '';
            let runStderr = '';

            const timeout = setTimeout(() => {
              runProcess.kill();
              reject({ error: 'Timeout Error', output: 'Program execution timed out after 5 seconds' });
            }, 5000);

            runProcess.stdout.on('data', (data) => {
              runStdout += data.toString();
            });

            runProcess.stderr.on('data', (data) => {
              runStderr += data.toString();
            });

            runProcess.on('close', (code) => {
              clearTimeout(timeout);
              if (code !== 0) {
                reject({ error: 'Runtime Error', output: runStderr || `Process exited with code ${code}` });
              } else {
                resolve(runStdout);
              }
            });

            runProcess.on('error', (error) => {
              clearTimeout(timeout);
              reject({ error: 'Execution Error', output: error.message });
            });
          });

          // Parse and validate output
          const userOutput = parseOutput(runOutput);
          const passed = validateOutput(userOutput, testCase.expected);

          testResults.push({
            testCase: i + 1,
            input: testCase.input,
            expected: testCase.expected,
            actual: userOutput,
            passed: passed
          });

          if (!passed) allPassed = false;

        } catch (error) {
          testResults.push({
            testCase: i + 1,
            input: testCase.input,
            expected: testCase.expected,
            actual: error.output || 'Error',
            passed: false
          });
          allPassed = false;
        } finally {
          // Cleanup
          try {
            if (fs.existsSync(cppFile)) fs.unlinkSync(cppFile);
            if (fs.existsSync(exeFile)) fs.unlinkSync(exeFile);
          } catch (e) {
            console.error('Cleanup error:', e);
          }
        }
      }

      res.json({ 
        success: allPassed, 
        output: allPassed ? 'All test cases passed!' : 'Some test cases failed',
        validation: {
          passed: allPassed,
          details: testResults
        }
      });
    }
  } catch (error) {
    res.json({ 
      success: false, 
      error: 'Server Error',
      output: error.message 
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});