import React, { useState } from 'react';

// === Configuration and Constants ===
const MAX_RETRIES = 3;

// === Inline SVG Icons ===
const LightbulbIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M15 14c.2-.8.8-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 5c0 1.3.5 2.6 1.5 3.5.7.8 1.3 1.7 1.5 2.5"/>
    <path d="M9 18h6"/>
    <path d="M10 22h4"/>
    <path d="M12 21v1"/>
  </svg>
);

const RotateCwIcon = ({ className, size = 24 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M21.5 2v6h-6"/>
    <path d="M2.5 22v-6h6"/>
    <path d="M21.5 8a10 10 0 0 0-17.9-5.4M2.5 16a10 10 0 0 0 17.9 5.4"/>
  </svg>
);

const CopyIcon = ({ size = 24 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="14" height="14" x="8" y="8" rx="2" ry="2"/>
    <path d="M4 16c-1.1-1.1-2-2-2-4V4c0-1.1.9-2 2-2h4c1.1 0 2 .9 2 2"/>
  </svg>
);

const CheckIcon = ({ size = 24, color = "currentColor" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 6 9 17l-5-5"/>
  </svg>
);

// Base styling
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap');

  .app-container {
    min-height: 100vh;
    background-color: #f3f4f6; /* light gray background */
    color: #1f2937; /* dark text */
    font-family: 'Inter', sans-serif;
    padding: 16px;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .main-card {
    width: 100%;
    max-width: 896px; /* max-w-4xl equivalent */
    background-color: #ffffff;
    border-radius: 16px; /* rounded-2xl */
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05); /* shadow-xl */
    padding: 32px;
    transition: all 0.3s ease-in-out;
  }

  .header-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-bottom: 24px;
  }

  .icon-lightbulb {
    width: 48px;
    height: 48px;
    color: yellow; /* blue-500 */
    margin-bottom: 8px;
  }

  .title {
    font-size: 2rem; /* 3xl/4xl */
    font-weight: 700;
    text-align: center;
  }

  .subtitle {
    font-size: 0.875rem; /* text-sm */
    text-align: center;
    color: #6b7280; /* gray-500 */
    margin-top: 8px;
  }

  .input-group {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 16px;
    margin-bottom: 24px;
  }

  .input-field {
    flex-grow: 1;
    padding: 12px;
    border-radius: 8px; /* rounded-lg */
    border: 1px solid #d1d5db; /* border-gray-300 */
    background-color: #f9fafb; /* gray-50 */
    color: #1f2937;
    outline: none;
    transition: border-color 0.3s, box-shadow 0.3s;
  }

  .input-field:focus {
    border-color: #3b82f6; /* blue-500 */
    box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.5);
  }

  .generate-button {
    width: 100%;
    padding: 12px 24px;
    background-color:yellow; /* blue-600 */
    color: black;
    font-weight: 600;
    border-radius: 8px;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
    cursor: pointer;
    transition: background-color 0.3s, opacity 0.3s;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    border: none;
  }

  .generate-button:hover:not(:disabled) {
    background-color: white; /* blue-700 */
  }

  .generate-button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .error-message {
    background-color: #ef4444; /* red-500 */
    color: white;
    padding: 12px;
    border-radius: 8px;
    text-align: center;
    margin-bottom: 16px;
  }

  .roadmap-output {
    margin-top: 32px;
    border-top: 1px solid #e5e7eb; /* border-gray-200 */
    padding-top: 24px;
    position: relative;
  }

  .roadmap-title {
    font-size: 1.5rem; /* 2xl */
    font-weight: 700;
    margin-bottom: 16px;
  }

  .copy-button {
    position: absolute;
    top: 24px;
    right: 0;
    color: #6b7280; /* gray-500 */
    cursor: pointer;
    transition: color 0.3s;
    background: none;
    border: none;
    padding: 4px;
    border-radius: 4px;
  }

  .copy-button:hover {
    color: #3b82f6; /* blue-500 */
  }

  .stage-container {
    margin-top: 32px;
  }

  .stage-card {
    background-color: black; /* gray-50 */
    border-radius: 12px; /* rounded-xl */
    padding: 24px;
    box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05); /* shadow-sm */
    border: 1px solid #e5e7eb; /* border-gray-200 */
    transition: all 0.3s;
  }

  .stage-card + .stage-card {
    margin-top: 24px;
  }

  .stage-card-title {
    font-size: 1.25rem; /* xl */
    font-weight: 600;
    color: yellow; /* blue-500 */
    margin-bottom: 16px;
  }

  .topic-list {
    list-style: none;
    padding: 0;
    margin: 0;
  }

  .topic-item {
    display: flex;
    align-items: flex-start;
    gap: 8px;
    line-height: 1.6;
    color:white; /* gray-700 */
  }

  .topic-item + .topic-item {
    margin-top: 12px;
  }

  .topic-arrow {
    color: red;
    flex-shrink: 0;
    margin-top: 4px; /* Adjusting for baseline alignment */
  }

  /* Responsive Adjustments */
  @media (min-width: 640px) {
    .input-group {
      flex-direction: row;
    }
    .title {
      font-size: 2.25rem; /* sm:text-4xl */
    }
    .generate-button {
      width: auto;
    }
  }
`;

const App = () => {
  const [subject, setSubject] = useState('');
  const [roadmap, setRoadmap] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [copyStatus, setCopyStatus] = useState('copy');
  const [error, setError] = useState(null);

  // Function to copy text to clipboard
  const copyToClipboard = (text) => {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    document.body.appendChild(textarea);
    textarea.select();
    try {
      document.execCommand('copy');
      setCopyStatus('copied');
      setTimeout(() => setCopyStatus('copy'), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
    document.body.removeChild(textarea);
  };

  const generateRoadmap = async () => {
    if (!subject.trim()) {
      setError("Please enter a subject to generate a roadmap.");
      return;
    }
    setIsLoading(true);
    setRoadmap(null);
    setError(null);
    setCopyStatus('copy');

    // API Payload configuration (remains the same)
    const payload = {
      contents: [{
        parts: [{
          text: `Generate a detailed learning roadmap for "${subject}" from basic to advanced topics. The output should be a JSON array of objects. Each object should have a "stage" (e.g., "Beginner", "Intermediate", "Advanced", "Expert") and a "topics" property, which is an array of strings. For each topic, provide a concise, single-sentence description. Ensure the roadmap is comprehensive and well-structured. Do not include any text outside the JSON object.`
        }]
      }],
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: {
          type: "ARRAY",
          items: {
            type: "OBJECT",
            properties: {
              "stage": { "type": "STRING" },
              "topics": {
                "type": "ARRAY",
                "items": { "type": "STRING" }
              }
            },
            "propertyOrdering": ["stage", "topics"]
          }
        }
      },
    };

    // key
  const apiKey = import.meta.env.VITE_GEMINI_KEY
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent?key=${apiKey}`;

    for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
      try {
        const response = await fetch(apiUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        });

        // --- Check for 403 Forbidden specifically ---
        if (response.status === 403) {
            setError("Authentication Error (403): The API request was forbidden. If running locally, please ensure you have replaced the empty apiKey variable with your personal Gemini API key.");
            setIsLoading(false);
            return; // Exit immediately on known fatal error
        }

        if (!response.ok) {
          throw new Error(`API returned HTTP error ${response.status}: ${response.statusText}`);
        }

        const result = await response.json();
        let rawText = result?.candidates?.[0]?.content?.parts?.[0]?.text;
        
        if (rawText) {
            // CRITICAL FIX: Clean the raw text before parsing (remove markdown fences)
            let cleanedText = rawText.trim();
            if (cleanedText.startsWith('```json')) {
              cleanedText = cleanedText.substring(7);
            }
            if (cleanedText.endsWith('```')) {
              cleanedText = cleanedText.substring(0, cleanedText.length - 3);
            }
            cleanedText = cleanedText.trim();

            try {
                const parsedRoadmap = JSON.parse(cleanedText);
                setRoadmap(parsedRoadmap);
                setIsLoading(false);
                console.log("Roadmap generated successfully on attempt:", attempt + 1);
                return; // Exit the function on success
            } catch (e) {
                console.error("JSON Parsing Error (Attempt " + (attempt + 1) + "):", e);
                console.error("Raw text that failed parsing:", rawText);
                throw new Error("Failed to parse the structured JSON response from the AI.");
            }
        } else {
            throw new Error("Empty or invalid response structure from API.");
        }

      } catch (err) {
        console.error(`Attempt ${attempt + 1} of ${MAX_RETRIES} failed for subject "${subject}".`, err.message);

        if (attempt === MAX_RETRIES - 1) {
          // Final attempt failed
          setError("Failed to generate a roadmap after multiple retries. The issue may be related to network connectivity or model availability.");
        } else {
          // Wait using exponential backoff before the next retry
          const delay = Math.pow(2, attempt) * 1000; // 1s, 2s, 4s...
          await new Promise(resolve => setTimeout(resolve, delay));
        }
      }
    }
    
    setIsLoading(false);
  };

  const formatRoadmapForCopy = () => {
    if (!roadmap) return "";
    let formattedText = `# Roadmap for ${subject}\n\n`;
    roadmap.forEach(stage => {
      formattedText += `## ${stage.stage}\n`;
      stage.topics.forEach(topic => {
        formattedText += `- ${topic}\n`;
      });
      formattedText += "\n";
    });
    return formattedText;
  };

  return (
    <div className="app-container">
      <style>{styles}</style> {/* Injecting the plain CSS */}
      <div className="main-card">
        <div className="header-content">
          <LightbulbIcon className="icon-lightbulb" />
          <h1 className="title">Dynamic Roadmap Generator By Dixit</h1>
          <p className="subtitle">
            Enter any subject and get a comprehensive learning roadmap from basic to advanced.
          </p>
        </div>

        <div className="input-group">
          <input
            type="text"
            className="input-field"
            placeholder="e.g., Web Development, Machine Learning, UI/UX Design..."
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                generateRoadmap();
              }
            }}
          />
          <button
            onClick={generateRoadmap}
            disabled={isLoading}
            className="generate-button"
          >
            {isLoading ? (
              <>
                <RotateCwIcon size={20} style={{ animation: 'spin 1s linear infinite' }} /> Retrying...
                <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
              </>
            ) : (
              'Generate Roadmap'
            )}
          </button>
        </div>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        {roadmap && (
          <div className="roadmap-output">
            <h2 className="roadmap-title">Roadmap for {subject}</h2>
            <button
              onClick={() => copyToClipboard(formatRoadmapForCopy())}
              className="copy-button"
              title="Copy to Clipboard"
            >
              {copyStatus === 'copy' ? <CopyIcon size={20} /> : <CheckIcon size={20} color="#3b82f6" />}
            </button>
            <div className="stage-container">
              {roadmap.map((stage, index) => (
                <div key={index} className="stage-card">
                  <h3 className="stage-card-title">{stage.stage}</h3>
                  <ul className="topic-list">
                    {stage.topics.map((topic, topicIndex) => (
                      <li key={topicIndex} className="topic-item">
                        <span className="topic-arrow">&rarr;</span>
                        <p>{topic}</p>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
