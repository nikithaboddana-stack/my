import React, { useState } from 'react';
import {
  HelpCircle,
  MessageSquarePlus,
  Send,
  Trash2,
  AlertTriangle,
  Lightbulb,
  CheckCircle2,
  BookOpen,
  ArrowRight,
  Sprout,
  Droplets,
  Layers,
} from 'lucide-react';
import { FarmerQuestion } from '../models/types';

interface FarmerHelpSectionProps {
  questions: FarmerQuestion[];
  onAskQuestion: (question: FarmerQuestion) => Promise<void>;
  onDeleteQuestion: (questionId: string) => Promise<void>;
  userId: string;
  onNavigateToKnowledge: () => void;
  onNavigateToCrops: () => void;
}

const COMMON_FARMER_DOUBTS = [
  {
    text: 'My tomato leaves are turning yellow.',
    crop: 'Tomato',
    category: 'Leaf / Crop Health' as const,
    guidance:
      'Yellowing leaves can stem from over-irrigation (suffocating roots), nitrogen deficiency, or early fungal blight. Check root-zone moisture before watering again. If spots accompany the yellowing, consult a local extension officer.',
  },
  {
    text: 'My soil dries out very quickly after watering.',
    crop: 'General',
    category: 'Soil & Moisture' as const,
    guidance:
      'Light sandy soils have low water holding capacity and fast drainage. Applying a 5–8 cm layer of organic straw mulch and spreading water in smaller, frequent pulses prevents fast surface drying.',
  },
  {
    text: 'How should I maintain my drip irrigation lines?',
    crop: 'General',
    category: 'Irrigation & Water' as const,
    guidance:
      'Flush lateral end caps every 10–14 days while pumps are running to expel silt. Clean your main disc/screen filters whenever the pressure gauge drops. Inspect emitters for even dripping.',
  },
  {
    text: 'How can I reduce water wastage during hot summers?',
    crop: 'General',
    category: 'Irrigation & Water' as const,
    guidance:
      'Irrigate during early morning (5:00–8:00 AM) or dusk to minimize evaporative loss. Cover bare crop rows with residue mulch and avoid overhead spraying in windy midday heat.',
  },
];

export const FarmerHelpSection: React.FC<FarmerHelpSectionProps> = ({
  questions,
  onAskQuestion,
  onDeleteQuestion,
  userId,
  onNavigateToKnowledge,
  onNavigateToCrops,
}) => {
  const [questionText, setQuestionText] = useState('');
  const [crop, setCrop] = useState('Tomato');
  const [category, setCategory] = useState<FarmerQuestion['category']>('Irrigation & Water');
  const [submitting, setSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState<'ask' | 'myQuestions' | 'commonIssues'>('ask');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!questionText.trim()) return;

    setSubmitting(true);
    try {
      const newQ: FarmerQuestion = {
        id: `q_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        userId,
        question: questionText.trim(),
        crop: crop.trim(),
        category,
        status: 'Open',
        createdAt: new Date().toISOString(),
      };
      await onAskQuestion(newQ);
      setQuestionText('');
      setActiveTab('myQuestions');
    } finally {
      setSubmitting(false);
    }
  };

  const selectQuickDoubt = (doubt: typeof COMMON_FARMER_DOUBTS[0]) => {
    setQuestionText(doubt.text);
    setCrop(doubt.crop);
    setCategory(doubt.category);
    setActiveTab('ask');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Banner */}
      <div className="backdrop-blur-md bg-white/70 rounded-3xl p-6 sm:p-8 border border-white/60 shadow-lg shadow-purple-500/5 relative overflow-hidden bg-linear-to-br from-purple-50/70 via-indigo-50/50 to-blue-50/40">
        <div className="max-w-2xl space-y-2">
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-bold bg-purple-100/80 text-purple-800 border border-purple-200/50">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>❓ Farmer Help & Agronomic Guidance</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
            Ask a Farming Problem or Doubt
          </h1>
          <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
            Record field observations, ask irrigation questions, or explore guidance on common crop and soil issues.
          </p>
        </div>

        {/* Mandatory Advisory Notice */}
        <div className="mt-4 p-3 rounded-2xl bg-amber-50/90 border border-amber-200/80 text-amber-950 text-xs flex items-center space-x-2.5">
          <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0" />
          <span>
            <strong>Expert Advisory:</strong> This guidance is educational. For serious crop disease, pest outbreaks, or chemical treatment, consider consulting a qualified local agricultural officer or agricultural expert.
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200/80 space-x-2 text-xs font-bold">
        <button
          onClick={() => setActiveTab('ask')}
          className={`py-2.5 px-4 rounded-t-xl transition-all cursor-pointer ${
            activeTab === 'ask'
              ? 'bg-white text-purple-800 border-t-2 border-purple-600 shadow-xs'
              : 'text-gray-500 hover:text-gray-800'
          }`}
        >
          Ask a Question
        </button>
        <button
          onClick={() => setActiveTab('commonIssues')}
          className={`py-2.5 px-4 rounded-t-xl transition-all cursor-pointer ${
            activeTab === 'commonIssues'
              ? 'bg-white text-purple-800 border-t-2 border-purple-600 shadow-xs'
              : 'text-gray-500 hover:text-gray-800'
          }`}
        >
          Common Farm Doubts
        </button>
        <button
          onClick={() => setActiveTab('myQuestions')}
          className={`py-2.5 px-4 rounded-t-xl transition-all cursor-pointer flex items-center space-x-1.5 ${
            activeTab === 'myQuestions'
              ? 'bg-white text-purple-800 border-t-2 border-purple-600 shadow-xs'
              : 'text-gray-500 hover:text-gray-800'
          }`}
        >
          <span>My Recorded Questions</span>
          {questions.length > 0 && (
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-purple-100 text-purple-800">
              {questions.length}
            </span>
          )}
        </button>
      </div>

      {/* Tab 1: Ask Form */}
      {activeTab === 'ask' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 backdrop-blur-md bg-white/80 p-6 rounded-3xl border border-white/80 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-gray-900 flex items-center space-x-2">
              <MessageSquarePlus className="w-4 h-4 text-purple-600" />
              <span>Describe Your Farming Doubt</span>
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  What problem are you noticing?
                </label>
                <textarea
                  required
                  rows={3}
                  value={questionText}
                  onChange={(e) => setQuestionText(e.target.value)}
                  placeholder="e.g. My tomato leaves have yellow spots on the edges, and the soil feels very wet..."
                  className="w-full p-3 border border-gray-200/80 rounded-xl text-xs bg-white focus:ring-2 focus:ring-purple-500 focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Crop</label>
                  <input
                    type="text"
                    value={crop}
                    onChange={(e) => setCrop(e.target.value)}
                    placeholder="e.g. Tomato, Wheat, Cotton"
                    className="w-full px-3 py-2 border border-gray-200/80 rounded-xl text-xs bg-white focus:ring-2 focus:ring-purple-500 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as FarmerQuestion['category'])}
                    className="w-full px-3 py-2 border border-gray-200/80 rounded-xl text-xs bg-white focus:ring-2 focus:ring-purple-500 focus:outline-hidden"
                  >
                    <option value="Irrigation & Water">Irrigation & Water</option>
                    <option value="Leaf / Crop Health">Leaf / Crop Health</option>
                    <option value="Soil & Moisture">Soil & Moisture</option>
                    <option value="Pest & Growth">Pest & Growth</option>
                    <option value="General">General Farming</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <span className="text-[11px] text-gray-400">
                  Saved securely to your farm profile in Firebase
                </span>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2.5 bg-purple-700 hover:bg-purple-800 text-white rounded-xl text-xs font-bold shadow-md shadow-purple-700/20 flex items-center space-x-1.5 transition-all cursor-pointer disabled:opacity-50"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{submitting ? 'Saving...' : 'Save Question'}</span>
                </button>
              </div>
            </form>
          </div>

          {/* Quick doubts side panel */}
          <div className="backdrop-blur-md bg-white/70 p-5 rounded-3xl border border-white/80 shadow-xs space-y-3">
            <h4 className="text-xs font-bold text-gray-800 uppercase tracking-wider flex items-center space-x-1.5">
              <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
              <span>Tap a Common Doubt</span>
            </h4>
            <div className="space-y-2">
              {COMMON_FARMER_DOUBTS.map((d, idx) => (
                <button
                  key={idx}
                  onClick={() => selectQuickDoubt(d)}
                  className="w-full text-left p-3 rounded-2xl bg-purple-50/50 hover:bg-purple-50 border border-purple-100/60 text-xs text-purple-950 transition-colors group cursor-pointer"
                >
                  <div className="font-semibold group-hover:text-purple-700">{d.text}</div>
                  <div className="text-[10px] text-gray-500 mt-1">{d.crop} · {d.category}</div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Common Doubts & Agronomy Answers */}
      {activeTab === 'commonIssues' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {COMMON_FARMER_DOUBTS.map((d, idx) => (
              <div
                key={idx}
                className="backdrop-blur-md bg-white/80 p-5 rounded-3xl border border-white/80 shadow-xs space-y-3"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-100 text-purple-800">
                      {d.crop} · {d.category}
                    </span>
                    <h3 className="text-sm font-bold text-gray-900 mt-1.5">{d.text}</h3>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 border border-gray-100 text-xs text-gray-700 leading-relaxed">
                  <div className="font-semibold text-gray-800 mb-1 flex items-center space-x-1 text-[11px] text-emerald-800">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Practical Field Guidance:</span>
                  </div>
                  {d.guidance}
                </div>

                <div className="flex items-center justify-between text-xs pt-1">
                  <button
                    onClick={onNavigateToKnowledge}
                    className="text-xs font-bold text-purple-700 hover:text-purple-900 flex items-center space-x-1 cursor-pointer"
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>Read Related Guide</span>
                  </button>
                  <button
                    onClick={() => selectQuickDoubt(d)}
                    className="text-xs text-gray-500 hover:text-gray-700 underline cursor-pointer"
                  >
                    Log this question
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: My Recorded Questions */}
      {activeTab === 'myQuestions' && (
        <div className="space-y-4">
          {questions.length === 0 ? (
            <div className="backdrop-blur-md bg-white/80 rounded-3xl border border-white/80 p-12 text-center shadow-xs space-y-3">
              <HelpCircle className="w-12 h-12 mx-auto text-purple-300" />
              <h3 className="text-sm font-bold text-gray-800">No questions recorded yet</h3>
              <p className="text-xs text-gray-500 max-w-sm mx-auto">
                Have a doubt about leaf drying, water scheduling, or drip maintenance? Ask above to save it to your farm log.
              </p>
              <button
                onClick={() => setActiveTab('ask')}
                className="px-4 py-2 bg-purple-700 hover:bg-purple-800 text-white rounded-xl text-xs font-bold inline-flex items-center space-x-1"
              >
                <span>Ask First Question</span>
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {questions.map((q) => (
                <div
                  key={q.id}
                  className="backdrop-blur-md bg-white/85 p-5 rounded-3xl border border-white/80 shadow-xs flex flex-col sm:flex-row sm:items-start justify-between gap-4"
                >
                  <div className="space-y-1.5 grow">
                    <div className="flex items-center space-x-2 text-xs">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 text-purple-800">
                        {q.category}
                      </span>
                      <span className="font-semibold text-gray-700">{q.crop}</span>
                      <span className="text-gray-400 text-[11px]">
                        · {new Date(q.createdAt).toLocaleDateString()}
                      </span>
                    </div>

                    <p className="text-xs sm:text-sm font-semibold text-gray-900 leading-relaxed">
                      "{q.question}"
                    </p>

                    <div className="p-3 rounded-2xl bg-amber-50/70 border border-amber-200/60 text-[11px] text-amber-900 flex items-center space-x-2">
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                      <span>Take a sample to your local agricultural extension clinic for pest/disease verification.</span>
                    </div>
                  </div>

                  <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-start gap-2 shrink-0">
                    <button
                      onClick={() => onDeleteQuestion(q.id)}
                      className="p-1.5 text-gray-400 hover:text-red-600 rounded-lg transition-colors cursor-pointer"
                      title="Delete Question"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
