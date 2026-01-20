import { useState } from 'react'
import Editor from 'react-simple-code-editor';
import { highlight, languages } from 'prismjs/components/prism-core';
import 'prismjs/components/prism-clike';
import 'prismjs/components/prism-javascript';
import 'prismjs/themes/prism-tomorrow.css';
import { Flame, Loader2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';


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

      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

      const response = await fetch(`${API_URL}/roast`, requestData);

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
      </div>

      <div className="card">
        <h2 style={{ marginTop: 0, color: '#94a3b8' }}>The Verdict:</h2>

        <div style={{
          color: '#cbd5e1',
          lineHeight: '1.6',
          fontSize: '0.95rem'
        }}>
          {isLoading ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Loader2 className="animate-spin" />
              <span>Analyzing your spaghetti...</span>
            </div>
          ) : roast ? (
            // 2. Replace the text div with ReactMarkdown
            <ReactMarkdown
              components={{
                // Optional: Custom styling for code blocks inside the roast
                code({ node, inline, className, children, ...props }) {
                  return !inline ? (
                    <div style={{
                      background: '#0f172a',
                      padding: '10px',
                      borderRadius: '6px',
                      overflowX: 'auto',
                      margin: '10px 0'
                    }}>
                      <code {...props}>{children}</code>
                    </div>
                  ) : (
                    <code style={{ background: '#334155', padding: '2px 4px', borderRadius: '4px' }} {...props}>
                      {children}
                    </code>
                  )
                }
              }}
            >
              {roast}
            </ReactMarkdown>
          ) : (
            <p style={{ opacity: 0.5 }}>Waiting for your code snippet...</p>
          )}
        </div>
      </div>
    </div>
  )
}

export default App
