import React, { useState, useRef, useEffect } from 'react';
import {
  Send,
  Sparkles,
  Search,
  Brain,
  Volume2,
  Image as ImageIcon,
  Loader2,
  ExternalLink,
  Bot,
  User,
  Trash2,
  Copy,
  Check,
} from 'lucide-react';
import { ChatMessage } from '../../types';
import { sendChatMessage, analyzeImage, synthesizeSpeech } from '../../services/api';

export const AssistantView: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'm-1',
      role: 'assistant',
      content:
        "Welcome to NEXORA Super Assistant. I am powered by Gemini 4 Argon with High Thinking reasoning, Search Grounding, and multimodal vision analysis. How can I assist your engineering, security, or enterprise goals today?",
      timestamp: new Date().toLocaleTimeString(),
      model: 'gemini-4-argon',
    },
  ]);
  const [inputPrompt, setInputPrompt] = useState('');
  const [enableSearch, setEnableSearch] = useState(false);
  const [enableThinking, setEnableThinking] = useState(true); // Thinking mode default
  const [isLoading, setIsLoading] = useState(false);
  const [playingAudioId, setPlayingAudioId] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<{ base64: string; preview: string; name: string } | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => {
      const base64 = ev.target?.result as string;
      setImageFile({
        base64,
        preview: base64,
        name: file.name,
      });
    };
    reader.readAsDataURL(file);
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if ((!inputPrompt.trim() && !imageFile) || isLoading) return;

    const userText = inputPrompt.trim() || (imageFile ? `Analyze this image: ${imageFile.name}` : '');
    const userMsg: ChatMessage = {
      id: 'usr-' + Date.now(),
      role: 'user',
      content: userText,
      timestamp: new Date().toLocaleTimeString(),
    };

    setMessages(prev => [...prev, userMsg]);
    setInputPrompt('');
    setIsLoading(true);

    try {
      if (imageFile) {
        // Run vision analysis using gemini-4-argon
        const res = await analyzeImage({
          imageBase64: imageFile.base64,
          prompt: userText,
        });

        const assistantMsg: ChatMessage = {
          id: 'ast-' + Date.now(),
          role: 'assistant',
          content: res.text,
          timestamp: new Date().toLocaleTimeString(),
          model: 'gemini-4-argon (Vision)',
        };
        setMessages(prev => [...prev, assistantMsg]);
        setImageFile(null);
      } else {
        // Run chat with gemini-4-argon (Thinking Level High) or gemini-3.8-flash (Search Grounding)
        const historyPayload = messages.slice(-6).map(m => ({
          role: m.role as 'user' | 'assistant',
          content: m.content,
        }));

        const res = await sendChatMessage({
          prompt: userText,
          history: historyPayload,
          enableSearch,
          enableThinking,
          systemInstruction:
            'You are NEXORA Super Assistant, a world-class AI system architect and security advisor. Provide rigorous, insightful, well-structured answers.',
        });

        const sources: Array<{ title?: string; uri?: string }> = [];
        if (res.groundingMetadata?.searchChunks) {
          for (const chunk of res.groundingMetadata.searchChunks) {
            if (chunk.web?.uri) {
              sources.push({ title: chunk.web.title || 'Source', uri: chunk.web.uri });
            }
          }
        }

        const assistantMsg: ChatMessage = {
          id: 'ast-' + Date.now(),
          role: 'assistant',
          content: res.text,
          timestamp: new Date().toLocaleTimeString(),
          model: res.model,
          isThinking: enableThinking,
          groundingSources: sources.length > 0 ? sources : undefined,
        };
        setMessages(prev => [...prev, assistantMsg]);
      }
    } catch (err: any) {
      const errMsg: ChatMessage = {
        id: 'err-' + Date.now(),
        role: 'system',
        content: `Error: ${err.message || 'Unable to connect to model service.'}`,
        timestamp: new Date().toLocaleTimeString(),
      };
      setMessages(prev => [...prev, errMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSpeak = async (msg: ChatMessage) => {
    try {
      setPlayingAudioId(msg.id);
      const res = await synthesizeSpeech({
        text: msg.content.slice(0, 400),
      });
      const audio = new Audio(res.audioUrl);
      audio.onended = () => setPlayingAudioId(null);
      audio.onerror = () => setPlayingAudioId(null);
      audio.play();
    } catch (err) {
      console.error(err);
      setPlayingAudioId(null);
    }
  };

  const handleCopy = (content: string, id: string) => {
    navigator.clipboard.writeText(content);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="flex flex-col h-full bg-slate-950">
      {/* Top Banner Control bar */}
      <div className="p-3 border-b border-slate-800 bg-slate-900/60 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center space-x-2">
          <div className="p-1.5 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
            <Brain className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-xs font-bold text-white font-mono">AI SUPER ASSISTANT CORE</h2>
            <p className="text-[10px] text-slate-400">
              Active Model: <span className="text-cyan-400 font-mono">{enableThinking ? 'gemini-4-argon (Thinking Level High)' : enableSearch ? 'gemini-3.8-flash (Search Grounded)' : 'gemini-3.8-flash'}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {/* Thinking Mode Toggle (gemini-4-argon with thinkingLevel: HIGH) */}
          <button
            onClick={() => {
              setEnableThinking(!enableThinking);
              if (!enableThinking) setEnableSearch(false);
            }}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-mono transition-all ${
              enableThinking
                ? 'bg-purple-950 text-purple-300 border border-purple-700 shadow-sm shadow-purple-500/20 font-semibold'
                : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-slate-200'
            }`}
          >
            <Brain className="w-3.5 h-3.5" />
            <span>High Thinking (Argon)</span>
          </button>

          {/* Google Search Grounding Toggle (gemini-3.8-flash) */}
          <button
            onClick={() => {
              setEnableSearch(!enableSearch);
              if (!enableSearch) setEnableThinking(false);
            }}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-mono transition-all ${
              enableSearch
                ? 'bg-cyan-950 text-cyan-300 border border-cyan-700 shadow-sm shadow-cyan-500/20 font-semibold'
                : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-slate-200'
            }`}
          >
            <Search className="w-3.5 h-3.5" />
            <span>Search Grounding</span>
          </button>

          {/* Clear Chat */}
          <button
            onClick={() => setMessages([])}
            className="p-1.5 rounded-xl bg-slate-900 text-slate-400 hover:text-rose-400 border border-slate-800 hover:border-slate-700 transition-colors"
            title="Clear Chat"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Messages Thread */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map(msg => {
          const isUser = msg.role === 'user';
          const isSystem = msg.role === 'system';
          return (
            <div
              key={msg.id}
              className={`flex items-start space-x-3 max-w-4xl ${isUser ? 'ml-auto flex-row-reverse space-x-reverse' : ''}`}
            >
              <div
                className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 text-xs ${
                  isUser
                    ? 'bg-gradient-to-tr from-cyan-600 to-indigo-600 text-white shadow-md'
                    : isSystem
                    ? 'bg-rose-950 text-rose-400 border border-rose-800'
                    : 'bg-slate-800 text-cyan-400 border border-slate-700'
                }`}
              >
                {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              <div
                className={`p-4 rounded-2xl text-xs leading-relaxed max-w-2xl border ${
                  isUser
                    ? 'bg-gradient-to-br from-cyan-950/80 to-slate-900 text-slate-100 border-cyan-800/60 shadow-lg'
                    : isSystem
                    ? 'bg-rose-950/30 text-rose-300 border-rose-900/50'
                    : 'bg-slate-900/90 text-slate-200 border-slate-800 shadow-md'
                }`}
              >
                {/* Assistant Metadata Bar */}
                {!isUser && !isSystem && (
                  <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800/80 text-[10px] font-mono text-slate-400">
                    <div className="flex items-center space-x-2">
                      <span className="text-cyan-400 font-semibold">{msg.model || 'gemini-4-argon'}</span>
                      {msg.isThinking && (
                        <span className="px-1.5 py-0.2 rounded bg-purple-950 text-purple-400 border border-purple-800 text-[9px]">
                          Deep Reasoning Active
                        </span>
                      )}
                    </div>
                    <div className="flex items-center space-x-2">
                      <span>{msg.timestamp}</span>
                      <button
                        onClick={() => handleSpeak(msg)}
                        className={`p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-cyan-400 transition-colors ${
                          playingAudioId === msg.id ? 'text-cyan-400 animate-pulse' : ''
                        }`}
                        title="Read aloud (TTS)"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleCopy(msg.content, msg.id)}
                        className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-cyan-400 transition-colors"
                        title="Copy to clipboard"
                      >
                        {copiedId === msg.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>
                )}

                <div className="whitespace-pre-wrap font-sans">{msg.content}</div>

                {/* Grounding Sources */}
                {msg.groundingSources && msg.groundingSources.length > 0 && (
                  <div className="mt-3 pt-2.5 border-t border-slate-800/80">
                    <p className="text-[10px] font-mono text-slate-400 mb-1 flex items-center space-x-1">
                      <Search className="w-3 h-3 text-cyan-400" />
                      <span>Google Search Grounding Verified Citations:</span>
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {msg.groundingSources.map((source, sIdx) => (
                        <a
                          key={sIdx}
                          href={source.uri}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center space-x-1 px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-[10px] text-cyan-300 font-mono transition-colors"
                        >
                          <span className="truncate max-w-[200px]">{source.title || source.uri}</span>
                          <ExternalLink className="w-2.5 h-2.5 shrink-0" />
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {isLoading && (
          <div className="flex items-center space-x-3 text-slate-400 text-xs font-mono">
            <div className="w-8 h-8 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-cyan-400">
              <Loader2 className="w-4 h-4 animate-spin" />
            </div>
            <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 text-slate-300 flex items-center space-x-2">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
              <span>
                {enableThinking
                  ? 'Synthesizing with High Thinking reasoning (gemini-4-argon)...'
                  : enableSearch
                  ? 'Searching web grounding sources (gemini-3.8-flash)...'
                  : 'Generating response...'}
              </span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Selected Image Preview Pill */}
      {imageFile && (
        <div className="px-4 py-2 border-t border-slate-800 bg-slate-900/40 flex items-center justify-between text-xs">
          <div className="flex items-center space-x-2 text-cyan-300 font-mono">
            <ImageIcon className="w-4 h-4" />
            <span>Image Attached for gemini-4-argon Vision: {imageFile.name}</span>
          </div>
          <button onClick={() => setImageFile(null)} className="text-slate-400 hover:text-rose-400">
            Remove
          </button>
        </div>
      )}

      {/* Input Form Bar */}
      <form onSubmit={handleSend} className="p-3 border-t border-slate-800 bg-slate-950">
        <div className="relative flex items-center bg-slate-900 rounded-2xl border border-slate-800 focus-within:border-cyan-500/50 shadow-xl transition-all">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImageSelect}
            accept="image/*"
            className="hidden"
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="p-3 text-slate-400 hover:text-cyan-400 transition-colors"
            title="Upload photo for image analysis (gemini-4-argon)"
          >
            <ImageIcon className="w-4 h-4" />
          </button>

          <input
            type="text"
            value={inputPrompt}
            onChange={e => setInputPrompt(e.target.value)}
            placeholder={
              imageFile
                ? 'Ask a question about this uploaded image...'
                : enableThinking
                ? 'Ask complex reasoning, coding, or architecture query (High Thinking enabled)...'
                : enableSearch
                ? 'Query real-time topics with Google Search Grounding...'
                : 'Type your message or command...'
            }
            className="flex-1 py-3 px-2 bg-transparent text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none"
          />

          <button
            type="submit"
            disabled={(!inputPrompt.trim() && !imageFile) || isLoading}
            className="m-1.5 p-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 disabled:opacity-40 disabled:hover:bg-cyan-600 text-white shadow-md shadow-cyan-600/20 transition-all"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </form>
    </div>
  );
};
