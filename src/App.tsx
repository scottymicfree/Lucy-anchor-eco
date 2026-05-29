/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';

type Sender = 'system' | 'lucy' | 'grok' | 'agent' | 'user';

interface Message {
  id: string;
  sender: Sender;
  text: string;
}

const AGENTS = ["🧠 Lucy", "🛡️ Emma", "🔍 ThinkTank", "⚡ TaskFlow", "🔗 Grok Coach", "🛠️ HelixStudio"];

export default function App() {
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', sender: 'system', text: 'Phase 2 Active — HelixStudio connected.' },
    { id: '2', sender: 'lucy', text: "Good morning, Scott. I can now import repos and work on them with Grok Coach." }
  ]);
  const [inputText, setInputText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentRepoPath, setCurrentRepoPath] = useState<string | null>(null);
  
  // Custom Modal State
  const [showImportModal, setShowImportModal] = useState(false);
  const [importUrl, setImportUrl] = useState('');

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const addMessage = (sender: Sender, text: string) => {
    setMessages(prev => [...prev, { id: Date.now().toString() + Math.random(), sender, text }]);
  };

  const handleImportRepoSubmit = () => {
    if (!importUrl.trim()) return;
    const url = importUrl.trim();
    setShowImportModal(false);
    setImportUrl('');
    
    addMessage('system', `Cloning ${url}...`);
    setIsProcessing(true);

    // Simulate clone repo thread
    setTimeout(() => {
      try {
        const repoName = url.split('/').pop()?.replace('.git', '') || 'unknown_repo';
        const path = `./repos/${repoName}`;
        
        // In a real local app, this would check os.path.exists
        // Since we are maintaining browser isolation, we simulate the state
        if (currentRepoPath === path) {
           addMessage('system', 'Repo already exists.');
           setIsProcessing(false);
           return;
        }

        setCurrentRepoPath(path);
        addMessage('lucy', `Successfully imported ${repoName}. Ready to analyze.`);
        setIsProcessing(false);
      } catch (e: any) {
        addMessage('system', `Error cloning: ${e.message}`);
        setIsProcessing(false);
      }
    }, 1500); // Simulated clone delay
  };

  const handleAskLucyToFix = () => {
    if (!currentRepoPath) {
      addMessage('system', "No repo loaded. Import one first.");
      return;
    }
    addMessage('lucy', "Analyzing repo with HelixStudio... Consulting Grok Coach for fixes.");
    setIsProcessing(true);

    // Simulate analyze and fix thread
    setTimeout(() => {
      addMessage('grok', "Grok here. I can see common issues in many repos. What specific problems are you seeing? (errors, incomplete features, etc.)");
      setIsProcessing(false);
    }, 1500);
  };

  const handleSend = () => {
    const text = inputText.trim();
    if (!text || isProcessing) return;

    addMessage('user', text);
    setInputText('');
    
    addMessage('lucy', "Processing request with HelixStudio + Grok Coach...");
    setIsProcessing(true);

    // Simulate process request thread
    setTimeout(() => {
      const keywords = ["fix", "error", "broken", "help", "improve"];
      const containsTarget = keywords.some(k => text.toLowerCase().includes(k));

      if (currentRepoPath && containsTarget) {
        addMessage('lucy', "Reading code files...");
        setTimeout(() => {
          addMessage('grok', "This is Grok. Send me the problematic file or error message and I'll give you the exact fix.");
          setIsProcessing(false);
        }, 1000);
      } else {
        addMessage('lucy', "Understood. Working with team.");
        setIsProcessing(false);
      }
    }, 1200);
  };

  const getMessageColor = (sender: Sender) => {
    switch(sender) {
      case 'system': return 'text-[#8888ff]';
      case 'lucy': return 'text-[#00f5ff]';
      case 'grok': return 'text-[#ff88ff]';
      case 'agent': return 'text-[#88ffaa]';
      case 'user': return 'text-white';
      default: return 'text-[#e0e0ff]';
    }
  };

  const getPrefix = (sender: Sender) => {
    return `[${sender.toUpperCase()}]`;
  };

  return (
    <div className="flex h-screen w-full bg-[#0a0a0f] text-white font-sans overflow-hidden py-3">
      {/* Sidebar */}
      <div className="w-[300px] bg-[#111118] ml-3 p-4 flex flex-col rounded shadow-2xl shrink-0">
        <div className="mt-6 mb-1">
          <h1 className="text-[#00f5ff] text-[20px] font-bold">LUCY ANCHOR</h1>
        </div>
        <div className="mb-8">
          <h2 className="text-[#666677] text-[13px]">Helix Protocol • Phase 2</h2>
        </div>

        <div className="flex-1 overflow-y-auto">
          {AGENTS.map((agent, i) => (
            <div key={i} className="bg-[#1a1a22] rounded py-[6px] px-[14px] mb-[12px] flex items-center">
              <span className="text-[#00f5ff] font-bold text-[15px]">{agent}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Main Area */}
      <div className="flex-1 flex flex-col bg-[#0f0f17] mx-3 rounded overflow-hidden relative border border-[#1a1a22]">
        <div className="py-3 items-center flex justify-center">
          <h2 className="text-[#00f5ff] text-[18px] font-bold py-3">HELIXSTUDIO WORKSPACE</h2>
        </div>

        {/* Workspace Log */}
        <div className="flex-1 px-[14px] py-[8px] overflow-y-auto font-mono text-[13px] leading-relaxed bg-[#0f0f17] whitespace-pre-wrap shrink">
          {messages.map((msg) => (
            <div key={msg.id} className="mb-[15px]">
              <span className={getMessageColor(msg.sender)}>
                {getPrefix(msg.sender)} {msg.text}
              </span>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Controls Frame */}
        <div className="bg-[#111118] px-[14px] py-[8px] flex gap-5 shrink-0">
           <button 
             onClick={() => setShowImportModal(true)}
             disabled={isProcessing}
             className="bg-[#00b8ff] hover:bg-[#00b8ff]/80 text-black px-4 py-2 w-[180px] font-bold font-sans text-[13px] rounded transition-colors disabled:opacity-50 tracking-wide cursor-pointer flex items-center justify-center"
           >
             Import GitHub Repo
           </button>
           <button 
             onClick={handleAskLucyToFix}
             disabled={isProcessing}
             className="bg-[#ff8800] hover:bg-[#ff8800]/80 text-black px-4 py-2 w-[180px] font-bold font-sans text-[13px] rounded transition-colors disabled:opacity-50 tracking-wide cursor-pointer flex items-center justify-center"
           >
             Ask Lucy to Fix Repo
           </button>
        </div>

        {/* Input Frame */}
        <div className="bg-[#111118] px-[14px] pb-[12px] pt-[4px] shrink-0">
          <div className="flex items-center gap-[14px] h-[45px]">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Talk to Lucy or describe repo issue..."
              disabled={isProcessing}
              className="flex-1 bg-white/5 text-white px-[14px] h-full rounded outline-none focus:outline-1 focus:outline-[#00b8ff] transition-colors disabled:opacity-50 font-sans text-[14px] tracking-wide"
            />
            <button
              onClick={handleSend}
              disabled={isProcessing || !inputText.trim()}
              className="bg-[#00b8ff] hover:bg-[#00b8ff]/80 text-black text-[14px] h-full font-sans px-4 rounded w-[140px] transition-colors disabled:opacity-50 tracking-wide font-medium flex items-center justify-center cursor-pointer"
            >
              SEND
            </button>
          </div>
        </div>
      </div>

      {/* Custom Dialog for GitHub Import */}
      {showImportModal && (
        <div className="absolute inset-0 bg-black/60 z-50 flex justify-center items-center backdrop-blur-sm">
           <div className="bg-[#111118] min-w-[400px] border border-[#1a1a22] rounded shadow-2xl p-6">
              <h3 className="text-white text-[16px] font-bold mb-4 font-sans">Import GitHub Repo</h3>
              <p className="text-[#666677] text-[13px] mb-4">Enter GitHub repo URL:</p>
              <input 
                 autoFocus
                 type="text" 
                 value={importUrl}
                 onChange={e => setImportUrl(e.target.value)}
                 onKeyDown={e => e.key === 'Enter' && handleImportRepoSubmit()}
                 className="w-full bg-[#0a0a0f] text-white p-3 rounded outline-none focus:outline-1 focus:outline-[#00b8ff] border border-white/10 mb-6 font-mono text-[13px]"
                 placeholder="https://github.com/..."
              />
              <div className="flex justify-end gap-3">
                 <button 
                   onClick={() => setShowImportModal(false)}
                   className="px-5 py-2 text-[#666677] hover:text-white transition-colors"
                 >
                   Cancel
                 </button>
                 <button 
                   onClick={handleImportRepoSubmit}
                   className="px-5 py-2 bg-[#00b8ff] hover:bg-[#00b8ff]/80 text-black font-bold rounded transition-colors"
                 >
                   Import
                 </button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
}
