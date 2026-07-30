# 🚀 Code Quest - Modern C++ IDE

A beautiful, LeetCode-style C++ IDE built with React and Node.js. Perfect for beginners and experienced developers to practice C++ coding challenges.

## ✨ Features

- **Modern UI**: Glass-morphism design with gradient animations
- **Split-screen Layout**: Questions on the left, code editor on the right
- **Monaco Editor**: Professional code editing experience with syntax highlighting
- **Real-time Compilation**: Compile and run C++ code instantly
- **Multiple Challenges**: Pre-loaded with classic coding problems
- **Difficulty Levels**: Easy, Medium, and Hard problems
- **Output Display**: See compilation errors and program output
- **Responsive Design**: Works on desktop and tablet devices

## 🎨 UI Highlights

- Dark theme with purple/cyan gradient accents
- Animated elements and hover effects
- Glass-card components with blur effects
- Neon borders and glowing effects
- Smooth transitions and animations

## 📋 Prerequisites

- **Node.js** (v16 or higher)
- **g++ compiler** (MinGW on Windows, Xcode Command Line Tools on Mac, or build-essential on Linux)
- **npm** or **yarn**

## 🛠️ Installation

1. **Clone or navigate to the project directory**
   ```bash
   cd cpp-ide
   ```

2. **Install root dependencies**
   ```bash
   npm install
   ```

3. **Install backend dependencies**
   ```bash
   cd backend
   npm install
   cd ..
   ```

4. **Install frontend dependencies**
   ```bash
   cd frontend
   npm install
   cd ..
   ```

## 🚀 Running the Application

### Option 1: Run both servers simultaneously (Recommended)
```bash
npm run dev
```

### Option 2: Run separately

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## 📁 Project Structure

```
cpp-ide/
├── backend/
│   ├── server.js          # Express server with C++ compilation
│   ├── package.json       # Backend dependencies
│   └── temp/              # Temporary compilation files (auto-created)
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Header.jsx
│   │   │   ├── QuestionPanel.jsx
│   │   │   ├── CodeEditor.jsx
│   │   │   └── OutputPanel.jsx
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── package.json
└── package.json
```

## 🔧 How It Works

1. **Frontend (React + Vite)**
   - Displays coding challenges in a split-screen layout
   - Monaco Editor provides professional code editing
   - Tailwind CSS creates the modern, attractive UI
   - Axios communicates with the backend API

2. **Backend (Node.js + Express)**
   - Serves coding challenges via REST API
   - Receives C++ code from the frontend
   - Compiles code using g++ compiler
   - Executes the compiled program
   - Returns output or errors to the frontend

## 🎯 Available Challenges

1. **Two Sum** (Easy) - Find two numbers that add up to target
2. **Palindrome Number** (Easy) - Check if a number is a palindrome
3. **Reverse Integer** (Medium) - Reverse digits of an integer

## 🎮 Usage

1. Select a challenge from the top bar
2. Read the problem description and examples
3. Write your solution in the code editor
4. Click "Run Code" to compile and execute
5. View the output in the output panel
6. Use "Reset" to restore the starter code

## ⚙️ Customization

### Adding New Questions

Edit `backend/server.js` and add to the `questions` array:

```javascript
{
  id: 4,
  title: "Your Problem Title",
  difficulty: "Easy",
  description: "Problem description here",
  examples: [
    { input: "example input", output: "example output" }
  ],
  starterCode: `// Your starter C++ code here`,
  testCases: [
    { input: /* test input */, expected: /* expected output */ }
  ]
}
```

### Changing the Theme

Edit `frontend/tailwind.config.js` to customize colors and animations.

## 🐛 Troubleshooting

**g++ not found:**
- Windows: Install MinGW-w64 and add to PATH
- Mac: Install Xcode Command Line Tools: `xcode-select --install`
- Linux: Install build-essential: `sudo apt install build-essential`

**Port already in use:**
- Change port in `backend/server.js` (line 8)
- Change port in `frontend/vite.config.js` (line 6)

**Compilation errors:**
- Ensure g++ is properly installed
- Check that the code syntax is correct
- View error messages in the output panel

## 📝 Technologies Used

- **Frontend**: React 18, Vite, Tailwind CSS, Monaco Editor, Lucide Icons
- **Backend**: Node.js, Express, CORS
- **Compilation**: g++ (GNU C++ Compiler)

## 🎓 Learning Resources

- [C++ Reference](https://en.cppreference.com/)
- [LeetCode](https://leetcode.com/)
- [Monaco Editor Documentation](https://microsoft.github.io/monaco-editor/)

## 📄 License

This project is open source and available for educational purposes.

---

**Happy Coding! 🎉**
