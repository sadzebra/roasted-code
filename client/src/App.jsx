import { useState } from 'react'
import Editor from 'react-simple-code-editor';
import { highlight, languages } from 'prismjs/components/prism-core';
import 'prismjs/components/prism-clike';
import 'prismjs/components/prism-javascript';
import 'prismjs/themes/prism-tomorrow.css';
import { Flame, Loader2, UserStar } from 'lucide-react';


function App() {
  const [code, setCode] = useState(`console.log('code gones here');`);
  const [roast, setRoast] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleRoast = async () => {
    setIsLoading(true);
    setRoast("");

    try {
      const requestData = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          code: code,
          language: 'javascript'
        }),
      };

      const response = await fetch("http://localhost:3000/roast", requestData)

      if (!response.ok) {
        throw new Error("Response was not okay");
      }

      const data = await response.json();
      setRoast(data.roast);
    }
    catch (error) {
      console.log(`something went wrong, error message: ${error.message}`);
      setRoast("Something went wrong with the response");
    }
    finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="container">
      <header>
        <h1>🔥 Roast My <span>Code</span></h1>
        <p>AI-powered feedback for code that needs help.</p>
      </header>

      <div className="main-grid">
        {/* Left Column: Input */}
        <div className="card">
          <div className="editor-wrapper">
            <Editor
              value={code}
              onValueChange={code => setCode(code)}
              highlight={code => highlight(code, languages.js)}
              padding={15}
              style={{
                fontFamily: '"Fira code", "Fira Mono", monospace',
                fontSize: 14,
                minHeight: '100%',
              }}
            />
          </div>
          <button
            className="btn-roast"
            onClick={handleRoast}
            disabled={isLoading}
          >
            {isLoading ? <Loader2 className="animate-spin" /> : <Flame />}
            {isLoading ? "Roasting..." : "Roast Me!"}
          </button>
        </div>

        {/* Right Column: Output */}
        <div className="card">
          <h2 style={{ marginTop: 0, color: '#94a3b8' }}>The Verdict:</h2>
          <div style={{ color: '#cbd5e1', lineHeight: '1.6' }}>
            {roast || "Waiting for your code snippet..."}
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
