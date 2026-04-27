"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bot,
  Send,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  RefreshCw,
  Sparkles,
  User,
  Trash2,
  ChevronRight,
  Info
} from "lucide-react";
import { useLanguage } from "@/components/LanguageProvider";
import { SUPPORTED_LANGUAGES } from "@/lib/utils";

interface Message {
  role: "user" | "ai";
  content: string;
  timestamp: Date;
}

export default function AIAssistantPage() {
  const { language, t } = useLanguage();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [ttsEnabled, setTtsEnabled] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const recognitionRef = useRef<any>(null);

  // Initialize welcome message based on language
  useEffect(() => {
    setMessages([
      {
        role: "ai",
        content: t("ai_assistant.welcome_message"),
        timestamp: new Date(),
      },
    ]);
  }, [language]); // Re-welcome on language change

  // Stable scrolling for chat container
  useEffect(() => {
    if (scrollRef.current) {
      const container = scrollRef.current;
      container.scrollTo({
        top: container.scrollHeight,
        behavior: "smooth"
      });
    }
  }, [messages]);

  const sendMessage = async (text?: string) => {
    const messageText = text || input.trim();
    if (!messageText || loading) return;

    const userMsg: Message = {
      role: "user",
      content: messageText,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const history = messages.slice(-6).map((m) => ({
        role: m.role === "user" ? "user" : "assistant",
        content: m.content,
      }));

      const res = await fetch("/api/ai-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: messageText, language, history }),
      });

      const data = await res.json();
      console.log("AI Chat raw response:", data);
      
      if (data.error) {
        throw new Error(data.error + (data.details ? " Details: " + data.details : ""));
      }

      const aiMsg: Message = {
        role: "ai",
        content: data.response || "Sorry, I couldn't process that.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiMsg]);

      if (ttsEnabled) {
        speakText(aiMsg.content);
      }
    } catch (err: any) {
      console.error("Chat Error:", err);
      setMessages((prev) => [
        ...prev,
        {
          role: "ai",
          content: t("ai_assistant.fallback_message"),
          timestamp: new Date(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const speakText = (text: string) => {
    if (!("speechSynthesis" in window)) return;
    
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(
      text.replace(/\*\*/g, "").replace(/\n/g, " ")
    );
    
    const langCode = SUPPORTED_LANGUAGES.find((l) => l.name === language)?.code || "en";
    utterance.lang = langCode;
    
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    
    window.speechSynthesis.speak(utterance);
  };

  const startListening = () => {
    const w = window as any;
    const SR = w.SpeechRecognition || w.webkitSpeechRecognition;
    if (!SR) return;

    const recognition = new SR();
    recognition.lang = SUPPORTED_LANGUAGES.find((l) => l.name === language)?.code || "en-IN";
    recognition.interimResults = false;
    
    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onresult = (e: any) => {
      const transcript = e.results[0][0].transcript;
      setInput(transcript);
      // Auto-send if it's a clear command or just send? Let's just set input for now.
    };
    
    recognitionRef.current = recognition;
    recognition.start();
  };

  const stopListening = () => {
    recognitionRef.current?.stop();
    setIsListening(false);
  };

  const formatMessage = (content: string) => {
    return content
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
      .replace(/\n/g, "<br/>");
  };

  const rawPrompts = t("ai_assistant.suggested_prompts");
  const promptsArray = Array.isArray(rawPrompts) ? rawPrompts : [];

  return (
    <div className="min-h-screen bg-[#0A0E27] flex flex-col pt-20 pb-6">
      <div className="flex-1 flex flex-col max-w-4xl mx-auto w-full px-4">
        {/* Chat Header */}
        <div className="flex items-center justify-between mb-6 bg-white/5 border border-white/10 rounded-2xl p-4 backdrop-blur-md">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-indigo-gradient flex items-center justify-center shadow-glow">
              <Bot className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white flex items-center gap-2">
                {t("ai_assistant.title")}
                <span className="bg-indigo-500/20 text-indigo-400 text-[10px] px-2 py-0.5 rounded-full border border-indigo-500/30 uppercase tracking-tighter font-bold">Live</span>
              </h1>
              <div className="flex items-center gap-2 text-white/40 text-xs">
                 <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                 {t("ai_assistant.subtitle")}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setTtsEnabled(!ttsEnabled)}
              className={`p-2.5 rounded-xl transition-all ${
                ttsEnabled ? "bg-indigo-600 text-white" : "bg-white/5 text-white/40 hover:bg-white/10"
              }`}
              title={t("ai_assistant.tts_toggle")}
            >
              {ttsEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>
            <button
              onClick={() => setMessages([{ role: "ai", content: t("ai_assistant.welcome_message"), timestamp: new Date() }])}
              className="p-2.5 rounded-xl bg-white/5 text-white/40 hover:text-white hover:bg-white/10 transition-colors"
              title={t("ai_assistant.clear_chat")}
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Chat Messages */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto mb-6 pr-2 scrollbar-custom space-y-6">
          <AnimatePresence initial={false}>
            {messages.map((msg, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                className={`flex items-start gap-3 ${msg.role === "user" ? "flex-row-reverse" : ""}`}
              >
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-1 ${
                  msg.role === "user" ? "bg-indigo-600" : "bg-white/10 border border-white/10"
                }`}>
                  {msg.role === "user" ? <User className="w-4 h-4 text-white" /> : <Bot className="w-4 h-4 text-indigo-400" />}
                </div>
                
                <div className={`group relative max-w-[80%] p-4 rounded-2xl text-sm leading-relaxed ${
                  msg.role === "user" 
                    ? "bg-indigo-600 text-white rounded-tr-none shadow-lg shadow-indigo-900/20" 
                    : "bg-white/5 border border-white/10 text-white/90 rounded-tl-none backdrop-blur-sm"
                }`}>
                  <div dangerouslySetInnerHTML={{ __html: formatMessage(msg.content) }} />
                  
                  {msg.role === "ai" && (
                    <button 
                      onClick={() => speakText(msg.content)}
                      className="absolute -right-10 top-0 p-2 opacity-0 group-hover:opacity-100 transition-opacity text-white/20 hover:text-indigo-400"
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>
                  )}
                  
                  <div className={`text-[10px] mt-2 opacity-30 font-medium ${msg.role === "user" ? "text-right" : "text-left"}`}>
                    {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {loading && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-white/10 border border-white/10 flex items-center justify-center">
                <Bot className="w-4 h-4 text-indigo-400" />
              </div>
              <div className="bg-white/5 border border-white/10 p-4 rounded-2xl rounded-tl-none flex gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-bounce [animation-delay:-0.3s]" />
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-bounce [animation-delay:-0.15s]" />
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-bounce" />
              </div>
            </motion.div>
          )}

        </div>

        {/* Suggested Prompts */}
        <div className="flex gap-2 mb-4 overflow-x-auto pb-2 scrollbar-hide no-scrollbar">
          {promptsArray.map((prompt: string) => (
            <button
              key={prompt}
              onClick={() => sendMessage(prompt)}
              className="flex-shrink-0 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white/60 text-xs hover:bg-indigo-600 hover:text-white hover:border-indigo-500 transition-all duration-200"
            >
              {prompt}
            </button>
          ))}
        </div>

        {/* Chat Input */}
        <div className="relative">
          <div className="glass-card-strong p-2 flex items-end gap-2 border-white/20 focus-within:border-indigo-500/50 transition-all duration-300">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  sendMessage();
                }
              }}
              placeholder={t("ai_assistant.placeholder").replace("{language}", language)}
              className="flex-1 bg-transparent text-white placeholder-white/20 resize-none outline-none text-sm p-3 min-h-[50px] max-h-32"
              rows={1}
            />
            <div className="flex items-center gap-2 p-1.5">
              <button
                onClick={isListening ? stopListening : startListening}
                className={`p-3 rounded-xl transition-all ${
                  isListening ? "bg-red-500 text-white animate-pulse" : "bg-white/10 text-white/40 hover:bg-white/20"
                }`}
              >
                {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              </button>
              <button
                onClick={() => sendMessage()}
                disabled={!input.trim() || loading}
                className="p-3 rounded-xl bg-indigo-600 text-white hover:bg-indigo-500 shadow-lg shadow-indigo-600/20 disabled:opacity-30 disabled:grayscale transition-all"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
          
          <div className="flex items-center justify-center gap-2 mt-4 text-[10px] text-white/20 uppercase tracking-widest font-bold">
            <Info className="w-3 h-3" />
            {t("common.call_helpline")}
          </div>
        </div>
      </div>
    </div>
  );
}
