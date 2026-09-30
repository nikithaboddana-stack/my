import React, { useState, useEffect, useRef } from 'react';
import {
  Send,
  Bot,
  User as UserIcon,
  Sparkles,
  BookOpen,
  RefreshCw,
  Trash2,
  AlertCircle,
  HelpCircle,
  Droplets,
  Layers,
  Sprout,
  WifiOff,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';
import { User } from 'firebase/auth';
import { ChatMessage, FarmDetails, WaterUsageRecord, FarmerQuestion } from '../models/types';
import { WaterAnalytics } from '../utils/water_calc';
import {
  saveChatMessage,
  subscribeChatMessages,
  clearChatSession,
  addFarmerQuestion,
} from '../services/firebase_service';

interface FarmerAssistantProps {
  currentUser: User | null;
  farm: FarmDetails | null;
  records: WaterUsageRecord[];
  analytics: WaterAnalytics;
  isOnline: boolean;
  onNavigateToKnowledge: (guideId?: string) => void;
  onNavigateToRecords: () => void;
}

const QUICK_QUESTIONS = [
  { text: 'How can I save water?', icon: '💧', category: 'Water Saving' },
  { text: 'Tell me about my crop', icon: '🌾', category: 'Crop Guide' },
  { text: 'How does drip irrigation work?', icon: '🚿', category: 'Irrigation' },
  { text: 'How does soil affect irrigation?', icon: '🌱', category: 'Soil & AWC' },
  { text: 'How can I use rainwater?', icon: '🌧️', category: 'Rain Harvesting' },
  { text: 'Explain my water usage', icon: '📊', category: 'Water Records' },
];

export const FarmerAssistant: React.FC<FarmerAssistantProps> = ({
  currentUser,
  farm,
  records,
  analytics,
  isOnline,
  onNavigateToKnowledge,
  onNavigateToRecords,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputPrompt, setInputPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [lastPrompt, setLastPrompt] = useState<string>('');
  const [sessionId, setSessionId] = useState<string>(() => {
    return localStorage.getItem('agriflow_active_session') || `session_${Date.now()}`;
  });

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const userId = currentUser?.uid || 'guest_farmer';

  // 1. Subscribe to real-time chat messages from Firebase
  useEffect(() => {
    localStorage.setItem('agriflow_active_session', sessionId);

    if (currentUser) {
      const unsub = subscribeChatMessages(
        currentUser.uid,
        sessionId,
        (fetched) => {
          if (fetched.length > 0) {
            setMessages(fetched);
          }
        },
        () => {
          // Fall back gracefully
        }
      );
      return () => unsub();
    }
  }, [currentUser, sessionId]);

  // 2. Auto-scroll on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  // 3. Build Real Farmer Data Context
  const buildFarmContext = () => {
    const recentRecordsSummary = records
      .slice(0, 5)
      .map(
        (r) =>
          `• ${r.date}: ${r.crop || 'Crop'} - ${r.waterUsed.toLocaleString()} L via ${r.irrigationMethod}${
            r.durationHours ? ` (${r.durationHours} hrs)` : ''
          }`
      )
      .join('\n');

    return {
      farmName: farm?.farmName || undefined,
      crops: farm?.crops || undefined,
      soilType: farm?.soilType || undefined,
      irrigationMethod: farm?.irrigationMethod || undefined,
      waterSource: farm?.waterSource || undefined,
      farmArea: farm?.farmArea || undefined,
      areaUnit: farm?.areaUnit || undefined,
      cityName: farm?.cityName || undefined,
      totalWaterLiters: analytics.totalWaterLiters,
      recentRecordsCount: records.length,
      recentRecordsSummary: recentRecordsSummary || undefined,
    };
  };

  // 4. Send Message Handler
  const handleSendMessage = async (textToSend?: string) => {
    const prompt = (textToSend || inputPrompt).trim();
    if (!prompt) return;

    if (!isOnline) {
      setErrorMsg("You're offline. AI Farmer Assistant needs an internet connection.");
      return;
    }

    setErrorMsg(null);
    setLastPrompt(prompt);
    setInputPrompt('');

    const userMessage: ChatMessage = {
      id: `msg_u_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      role: 'user',
      content: prompt,
      createdAt: new Date().toISOString(),
    };

    // Update local state immediately
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);

    // Save to Firebase Firestore if logged in
    if (currentUser) {
      saveChatMessage(currentUser.uid, sessionId, userMessage).catch(console.error);

      // Optionally record in farmerQuestions subcollection for records
      const questionDoc: FarmerQuestion = {
        id: `q_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        userId: currentUser.uid,
        question: prompt,
        crop: farm?.crops?.split(',')[0]?.trim() || 'General',
        category: 'Irrigation & Water',
        status: 'Open',
        createdAt: new Date().toISOString(),
      };
      addFarmerQuestion(questionDoc).catch(console.error);
    }

    setLoading(true);

    try {
      const historyForApi = updatedMessages.map((m) => ({
        role: m.role,
        content: m.content,
      }));

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: prompt,
          history: historyForApi.slice(0, -1), // Prior turns
          farmContext: buildFarmContext(),
          userId,
          sessionId,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || `Server returned status ${res.status}`);
      }

      const data = await res.json();

      const aiMessage: ChatMessage = {
        id: `msg_ai_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        role: 'model',
        content: data.reply,
        createdAt: new Date().toISOString(),
        relatedGuide: data.relatedGuide,
      };

      setMessages((prev) => [...prev, aiMessage]);

      if (currentUser) {
        saveChatMessage(currentUser.uid, sessionId, aiMessage).catch(console.error);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Connection failed. Please try again.';
      setErrorMsg(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleClearChat = async () => {
    if (confirm('Start a fresh conversation with AgriFlow Assistant?')) {
      if (currentUser) {
        await clearChatSession(currentUser.uid, sessionId).catch(console.error);
      }
      const newSess = `session_${Date.now()}`;
      setSessionId(newSess);
      setMessages([]);
      setErrorMsg(null);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* 1. Glassmorphism Hero Header */}
      <div className="backdrop-blur-xl bg-white/75 rounded-3xl p-6 sm:p-8 border border-white/80 shadow-xl shadow-emerald-500/10 relative overflow-hidden bg-linear-to-br from-emerald-100/70 via-teal-50/60 to-cyan-100/50">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full text-xs font-bold bg-white/80 text-emerald-900 border border-emerald-200/60 shadow-xs backdrop-blur-md">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>🤖 Real-Time Gemini AI Assistant</span>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-gray-900 tracking-tight">
              AgriFlow Farmer Assistant
            </h1>

            <p className="text-xs sm:text-sm text-gray-700 leading-relaxed font-medium">
              Ask any farm question about irrigation, crop water requirements, soil moisture, drip lines, or your actual water logs. Powered by real agricultural intelligence.
            </p>
          </div>

          <div className="flex items-center space-x-2.5 shrink-0 self-start md:self-auto">
            {messages.length > 0 && (
              <button
                onClick={handleClearChat}
                className="px-3.5 py-2 backdrop-blur-md bg-white/80 hover:bg-white text-gray-700 hover:text-red-700 border border-white/90 rounded-2xl text-xs font-bold shadow-xs flex items-center space-x-1.5 transition-all cursor-pointer"
                title="Clear current conversation"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>New Chat</span>
              </button>
            )}
          </div>
        </div>

        {/* Real Farm Data Grounding Indicator */}
        <div className="relative z-10 mt-5 pt-4 border-t border-emerald-200/60 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center space-x-2 text-emerald-950 font-medium">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>
              Connected to Farm Data:{' '}
              <strong>
                {farm?.farmName || (currentUser ? 'Profile Active' : 'Guest Farm')}
              </strong>{' '}
              · {records.length} water logs ({analytics.totalWaterLiters.toLocaleString()} L total)
            </span>
          </div>

          {records.length > 0 && (
            <button
              onClick={onNavigateToRecords}
              className="text-xs font-bold text-teal-800 hover:text-teal-950 underline cursor-pointer"
            >
              View Water Logs →
            </button>
          )}
        </div>
      </div>

      {/* 2. Offline Notice */}
      {!isOnline && (
        <div className="p-4 rounded-2xl backdrop-blur-md bg-amber-50/90 border border-amber-200 text-amber-950 text-xs flex items-center space-x-2.5 shadow-xs">
          <WifiOff className="w-4 h-4 text-amber-600 shrink-0" />
          <span className="font-semibold">
            You're offline. AI Farmer Assistant needs an internet connection.
          </span>
        </div>
      )}

      {/* 3. Main Chat Stream Container */}
      <div className="backdrop-blur-xl bg-white/85 rounded-3xl border border-white/80 shadow-md shadow-emerald-900/5 flex flex-col min-h-[500px] max-h-[680px] overflow-hidden">
        {/* Messages Scroll Area */}
        <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4">
          {/* Welcome Intro if empty */}
          {messages.length === 0 && (
            <div className="text-center py-8 sm:py-12 space-y-4 max-w-lg mx-auto">
              <div className="w-16 h-16 rounded-3xl bg-linear-to-tr from-emerald-600 via-teal-500 to-cyan-500 text-white flex items-center justify-center mx-auto text-2xl shadow-lg shadow-emerald-600/30">
                <Sprout className="w-8 h-8 animate-bounce" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base sm:text-lg font-bold text-gray-900">
                  Welcome! How can I help your farm today?
                </h3>
                <p className="text-xs text-gray-600 leading-relaxed">
                  I can analyze your actual recorded water consumption, explain how to fix clogged drip emitters, or suggest irrigation intervals for your crops.
                </p>
              </div>

              {/* Quick Questions Grid */}
              <div className="pt-2 text-left space-y-2">
                <div className="text-[11px] font-bold uppercase tracking-wider text-gray-400 text-center">
                  Try asking a common question:
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {QUICK_QUESTIONS.map((q, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSendMessage(q.text)}
                      className="p-3 rounded-2xl backdrop-blur-md bg-white/90 hover:bg-emerald-50/80 border border-gray-200/70 hover:border-emerald-300 text-left text-xs font-semibold text-gray-800 flex items-center space-x-2.5 transition-all shadow-xs hover:shadow-sm cursor-pointer"
                    >
                      <span className="text-lg">{q.icon}</span>
                      <span className="truncate">{q.text}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Render Conversation Turn by Turn */}
          {messages.map((msg) => {
            const isUser = msg.role === 'user';
            return (
              <div
                key={msg.id}
                className={`flex items-start space-x-3 ${isUser ? 'flex-row-reverse space-x-reverse' : ''}`}
              >
                {/* Avatar */}
                <div
                  className={`w-9 h-9 rounded-2xl flex items-center justify-center shrink-0 shadow-xs ${
                    isUser
                      ? 'bg-linear-to-br from-emerald-700 to-teal-800 text-white'
                      : 'bg-linear-to-tr from-emerald-600 via-teal-500 to-cyan-500 text-white ring-2 ring-emerald-200'
                  }`}
                >
                  {isUser ? <UserIcon className="w-4 h-4" /> : <Bot className="w-5 h-5" />}
                </div>

                {/* Message Bubble */}
                <div className={`max-w-[85%] sm:max-w-[75%] space-y-2`}>
                  <div
                    className={`p-4 sm:p-5 rounded-3xl shadow-sm text-xs sm:text-sm leading-relaxed whitespace-pre-wrap ${
                      isUser
                        ? 'bg-linear-to-r from-emerald-700 to-teal-800 text-white rounded-tr-xs shadow-emerald-700/20'
                        : 'backdrop-blur-xl bg-white/95 text-gray-900 border border-white/80 rounded-tl-xs shadow-xs'
                    }`}
                  >
                    {msg.content}
                  </div>

                  {/* Related Guide Action Card */}
                  {!isUser && msg.relatedGuide && (
                    <div className="backdrop-blur-md bg-amber-50/90 border border-amber-200/80 rounded-2xl p-3 flex items-center justify-between gap-3 text-xs shadow-xs">
                      <div className="flex items-center space-x-2 text-amber-950 font-bold truncate">
                        <BookOpen className="w-4 h-4 text-amber-700 shrink-0" />
                        <span className="truncate">Related Guide: {msg.relatedGuide.title}</span>
                      </div>
                      <button
                        onClick={() => onNavigateToKnowledge(msg.relatedGuide?.id)}
                        className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl font-bold text-xs shrink-0 flex items-center space-x-1 cursor-pointer transition-all shadow-xs"
                      >
                        <span>Read Guide</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  )}

                  <div
                    className={`text-[10px] text-gray-400 px-1 flex items-center space-x-1 ${
                      isUser ? 'justify-end' : 'justify-start'
                    }`}
                  >
                    <span>
                      {new Date(msg.createdAt).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}

          {/* Thinking / Loading Indicator */}
          {loading && (
            <div className="flex items-start space-x-3">
              <div className="w-9 h-9 rounded-2xl bg-linear-to-tr from-emerald-600 via-teal-500 to-cyan-500 text-white flex items-center justify-center shrink-0 shadow-xs ring-2 ring-emerald-200">
                <Bot className="w-5 h-5 animate-pulse" />
              </div>
              <div className="backdrop-blur-xl bg-white/95 text-gray-800 border border-white/80 rounded-3xl rounded-tl-xs p-4 shadow-xs flex items-center space-x-3 text-xs">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 rounded-full bg-emerald-600 animate-bounce"></div>
                  <div
                    className="w-2 h-2 rounded-full bg-teal-600 animate-bounce"
                    style={{ animationDelay: '0.2s' }}
                  ></div>
                  <div
                    className="w-2 h-2 rounded-full bg-cyan-600 animate-bounce"
                    style={{ animationDelay: '0.4s' }}
                  ></div>
                </div>
                <span className="font-semibold text-emerald-950">
                  AgriFlow is analyzing farm data and thinking...
                </span>
              </div>
            </div>
          )}

          {/* Error Message Box */}
          {errorMsg && (
            <div className="p-4 rounded-2xl backdrop-blur-md bg-red-50/90 border border-red-200 text-red-900 text-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs">
              <div className="flex items-start space-x-2">
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                <span>{errorMsg}</span>
              </div>
              {lastPrompt && (
                <button
                  onClick={() => handleSendMessage(lastPrompt)}
                  className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold text-xs shrink-0 flex items-center space-x-1 cursor-pointer transition-all shadow-xs"
                >
                  <RefreshCw className="w-3 h-3" />
                  <span>Retry</span>
                </button>
              )}
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar Form */}
        <div className="p-3 sm:p-4 border-t border-gray-100 bg-white/70 backdrop-blur-md">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center space-x-2"
          >
            <div className="relative grow">
              <input
                ref={inputRef}
                type="text"
                disabled={loading || !isOnline}
                value={inputPrompt}
                onChange={(e) => setInputPrompt(e.target.value)}
                placeholder={
                  !isOnline
                    ? 'AI assistant is offline...'
                    : 'Ask about water savings, drip maintenance, ETc, or your water logs...'
                }
                className="w-full px-4 py-3 bg-white/95 border border-gray-200/80 rounded-2xl text-xs sm:text-sm text-gray-900 placeholder-gray-400 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 shadow-xs font-medium disabled:opacity-60"
              />
            </div>

            <button
              type="submit"
              disabled={loading || !inputPrompt.trim() || !isOnline}
              className="p-3 bg-linear-to-r from-emerald-700 to-teal-700 hover:from-emerald-800 hover:to-teal-800 disabled:opacity-40 text-white rounded-2xl shadow-md shadow-emerald-700/25 transition-all cursor-pointer disabled:cursor-not-allowed shrink-0"
              title="Send message"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>

          {/* Quick Disease & Safety Reminder */}
          <div className="mt-2.5 px-2 flex items-center justify-between text-[11px] text-gray-400">
            <span className="flex items-center space-x-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Grounding: Uses your actual water logs & agronomy references.</span>
            </span>
            <span className="hidden sm:inline">Press Enter to send</span>
          </div>
        </div>
      </div>
    </div>
  );
};
