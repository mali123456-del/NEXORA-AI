import React, { useState, useEffect } from 'react';
import {
  GraduationCap,
  ShieldCheck,
  Code,
  Flag,
  Award,
  CheckCircle,
  XCircle,
  Send,
  Loader2,
  Sparkles,
} from 'lucide-react';
import { sendChatMessage, verifyCtfFlag, fetchCtfChallenges } from '../../services/api';
import { useNotification } from '../../context/NotificationContext';
import { useEcosystemStatus } from '../../context/EcosystemStatusContext';

interface CtfChallenge {
  id: string;
  title: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  category: string;
  points: number;
  description: string;
  targetHint: string;
  solved: boolean;
}

export const LearningAcademyView: React.FC = () => {
  const { notify } = useNotification();
  const { setEcosystemStatus } = useEcosystemStatus();
  const [serverPoints, setServerPoints] = useState(0);

  const [challenges, setChallenges] = useState<CtfChallenge[]>([
    {
      id: 'ctf-1',
      title: 'JWT Header Algorithm Confusion',
      difficulty: 'Easy',
      category: 'Web Security',
      points: 100,
      description: 'The authentication server improperly trusts the "alg": "none" header parameter in incoming bearer tokens, allowing signature bypass.',
      targetHint: 'Inspect the decoded token payload and forge an unsigned token with admin role.',
      solved: false,
    },
    {
      id: 'ctf-2',
      title: 'Cloud Metadata SSRF Escalation',
      difficulty: 'Medium',
      category: 'Cloud Security',
      points: 250,
      description: 'An image webhook endpoint downloads arbitrary URLs without validating internal RFC1918 or link-local IP addresses.',
      targetHint: 'Bypass basic IP filter by utilizing decimal notation for 169.254.169.254.',
      solved: false,
    },
    {
      id: 'ctf-3',
      title: 'ReDoS Regex Denial of Service',
      difficulty: 'Hard',
      category: 'AppSec',
      points: 400,
      description: 'A catastrophic backtracking regex pattern in the email validation schema locks the event loop when fed 40+ repeating characters.',
      targetHint: 'Analyze the exponential branch in ^([a-zA-Z0-9]+)+$.',
      solved: false,
    },
  ]);

  useEffect(() => {
    fetchCtfChallenges()
      .then(res => {
        if (res.challenges && res.challenges.length > 0) {
          setChallenges(prev =>
            prev.map(c => {
              const matched = res.challenges.find((sc: any) => sc.id === c.id);
              return matched ? { ...c, solved: Boolean(matched.solved) } : c;
            })
          );
        }
        if (typeof res.totalPoints === 'number') {
          setServerPoints(res.totalPoints);
        }
      })
      .catch(() => {
        // Fallback to initial state
      });
  }, []);

  const [flagInputs, setFlagInputs] = useState<Record<string, string>>({});
  const [feedback, setFeedback] = useState<Record<string, string>>({});
  const [isVerifying, setIsVerifying] = useState<Record<string, boolean>>({});

  // AI Tutor Q&A state
  const [tutorQuery, setTutorQuery] = useState('');
  const [tutorReply, setTutorReply] = useState('');
  const [isTutorLoading, setIsTutorLoading] = useState(false);

  const handleFlagSubmit = async (challenge: CtfChallenge) => {
    const input = (flagInputs[challenge.id] || '').trim();
    if (!input) return;

    setIsVerifying(prev => ({ ...prev, [challenge.id]: true }));
    setEcosystemStatus('learning_academy', 'syncing');
    try {
      const res = await verifyCtfFlag(challenge.id, input);
      setEcosystemStatus('learning_academy', 'online');

      if (res.correct) {
        setChallenges(prev => prev.map(c => (c.id === challenge.id ? { ...c, solved: true } : c)));
        if (typeof res.totalPoints === 'number') {
          setServerPoints(res.totalPoints);
        }

        if (res.alreadySolved) {
          setFeedback(prev => ({ ...prev, [challenge.id]: res.message || 'Already solved.' }));
          notify({
            type: 'info',
            title: 'Challenge Already Cleared',
            message: 'Points have already been awarded for this challenge in this session.',
          });
        } else {
          setFeedback(prev => ({ ...prev, [challenge.id]: res.message || 'SUCCESS: Correct flag captured!' }));
          notify({
            type: 'success',
            title: 'Flag Captured!',
            message: `Challenge "${challenge.title}" cleared. +${challenge.points} pts awarded by server engine.`,
          });
        }
      } else {
        setFeedback(prev => ({ ...prev, [challenge.id]: res.message || 'DENIED: Invalid flag submission.' }));
        notify({
          type: 'warning',
          title: 'Flag Rejected',
          message: res.message || 'The submitted flag does not match the server cryptographic hash.',
        });
      }
    } catch (err: any) {
      setEcosystemStatus('learning_academy', 'online');
      setFeedback(prev => ({ ...prev, [challenge.id]: `Error: ${err.message}` }));
      notify({
        type: 'error',
        title: 'Verification Request Error',
        message: err.message,
      });
    } finally {
      setIsVerifying(prev => ({ ...prev, [challenge.id]: false }));
    }
  };

  const handleAskTutor = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tutorQuery.trim() || isTutorLoading) return;

    setIsTutorLoading(true);
    try {
      const res = await sendChatMessage({
        prompt: `You are NEXORA Cyber Academy AI Professor. Explain clearly and pedagogically: "${tutorQuery}". Provide code examples, real-world CVE analogies, and proactive defense recommendations.`,
        model: 'gemini-4-argon',
        enableThinking: true,
        feature: 'Learning Academy Tutor',
      });
      setTutorReply(res.text);
    } catch (err: any) {
      setTutorReply(`Tutor error: ${err.message}`);
    } finally {
      setIsTutorLoading(false);
    }
  };

  const totalPoints = Math.max(serverPoints, challenges.filter(c => c.solved).reduce((acc, c) => acc + c.points, 0));

  return (
    <div className="flex flex-col h-full bg-slate-950 p-4 space-y-4 overflow-y-auto">
      {/* Top Banner */}
      <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex flex-wrap items-center justify-between gap-3 shadow-xl">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400">
            <GraduationCap className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-white font-mono">NEXORA CYBER LEARNING ACADEMY</h2>
            <p className="text-xs text-slate-400">
              Interactive AI tutor, offensive CTF practice arenas, and certified secure coding labs
            </p>
          </div>
        </div>

        {/* Gamified Score */}
        <div className="flex items-center space-x-2 text-xs font-mono">
          <div className="px-3 py-1 rounded-xl bg-blue-950 text-blue-300 border border-blue-800 flex items-center space-x-1.5 font-bold">
            <Award className="w-4 h-4 text-amber-400" />
            <span>ACADEMY SCORE: {totalPoints} PTS</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 flex-1">
        {/* Left: CTF Practice Challenges */}
        <div className="lg:col-span-7 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-slate-300 uppercase flex items-center space-x-1.5">
              <Flag className="w-4 h-4 text-rose-400" />
              <span>Capture the Flag (CTF) Practice Arenas</span>
            </span>
            <span className="text-[11px] font-mono text-slate-500">
              {challenges.filter(c => c.solved).length} / {challenges.length} Cleared
            </span>
          </div>

          <div className="space-y-3">
            {challenges.map(challenge => (
              <div
                key={challenge.id}
                className={`p-4 rounded-2xl border transition-all ${
                  challenge.solved
                    ? 'bg-slate-900/60 border-emerald-800/60'
                    : 'bg-slate-900 border-slate-800 shadow-md'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                        challenge.difficulty === 'Easy'
                          ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                          : challenge.difficulty === 'Medium'
                          ? 'bg-amber-950 text-amber-300 border border-amber-800'
                          : 'bg-rose-950 text-rose-300 border border-rose-800'
                      }`}
                    >
                      {challenge.difficulty}
                    </span>
                    <h3 className="text-xs font-bold text-white font-mono">{challenge.title}</h3>
                  </div>
                  <span className="text-xs font-mono text-amber-400 font-bold">+{challenge.points} pts</span>
                </div>

                <p className="text-xs text-slate-300 mt-2 leading-relaxed">{challenge.description}</p>
                <div className="mt-2 text-[11px] font-mono text-slate-400 bg-slate-950 p-2 rounded-xl border border-slate-800">
                  <span className="text-cyan-400 font-bold">Hint:</span> {challenge.targetHint}
                </div>

                {/* Flag Input Form */}
                <div className="mt-3 flex items-center space-x-2">
                  <input
                    type="text"
                    value={flagInputs[challenge.id] || ''}
                    onChange={e => setFlagInputs({ ...flagInputs, [challenge.id]: e.target.value })}
                    placeholder="Enter flag format: flag{...}"
                    disabled={challenge.solved}
                    className="flex-1 px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-blue-500/50 disabled:opacity-50"
                  />
                  <button
                    onClick={() => handleFlagSubmit(challenge)}
                    disabled={challenge.solved}
                    className={`px-3 py-1.5 rounded-xl font-mono text-xs font-bold transition-all ${
                      challenge.solved
                        ? 'bg-emerald-900 text-emerald-300 cursor-default'
                        : 'bg-blue-600 hover:bg-blue-500 text-white shadow-md shadow-blue-600/20'
                    }`}
                  >
                    {challenge.solved ? 'Captured' : 'Submit Flag'}
                  </button>
                </div>

                {feedback[challenge.id] && (
                  <div
                    className={`mt-2 text-[11px] font-mono ${
                      feedback[challenge.id].includes('SUCCESS') ? 'text-emerald-400' : 'text-rose-400'
                    }`}
                  >
                    {feedback[challenge.id]}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Right: AI Cyber Professor Tutor */}
        <div className="lg:col-span-5 p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl flex flex-col space-y-4">
          <div className="flex items-center space-x-2 border-b border-slate-800 pb-2">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span className="text-xs font-mono font-bold text-white uppercase">AI Cyber Professor Tutor</span>
          </div>

          <form onSubmit={handleAskTutor} className="space-y-2">
            <textarea
              value={tutorQuery}
              onChange={e => setTutorQuery(e.target.value)}
              rows={3}
              placeholder="Ask the AI Tutor any concept: 'Explain how SSRF can compromise AWS IAM credentials' or 'How does Diffie-Hellman work?'..."
              className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-blue-500/50 resize-none font-sans"
            />
            <button
              type="submit"
              disabled={isTutorLoading || !tutorQuery.trim()}
              className="w-full py-2 px-3 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-40 text-white text-xs font-mono font-bold flex items-center justify-center space-x-1.5 shadow-md shadow-blue-600/20 transition-all"
            >
              {isTutorLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
              <span>Ask Cyber Professor</span>
            </button>
          </form>

          {/* Tutor Response Box */}
          <div className="flex-1 p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 leading-relaxed overflow-y-auto min-h-[220px]">
            {tutorReply ? (
              <div className="whitespace-pre-wrap font-sans">{tutorReply}</div>
            ) : (
              <div className="text-slate-500 font-mono text-[11px] text-center pt-12">
                Ask any question above to receive rigorous academic and offensive/defensive cybersecurity guidance.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
